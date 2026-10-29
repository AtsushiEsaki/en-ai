"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!active) return;

        if (error && error.name !== "AuthSessionMissingError") {
          setError("ログイン状態を確認できませんでした。");
        }

        setEmail(data.user?.email ?? null);
      } catch {
        if (active) {
          setError("ログイン状態を確認できませんでした。");
        }
      } finally {
        if (active) setIsChecking(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setEmail(session?.user.email ?? null);
      }
    });

    void checkUser();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError("ログアウトできませんでした。もう一度お試しください。");
        return;
      }

      // 表示中の相談内容も画面から消します。
      window.location.replace("/");
    } catch {
      setError("通信に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl bg-white/85 p-4 text-sm text-[#374151]">
      {isChecking ? (
        <p role="status">ログイン状態を確認しています…</p>
      ) : email ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="break-all">
            ログイン中：{email}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full border border-[#052c63] px-4 py-2 !text-black disabled:opacity-50"
          >
            {isLoggingOut ? "ログアウト中…" : "ログアウト"}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>ゲストとして利用中</p>

          <div className="flex gap-4">
            <Link href="/login" className="text-[#052c63] underline">
              ログイン
            </Link>

            <Link href="/signup" className="text-[#052c63] underline">
              会員登録
            </Link>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}