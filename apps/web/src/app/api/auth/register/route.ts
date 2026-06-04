import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getGuestId } from "@/lib/guest";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email và mật khẩu (≥6 ký tự) là bắt buộc" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const guestId = await getGuestId();
    let playsUsed = 0;

    if (guestId) {
      const guest = await prisma.guestPlay.findUnique({ where: { guestId } });
      playsUsed = guest?.playsUsed ?? 0;
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        playsUsed,
      },
    });

    if (guestId) {
      await prisma.guestPlay.delete({ where: { guestId } }).catch(() => {});
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch {
    return NextResponse.json({ error: "Đăng ký thất bại" }, { status: 500 });
  }
}
