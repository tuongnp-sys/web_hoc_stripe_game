import { NextResponse } from "next/server";
import { getStripeConfigStatus } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = getStripeConfigStatus();
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json({
    ok: dbOk,
    db: dbOk,
    ...config,
    timestamp: new Date().toISOString(),
  });
}
