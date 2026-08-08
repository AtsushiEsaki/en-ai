import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm tracking-[0.2em] text-amber-700">
          仏教の智慧で、悩みを整理する
        </p>

        <h1 className="mb-6 text-5xl font-bold text-stone-800">
          en-ai
        </h1>

        <p className="mb-8 text-lg leading-8 text-stone-600">
          悩みや迷いを「因・縁・果・報」の視点から整理し、
          あなた自身が次の一歩を見つけるための対話サービスです。
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