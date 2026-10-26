import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  if (!tokenHash || (type !== "email" && type !== "recovery")) {
    return new NextResponse(
      "確認リンクが無効です。新しい確認メールを取得してください。",
      { status: 400 },
    );
  }

  const destination =
    type === "recovery" ? "/update-password" : "/chat";

  const response = NextResponse.redirect(
    new URL(destination, request.url),
  );

  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      return new NextResponse(
        "リンクの有効期限が切れているか、使用済みです。新しい確認メールを取得してください。",
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
            "Referrer-Policy": "no-referrer",
          },
        },
      );
    }

    return response;
  } catch {
    return new NextResponse(
      "確認処理に失敗しました。しばらくしてからお試しください。",
      { status: 500 },
    );
  }
}