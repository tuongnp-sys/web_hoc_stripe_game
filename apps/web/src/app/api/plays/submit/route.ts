import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGuestId } from "@/lib/guest";
import { submitPlay } from "@/lib/plays";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const guestId = userId ? null : await getGuestId();

  if (!userId && !guestId) {
    return NextResponse.json({ error: "Không xác định người chơi" }, { status: 400 });
  }

  const { playId, answers } = await request.json();
  if (!playId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  try {
    const { score, total, breakdown } = await submitPlay(
      playId,
      answers,
      userId,
      guestId
    );

    return NextResponse.json({
      score,
      total,
      percent: Math.round((score / total) * 100),
      breakdown,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lỗi nộp bài" },
      { status: 400 }
    );
  }
}
