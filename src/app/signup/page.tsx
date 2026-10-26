"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (signupError) {
        setError(
          "登録手続きを完了できませんでした。入力内容を確認して、もう一度お試しください。",
        );
        return;
      }

      setMessage(
        "確認メールをご確認ください。メールが届いた場合は、本文のリンクを開いて登録を完了してください。",
      );
      setPassword("");
    } catch {
      setError(
        "通信に失敗しました。しばらくしてから、もう一度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#0ABAB5] px-5 py-12 text-[#374151]">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm text-[#052c63]">
          ← トップへ戻る
        </Link>

        <h1 className="mb-4 mt-8 text-3xl font-bold">
          en-AI 会員登録
        </h1>

        <p className="mb-8 leading-7">
          メールアドレスとパスワードを登録してください。
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-medium"
            >
              メールアドレス
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-medium"
            >
              パスワード
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              aria-describedby="password-help"
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            <p
              id="password-help"
              className="mt-2 text-sm text-gray-600"
            >
              12文字以上で設定してください。
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#052c63] px-6 py-3 text-white disabled:opacity-50"
          >
            {isLoading ? "登録手続き中…" : "会員登録する"}
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