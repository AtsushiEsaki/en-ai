import OpenAI from "openai";
import { NextResponse } from "next/server";
import { EN_AI_PERSONA } from "@/lib/en-ai-persona";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Analysis = {
  cause: string;
  conditions: string;
  result: string;
  impact: string;
  nextStep: string;
};

type PastTurn = {
  question: string;
  analysis: Analysis;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(request: Request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return json({ error: "入力内容を読み取れませんでした。" }, 400);
    }

    if (!body || typeof body !== "object") {
      return json({ error: "入力内容が正しくありません。" }, 400);
    }

    const concern =
      typeof body.concern === "string" ? body.concern.trim() : "";

    if (!concern) {
      return json({ error: "悩みを入力してください。" }, 400);
    }

    if (concern.length > 2000) {
      return json({ error: "悩みは2000文字以内で入力してください。" }, 400);
    }

    let consultationId: string | null = null;

    if (body.consultationId != null) {
      if (
        typeof body.consultationId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          body.consultationId,
        )
      ) {
        return json({ error: "相談IDが正しくありません。" }, 400);
      }

      consultationId = body.consultationId;
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // 認証情報の確認に失敗した場合、ゲストとして保存を省略せず、
    // 再ログインを案内します。
    if (
      userError &&
      userError.name !== "AuthSessionMissingError"
    ) {
      return json(
        { error: "ログイン状態を確認できません。再ログインしてください。" },
        401,
      );
    }

    const pastTurns: PastTurn[] = [];

    if (consultationId) {
      if (!user) {
        return json(
          { error: "相談を再開するにはログインしてください。" },
          401,
        );
      }

      // RLSに加え、会員IDでも所有者を確認します。
      const { data: consultation, error: consultationError } =
        await supabase
          .from("consultations")
          .select("id")
          .eq("id", consultationId)
          .eq("user_id", user.id)
          .maybeSingle();

      if (consultationError) {
        return json({ error: "相談を確認できませんでした。" }, 500);
      }

      if (!consultation) {
        return json({ error: "相談が見つかりません。" }, 404);
      }

      // 直近12回の質問・回答を取得します。
      const { data: turns, error: historyError } = await supabase
        .from("consultation_turns")
        .select("question, analysis")
        .eq("consultation_id", consultationId)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(12);

      if (historyError) {
        return json({ error: "相談履歴を読み込めませんでした。" }, 500);
      }

      pastTurns.push(...((turns ?? []).reverse() as PastTurn[]));
    }

    const input: {
      role: "user" | "assistant";
      content: string;
    }[] = [];

    for (const turn of pastTurns) {
      input.push({
        role: "user",
        content: turn.question,
      });

      input.push({
        role: "assistant",
        content: JSON.stringify(turn.analysis),
      });
    }

    input.push({
      role: "user",
      content: concern,
    });

    const response = await openai.responses.create({
      model: "gpt-5.6",
      store: false,

      instructions: `
${EN_AI_PERSONA}

【このAPIで行う処理】
入力された悩みを、次の「因・縁・果・報」に分けて整理してください。

因：問題の直接的な原因や、本人の考え方
縁：原因に影響を与えている環境、人間関係、状況
果：現在起きている出来事や状態
報：そこから生じている感情、行動、周囲への影響

さらに、ユーザーが無理なく取り組める穏やかな「次の一歩」を
1つ提案してください。

過去のやり取りがある場合は、その文脈を踏まえて、
今回の追加質問や状況の変化に答えてください。
過去の整理を機械的に繰り返さず、必要に応じて見直してください。

【出力上の注意】
- 因・縁・果・報を断定せず、可能性として示してください
- ユーザー本人や他者を責めないでください
- 説教や宗教への勧誘をしないでください
- 医療、法律、心理状態について断定的な判断をしないでください
- 情報が不足している場合は、推測であることが分かる表現にしてください
- 因・縁・果・報の各項目は、分かりやすい日本語で2〜4文にしてください
- 次の一歩は、一度に多く提案せず1つにしてください
`,

      input,

      text: {
        format: {
          type: "json_schema",
          name: "inenkahou_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              cause: {
                type: "string",
                description: "因：問題の直接的な原因",
              },
              conditions: {
                type: "string",
                description: "縁：原因を取り巻く環境や条件",
              },
              result: {
                type: "string",
                description: "果：現在起きている状態",
              },
              impact: {
                type: "string",
                description: "報：感情や行動への影響",
              },
              nextStep: {
                type: "string",
                description: "穏やかな次の一歩",
              },
            },
            required: [
              "cause",
              "conditions",
              "result",
              "impact",
              "nextStep",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    if (response.status !== "completed" || !response.output_text) {
      return json(
        { error: "回答を生成できませんでした。もう一度お試しください。" },
        502,
      );
    }

    const analysis: Analysis = JSON.parse(response.output_text);

    // ゲストには回答を返しますが、履歴は保存しません。
    if (!user) {
      return json({
        analysis,
        consultationId: null,
        saved: false,
        saveError: null,
      });
    }

    // 新しい相談の場合は、相談の入れ物を作ります。
    if (!consultationId) {
      const { data: consultation, error: createError } =
        await supabase
          .from("consultations")
          .insert({
            user_id: user.id,
            title: concern.slice(0, 40),
          })
          .select("id")
          .single();

      if (createError || !consultation) {
        return json({
          analysis,
          consultationId: null,
          saved: false,
          saveError:
            "回答は生成されましたが、履歴を保存できませんでした。必要な内容をコピーして控えてください。",
        });
      }

      consultationId = consultation.id;
    }

    const { error: saveError } = await supabase
      .from("consultation_turns")
      .insert({
        consultation_id: consultationId,
        question: concern,
        analysis,
      });

    return json({
      analysis,
      consultationId,
      saved: !saveError,
      saveError: saveError
        ? "回答は生成されましたが、今回のやり取りを保存できませんでした。必要な内容をコピーして控えてください。"
        : null,
    });
  } catch {
    // 相談文や認証情報はログに出力しません。
    console.error("en-AI analysis request failed");

    return json(
      {
        error:
          "AIによる整理に失敗しました。もう一度お試しください。",
      },
      500,
    );
  }
}