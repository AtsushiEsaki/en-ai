import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm tracking-[0.2em] text-amber-700">
          古くから伝わる智慧で、いま抱えている悩みを整理してみませんか？
        </p>

        <h1 className="mb-6 text-5xl font-bold text-stone-800">
          en-ai
        </h1>

        <p className="mb-8 text-lg leading-8 text-stone-600">
          心の悩みには、原因となる「因」と、環境や人とのつながりである「縁」があります。
en-AIとの対話で悩みが生まれた背景を整理し、心を軽くするための次の一歩を見つけませんか？
        </p>

        <Link
          href="/chat"
          className="inline-block rounded-full bg-amber-700 px-8 py-4 font-medium text-white transition hover:bg-amber-800"
        >
          悩みを整理してみる
        </Link>
      </div>
    </main>
  );
}