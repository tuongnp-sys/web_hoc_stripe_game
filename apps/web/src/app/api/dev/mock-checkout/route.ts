import { NextResponse } from "next/server";
import type { Tier } from "@prisma/client";
import { auth } from "@/auth";
import { isDevToolsEnabled } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!isDevToolsEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { tier } = await request.json();
  if (tier !== "PRO" && tier !== "VIP") {
    return NextResponse.json({ error: "Chỉ mock PRO hoặc VIP" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { tier: tier as Tier },
  });

  return NextResponse.json({
    ok: true,
    message: `[DEV] Đã gán gói ${tier} (mock, không qua Stripe). Đăng xuất/đăng nhập lại hoặc gọi /api/session/refresh.`,
    tier,
  });
}
