import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0ABAB5] px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-[28px] font-bold leading-[1.4] tracking-[0.05em] text-[#374151]">
          古くから伝わる智慧で、<br/>いま抱えている悩みを
          整理してみませんか？
        </p>

        <h1 className="mb-6 text-5xl font-bold text-[#374151]">
          en-AI
        </h1>

        <p className="mb-8 text-[16px] leading-8 text-[#4B5563]">
          心の悩みには、原因となる「因」と、
          <br />
          環境や人とのつながりである「縁」があります。
          <br />
          en-AIとの対話で悩みが生まれた背景を整理し、
          <br />
          心を軽くするための次の一歩を見つけませんか？
          </p>

        <Link
          href="/chat"
          className="inline-block rounded-full bg-[#052c63] px-8 py skeleton-4 text-[36px] font-medium text-white transition hover:bg-[#0A417F]"
        >
          悩みを整理してみる
        </Link>
      </div>
    </main>
  );
}