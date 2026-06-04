import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGuestId } from "@/lib/guest";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const guestId = await getGuestId();
  if (!guestId) {
    return NextResponse.json({ ok: true, merged: false });
  }

  const guest = await prisma.guestPlay.findUnique({ where: { guestId } });
  if (!guest) {
    return NextResponse.json({ ok: true, merged: false });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  if (user.tier === "FREE") {
    const newPlays = Math.max(user.playsUsed, guest.playsUsed);
    await prisma.user.update({
      where: { id: user.id },
      data: { playsUsed: newPlays },
    });
  }

  await prisma.activePlay.updateMany({
    where: { guestId },
    data: { guestId: null, userId: user.id },
  });

  await prisma.guestPlay.delete({ where: { guestId } }).catch(() => {});

  return NextResponse.json({ ok: true, merged: true, playsUsed: guest.playsUsed });
}
