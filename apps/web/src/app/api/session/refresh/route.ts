import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Client gọi sau thanh toán / mock để lấy tier mới nhất từ DB */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tier: true, playsUsed: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    tier: user.tier,
    playsUsed: user.playsUsed,
    email: user.email,
    hint: "Gọi signIn lại hoặc reload trang để JWT cập nhật tier trong session.",
  });
}
