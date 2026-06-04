import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrCreateGuestId } from "@/lib/guest";
import { startPlay } from "@/lib/plays";

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const guestId = userId ? null : await getOrCreateGuestId();

  const result = await startPlay(userId, guestId);

  if (!result.ok) {
    return NextResponse.json(
      { error: "quota_exceeded", message: "Đã hết 5 lượt chơi thử. Nâng cấp Pro hoặc Vip." },
      { status: 403 }
    );
  }

  const questions = result.questions.map((q) => ({
    id: q.id,
    step: q.step,
    question: q.question,
    options: q.options,
  }));

  return NextResponse.json({
    playId: result.playId,
    questions,
  });
}
