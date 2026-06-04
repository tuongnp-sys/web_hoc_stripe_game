import { NextResponse } from "next/server";
import type { Tier } from "@prisma/client";
import { requireAdmin, ASSIGNABLE_TIERS } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      playsUsed: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, tier } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
  }

  const allowed: Tier[] = [...ASSIGNABLE_TIERS, "ADMIN"];
  if (!allowed.includes(tier)) {
    return NextResponse.json({ error: "Tier không hợp lệ" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { tier },
    select: { id: true, email: true, tier: true },
  });

  return NextResponse.json({ ok: true, user });
}
