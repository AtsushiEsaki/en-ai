import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0ABAB5] px-5 py-12 sm:px-6">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-4 text-[28px] font-bold leading-[1.5] tracking-[0.02em] text-[#374151] sm:text-[36px] sm:leading-[1.4] sm:tracking-[0.05em]">
          古くから伝わる智慧で、
          <br className="hidden sm:block" />
          いま抱えている悩みを整理してみませんか？
        </p>

        <h1 className="mb-6 text-4xl font-bold text-[#374151] sm:text-5xl">
          en-AI
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-left text-[16px] leading-8 text-[#4B5563] sm:text-center">
          心の悩みには、原因となる「因」と、環境や人とのつながりである「縁」があります。
          <br className="hidden sm:block" />
          en-AIとの対話で悩みが生まれた背景を整理し、
          <br className="hidden sm:block" />
          心を軽くするための次の一歩を見つけませんか？
        </p>

        <Link
          href="/chat"
          className="inline-block w-full rounded-full bg-[#052c63] px-8 py-4 text-[16px] font-medium text-white transition hover:bg-[#0A417F] sm:w-auto"
        >
          悩みを整理してみる
        </Link>
      </div>
    </main>
  );
}