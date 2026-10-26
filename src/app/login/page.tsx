"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(
          "ログインできませんでした。メールアドレス・パスワードと、メール確認が完了しているかをご確認ください。",
        );
        return;
      }

      window.location.assign("/chat");
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
          en-AI ログイン
        </h1>

        <p className="mb-8 leading-7">
          登録したメールアドレスとパスワードを入力してください。
        </p>

        <form
          onSubmit={handleLogin}
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#052c63] px-6 py-3 text-white disabled:opacity-50"
          >
            {isLoading ? "ログイン中…" : "ログイン"}
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

        <div className="mt-6 space-y-4 text-center text-sm">
          <p>
            <Link href="/signup" className="text-[#052c63] underline">
              初めての方はこちらから会員登録
            </Link>
          </p>

          <p>
            <Link href="/chat" className="text-[#052c63] underline">
              登録せずに相談する
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}