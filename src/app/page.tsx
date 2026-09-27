import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#0ABAB5] text-[#374151]">

      {/* ファーストビュー */}
      <section className="flex min-h-dvh items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-4xl text-center">
          <p className="mb-4 text-[28px] font-bold leading-[1.5] tracking-[0.02em] lg:text-[36px] lg:leading-[1.4]">
            古くから受け継がれてきた智慧で、
            <br />
            人生をより実りのあるものに。
          </p>

          <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
            en-AI
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-[16px] leading-[1.9] text-[#4B5563]">
            en-AIは、古くから受け継がれてきた人生の智慧と
            AIとの対話を通じて、
            <br className="hidden sm:block" />
            いま抱えている悩みを整理し、
            <br className="hidden sm:block" />
            これからをよりよく生きるための一歩を見つける
            お手伝いをします。
          </p>

          <Link
            href="/chat"
            className="inline-block rounded-full bg-[#052c63] px-10 py-4 text-[16px] font-medium text-white transition hover:bg-[#0A417F]"
          >
            悩みを整理してみる
          </Link>
        </div>
      </section>


      {/* 4つの智慧 */}
      <section className="px-5 pb-20 pt-8 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-5xl">

          <div className="mb-12 text-center">
            <h2 className="mb-6 text-[28px] font-bold leading-[1.5] sm:text-4xl">
              人生を、より実りのあるものにするために
            </h2>

            <p className="mx-auto max-w-2xl text-[16px] leading-[1.9] text-[#4B5563]">
              古くから、人は
              <br />
              「なぜ苦しむのか」
              <br />
              「どう生きればよいのか」
              <br />
              を考え続けてきました。
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.9] text-[#4B5563]">
              en-AIでは、そこから受け継がれてきた智慧を、
              <br className="hidden sm:block" />
              4つの流れで捉えています。
            </p>
          </div>


          {/* 曼荼羅 */}
          <div className="mx-auto mb-16 max-w-3xl overflow-hidden rounded-[32px] bg-white p-3 shadow-lg sm:p-6">
            <img
              src="/en-ai-mandala.png"
              alt="en-AI 人生をより実りのあるものにするための4つの智慧"
              className="h-auto w-full"
            />
          </div>


          {/* 4項目 */}
          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl bg-white/85 p-7 shadow-sm backdrop-blur-sm sm:p-8">
              <p className="mb-2 text-xl font-bold text-[#052c63]">
                ① 苦を知る
              </p>

              <p className="mb-4 font-semibold">
                何に苦しんでいるのか
              </p>

              <p className="leading-[1.9] text-[#4B5563]">
                まずは、自分の苦しみや迷いに気づくことから始めます。
                不安、怒り、後悔、孤独、執着。
                すぐに答えを出そうとせず、
                「いま、自分は何に苦しんでいるのか」を丁寧に見つめます。
              </p>
            </div>


            <div className="rounded-3xl bg-white/85 p-7 shadow-sm backdrop-blur-sm sm:p-8">
              <p className="mb-2 text-xl font-bold text-[#052c63]">
                ② 因を知る
              </p>

              <p className="mb-4 font-semibold">
                なぜ苦しみが生まれるのか
              </p>

              <p className="leading-[1.9] text-[#4B5563]">
                物事は一つの原因だけで起きるとは限りません。
                自分の考え方、過去の経験、相手との関係、周囲の環境。
                さまざまな原因や条件を整理しながら、
                「なぜ、この苦しみが生まれているのか」を見つめます。
              </p>
            </div>


            <div className="rounded-3xl bg-white/85 p-7 shadow-sm backdrop-blur-sm sm:p-8">
              <p className="mb-2 text-xl font-bold text-[#052c63]">
                ③ 願いを立てる
              </p>

              <p className="mb-4 font-semibold">
                どう生きたいのか
              </p>

              <p className="leading-[1.9] text-[#4B5563]">
                悩みの背景が見えてきたら、
                「これから、自分はどう生きたいのか」を考えます。
                どんな人でありたいのか。
                何を大切にしたいのか。
                自分なりの願いが、人生の方向をつくります。
              </p>
            </div>


            <div className="rounded-3xl bg-white/85 p-7 shadow-sm backdrop-blur-sm sm:p-8">
              <p className="mb-2 text-xl font-bold text-[#052c63]">
                ④ 行を実践する
              </p>

              <p className="mb-4 font-semibold">
                今日から何をするのか
              </p>

              <p className="leading-[1.9] text-[#4B5563]">
                願いを持ったら、日々の行動へつなげます。
                相手の話を丁寧に聞く。
                感情的になる前に一度立ち止まる。
                今日できる小さな一歩を積み重ねることが、
                人生を少しずつ変えていきます。
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 最終CTA */}
      <section className="px-5 pb-24 pt-10 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-[28px] font-bold leading-[1.5] sm:text-3xl">
            いま抱えている悩みから、
            <br />
            始めてみませんか。
          </h2>

          <p className="mb-8 text-[16px] leading-[1.9] text-[#4B5563]">
            悩みが整理されていなくても大丈夫です。
            <br />
            愚痴でも、不安でも、
            「なんとなく苦しい」という気持ちでも構いません。
            <br />
            いま感じていることを、そのまま言葉にしてみてください。
          </p>

          <Link
            href="/chat"
            className="inline-block rounded-full bg-[#052c63] px-10 py-4 text-[16px] font-medium text-white transition hover:bg-[#0A417F]"
          >
            en-AIと話してみる
          </Link>
        </div>
      </section>

    </main>
  );
}