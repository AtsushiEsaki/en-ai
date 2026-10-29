"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import AuthStatus from "@/components/AuthStatus";
import { createClient } from "@/lib/supabase/client";

type Analysis = {
  cause: string;
  conditions: string;
  result: string;
  impact: string;
  nextStep: string;
};

type Consultation = {
  id: string;
  title: string;
  created_at: string;
};

type Turn = {
  id: string;
  question: string;
  analysis: Analysis;
};

export default function ChatPage() {
  const [concern, setConcern] = useState("");
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.getUser();

        if (!active) return;

        if (authError && authError.name !== "AuthSessionMissingError") {
          setError("ログイン状態を確認できません。再読み込みしてください。");
          return;
        }

        setIsMember(Boolean(data.user));

        if (data.user) {
          const { data: history, error: historyError } = await supabase
            .from("consultations")
            .select("id, title, created_at")
            .eq("user_id", data.user.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (!active) return;

          if (historyError) {
            setError("相談一覧を読み込めませんでした。");
          } else {
            setConsultations(history ?? []);
          }
        }
      } catch {
        if (active) setError("画面の読み込みに失敗しました。");
      } finally {
        if (active) setIsChecking(false);
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, []);

  async function openConsultation(id: string) {
    if (isLoading || isChecking) return;

    setIsLoading(true);
    setError("");
    setNotice("");

    try {
      const supabase = createClient();

      const { data, error: historyError } = await supabase
        .from("consultation_turns")
        .select("id, question, analysis")
        .eq("consultation_id", id)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      if (historyError) {
        setError("相談履歴を読み込めませんでした。");
        return;
      }

      setConsultationId(id);
      setTurns((data ?? []) as Turn[]);
      setConcern("");
    } catch {
      setError("通信に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }

  function startNewConsultation() {
    if (isLoading || isChecking) return;

    setConsultationId(null);
    setTurns([]);
    setConcern("");
    setError("");
    setNotice("");
  }
async function deleteConsultation() {
  if (!consultationId || isLoading || isChecking) return;

  const confirmed = window.confirm(
    "この相談と、すべての質問・回答を削除します。元に戻せません。削除しますか？",
  );

  if (!confirmed) return;

  const deletingId = consultationId;

  setIsLoading(true);
  setError("");
  setNotice("");

  try {
    const supabase = createClient();

    const { data, error: deleteError } = await supabase
      .from("consultations")
      .delete()
      .eq("id", deletingId)
      .select("id");

    if (deleteError || !data?.length) {
      setError(
        "相談を削除できませんでした。ログイン状態を確認してお試しください。",
      );
      return;
    }

    setConsultations((previous) =>
      previous.filter((item) => item.id !== deletingId),
    );
    setConsultationId(null);
    setTurns([]);
    setConcern("");
    setNotice("相談を削除しました。");
  } catch {
    setError(
      "削除結果を確認できませんでした。画面を再読み込みして、相談一覧を確認してください。",
    );
  } finally {
    setIsLoading(false);
  }
}
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = concern.trim();
    if (!question || isLoading || isChecking) return;

    setIsLoading(true);
    setError("");
    setNotice("");

    try {
      // ゲストの過去の質問・回答は、現在のAPIには送信しません。
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concern: question,
          consultationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "回答を取得できませんでした。");
      }

      const newTurn: Turn = {
        id: crypto.randomUUID(),
        question,
        analysis: data.analysis,
      };

      setTurns((previous) => [...previous, newTurn]);
      setConcern("");

      if (data.consultationId) {
        const id: string = data.consultationId;
        setConsultationId(id);

        setConsultations((previous) =>
          previous.some((item) => item.id === id)
            ? previous
            : [
                {
                  id,
                  title: question.slice(0, 40),
                  created_at: new Date().toISOString(),
                },
                ...previous,
              ],
        );
      }

      if (data.saveError) {
        setNotice(data.saveError);
      } else if (data.saved) {
        setNotice("今回の質問と回答を保存しました。");
      } else {
        setNotice(
          "ゲストの質問・回答は保存されません。必要な内容はコピーして控えてください。",
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "予期しないエラーが発生しました。",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#0ABAB5] px-5 py-10 text-[#374151]">
      <div className="mx-auto max-w-3xl">
        <AuthStatus />

        <Link
          href="/"
          className="mb-8 inline-block text-sm text-[#052c63]"
        >
          ← トップへ戻る
        </Link>

        <h1 className="mb-4 text-3xl font-bold">
          en-AIと相談する
        </h1>

        <p className="mb-6 leading-7">
          今感じている悩みや迷いを、ご自身の言葉で入力してください。
        </p>

        {isChecking ? (
          <p role="status" className="mb-6">
            相談履歴を確認しています…
          </p>
        ) : isMember ? (
          <div className="mb-8 rounded-2xl bg-white/90 p-5">
            <p className="mb-4 text-sm leading-6">
              ログイン中の質問・回答は、ご自身の相談履歴に保存されます。
              同じ相談を続ける場合、AIは直近12回のやり取りを参照します。
            </p>

            <button
              type="button"
              onClick={startNewConsultation}
              disabled={isLoading}
              className="mb-4 rounded-full border border-[#052c63] px-5 py-2 !text-black disabled:opacity-50"
            >
              ＋ 新しい相談
            </button>

            <label
              htmlFor="consultation-history"
              className="mb-2 block text-sm font-medium"
            >
              過去の相談を開く（新しい順に最大50件）
            </label>

            <select
              id="consultation-history"
              value={consultationId ?? ""}
              disabled={isLoading}
              onChange={(event) => {
                if (event.target.value) {
                  void openConsultation(event.target.value);
                } else {
                  startNewConsultation();
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-black"
            >
              <option value="">新しい相談</option>

              {consultations.map((item) => (
                <option key={item.id} value={item.id}>
                  {new Date(item.created_at).toLocaleDateString("ja-JP")}
                  {" — "}
                  {item.title}
                </option>
              ))}
            </select>
            {consultationId && (
  <button
    type="button"
    onClick={deleteConsultation}
    disabled={isLoading || isChecking}
    className="mt-4 rounded-full border border-red-700 px-5 py-2 !text-red-700 disabled:opacity-50"
  >
    この相談を削除する
  </button>
)}
          </div>
        ) : (
          <div className="mb-8 rounded-2xl bg-white/90 p-5 text-sm leading-6">
            <p>
              ゲストの相談は保存されません。現在は質問ごとに回答し、
              前の質問・回答はAIへ引き継ぎません。
              履歴を保存して相談を続けるには、会員登録・ログインをご利用ください。
            </p>

            <p className="mt-2">
              登録前のやり取りを、登録後の履歴へ移す機能はまだありません。
            </p>

            <button
              type="button"
              onClick={startNewConsultation}
              disabled={isLoading}
              className="mt-3 rounded-full border border-[#052c63] px-4 py-2 !text-black disabled:opacity-50"
            >
              画面の相談内容をクリア
            </button>
          </div>
        )}

        <div className="space-y-8">
          {turns.map((turn, index) => (
            <section key={turn.id} className="space-y-4">
              <h2 className="text-xl font-bold">
                やり取り {index + 1}
              </h2>

              <div className="rounded-2xl bg-white p-6">
                <p className="mb-2 text-sm text-gray-500">
                  あなたの相談
                </p>
                <p className="whitespace-pre-wrap leading-7">
                  {turn.question}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard title="因" text={turn.analysis.cause} />
                <ResultCard title="縁" text={turn.analysis.conditions} />
                <ResultCard title="果" text={turn.analysis.result} />
                <ResultCard title="報" text={turn.analysis.impact} />
              </div>

             <div className="rounded-2xl bg-[#052c63] p-6">
  <p className="mb-2 font-bold !text-white">
    次の一歩
  </p>
  <p className="whitespace-pre-wrap leading-7 !text-white">
    {turn.analysis.nextStep}
  </p>
</div>
            </section>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <label
            htmlFor="concern"
            className="mb-3 block text-lg font-bold"
          >
            {turns.length > 0 ? "続けて相談する" : "相談内容"}
          </label>

          <textarea
            id="concern"
            value={concern}
            onChange={(event) => setConcern(event.target.value)}
            disabled={isLoading || isChecking}
            maxLength={2000}
            required
            placeholder="今感じていることを入力してください"
            className="min-h-40 w-full rounded-2xl border border-[#052c63]/30 bg-white p-5 text-[#374151]"
          />

          <p className="mt-2 text-right text-sm">
            {concern.length} / 2000文字
          </p>

          <button
            type="submit"
            disabled={!concern.trim() || isLoading || isChecking}
            className="mt-4 w-full rounded-full bg-[#052c63] px-8 py-4 text-white disabled:opacity-50"
          >
            {isLoading ? "処理しています…" : "因・縁・果・報で整理する"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-white p-4 leading-7"
          >
            {notice}
          </p>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h3 className="mb-3 text-xl font-bold text-[#052c63]">
        {title}
      </h3>
      <p className="whitespace-pre-wrap leading-7">{text}</p>
    </div>
  );
}