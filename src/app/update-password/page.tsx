"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setError("");
    setMessage("");

    if (password !== confirmation) {
      setError("2つのパスワードが一致していません。");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error: userError } =
        await supabase.auth.getUser();

      if (userError || !data.user) {
        setError(
          "再設定の確認ができませんでした。新しい再設定メールから開き直してください。",
        );
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          "変更できませんでした。以前と異なる12文字以上のパスワードでお試しください。",
        );
        return;
      }

      setPassword("");
      setConfirmation("");
      setMessage("パスワードを変更しました。");
    } catch {
      setError("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#0ABAB5] px-5 py-12 text-[#374151]">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold">
          パスワードの再設定
        </h1>

        {!message && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-white p-6"
          >
            <div>
              <label htmlFor="password" className="mb-2 block">
                新しいパスワード（12文字以上）
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                required
                disabled={isLoading}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label htmlFor="confirmation" className="mb-2 block">
                新しいパスワード（確認）
              </label>
              <input
                id="confirmation"
                type="password"
                autoComplete="new-password"
                minLength={12}
                required
                disabled={isLoading}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#052c63] p-3 text-white disabled:opacity-50"
            >
              {isLoading ? "変更中…" : "パスワードを変更する"}
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {message && (
          <div className="mt-5 rounded-xl bg-white p-5">
            <p role="status">{message}</p>
            <Link
              href="/chat"
              className="mt-4 inline-block text-[#052c63] underline"
            >
              相談画面へ進む
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}