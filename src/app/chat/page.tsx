"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Analysis = {
  cause: string;
  conditions: string;
  result: string;
  impact: string;
  nextStep: string;
};

export default function ChatPage() {
  const [concern, setConcern] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [submittedConcern, setSubmittedConcern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!concern.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysis(null);
    setSubmittedConcern(concern.trim());

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concern: concern.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "分析に失敗しました。");
      }

      setAnalysis(data.analysis);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("予期しないエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#0ABAB5] px-5 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-10 inline-block text-sm font-medium text-[#052c63] hover:opacity-70"
        >
          ← トップへ戻る
        </Link>

        <p className="mb-3 text-sm tracking-[0.2em] text-[#374151]">
          EN-AI DIALOGUE
        </p>

        <h1 className="mb-4 text-3xl font-bold leading-relaxed text-[#374151]">
          今、どのようなことで悩んでいますか？
        </h1>

        <p className="mb-8 text-[16px] leading-8 text-[#4B5563]">
          悩みが整理されていなくても大丈夫です。
          <br />
          今感じている愚痴や不安、迷っていることを
          ご自身の言葉で自由に入力してください。
          <br />
          一緒に整理していきましょう。
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={concern}
            onChange={(event) => setConcern(event.target.value)}
            placeholder="例：仕事を続けるべきか、転職すべきか悩んでいます……"
            maxLength={2000}
            className="min-h-52 w-full rounded-2xl border border-[#052c63]/30 bg-white p-5 text-[16px] text-[#374151] outline-none transition focus:border-[#052c63]"
          />

          <div className="mt-3 text-right text-sm text-[#4B5563]">
            {concern.length} / 2000文字
          </div>

          <button
            type="submit"
            disabled={!concern.trim() || isLoading}
            className="mt-6 w-full rounded-full bg-[#052c63] px-8 py-4 text-[16px] font-medium text-white transition hover:bg-[#0A417F] disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isLoading
              ? "悩みを整理しています……"
              : "因・縁・果・報で整理する"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-10 text-center text-[#4B5563]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/50 border-t-[#052c63]" />
            AIが内容を丁寧に整理しています。
          </div>
        )}

        {analysis && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-[#374151]">
              あなたの悩みを整理しました
            </h2>

            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm font-medium text-stone-500">
                入力された悩み
              </p>

              <p className="whitespace-pre-wrap leading-7 text-stone-700">
                {submittedConcern}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard
                title="因"
                subtitle="直接的な原因"
                text={analysis.cause}
              />

              <ResultCard
                title="縁"
                subtitle="原因を取り巻く条件"
                text={analysis.conditions}
              />

              <ResultCard
                title="果"
                subtitle="現在起きていること"
                text={analysis.result}
              />

              <ResultCard
                title="報"
                subtitle="感情や行動への影響"
                text={analysis.impact}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[#052c63] p-6">
              <p className="mb-2 text-sm font-medium text-white">
                次の一歩
              </p>

              <p className="whitespace-pre-wrap leading-7 text-white">
                {analysis.nextStep}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

type ResultCardProps = {
  title: string;
  subtitle: string;
  text: string;
};

function ResultCard({ title, subtitle, text }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-[#052c63]/20 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#052c63] text-xl font-bold text-white">
          {title}
        </span>

        <h3 className="font-bold text-stone-800">
          {subtitle}
        </h3>
      </div>

      <p className="whitespace-pre-wrap leading-7 text-stone-600">
        {text}
      </p>
    </div>
  );
}