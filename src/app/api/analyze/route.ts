import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const concern = body.concern;

    if (typeof concern !== "string" || !concern.trim()) {
      return NextResponse.json(
        { error: "悩みを入力してください。" },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6",

      instructions: `
あなたは、仏教の考え方を参考に、ユーザーの悩みを穏やかに整理する対話支援者です。

入力された悩みを、次の「因・縁・果・報」に分けてください。

因：問題の直接的な原因や、本人の考え方
縁：原因に影響を与えている環境、人間関係、状況
果：現在起きている出来事や状態
報：そこから生じている感情、行動、周囲への影響

断定や説教は避けてください。
ユーザー本人や他者を責めない表現にしてください。
医療・法律・宗教上の専門的判断は行わないでください。
情報が不足している場合は、推測であることが分かる表現にしてください。
各項目は、分かりやすい日本語で2〜4文にまとめてください。
`,

      input: concern.trim(),

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
                description: "ユーザーが考えられる穏やかな次の一歩",
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

    const analysis = JSON.parse(response.output_text);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("OpenAI API error:", error);

    return NextResponse.json(
      { error: "AIによる整理に失敗しました。もう一度お試しください。" },
      { status: 500 },
    );
  }
}