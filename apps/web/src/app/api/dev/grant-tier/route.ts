import { NextResponse } from "next/server";
import type { Tier } from "@prisma/client";
import { requireAdmin, ASSIGNABLE_TIERS } from "@/lib/admin";
import { isDevToolsEnabled } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!isDevToolsEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Chỉ admin" }, { status: 403 });
  }

  const { userId, tier } = await request.json();
  if (!userId || !ASSIGNABLE_TIERS.includes(tier)) {
    return NextResponse.json({ error: "userId và tier không hợp lệ" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { tier: tier as Tier },
  });

  return NextResponse.json({ ok: true, userId, tier });
}
