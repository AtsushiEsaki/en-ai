"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/confirm`,
        });

      if (resetError) {
        setError(
          "再設定メールの送信を受け付けられませんでした。少し時間を置いてお試しください。",
        );
        return;
      }

      setMessage(
        "登録済みのメールアドレスの場合、パスワード再設定メールが届きます。迷惑メールフォルダーもご確認ください。",
      );
    } catch {
      setError(
        "通信に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#0ABAB5] px-5 py-12 text-[#374151]">
      <div className="mx-auto max-w-md">
        <Link href="/login" className="text-sm text-[#052c63]">
          ← ログインへ戻る
        </Link>

        <h1 className="mb-4 mt-8 text-3xl font-bold">
          パスワードを忘れた方
        </h1>

        <p className="mb-8 leading-7">
          登録したメールアドレスを入力してください。
          パスワード再設定用のメールをお送りします。
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-6"
        >
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              メールアドレス
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-[#374151]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || Boolean(message)}
            className="w-full rounded-full bg-[#052c63] px-6 py-3 !text-white disabled:opacity-50"
          >
            {isLoading ? "送信中…" : "再設定メールを送る"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-white p-4 leading-7"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}