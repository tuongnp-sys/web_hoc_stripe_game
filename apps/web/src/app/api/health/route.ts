import { NextResponse } from "next/server";
import {
  hasAuthSecret,
  isLocalhostOrigin,
  resolveAuthBaseUrl,
} from "@/lib/auth-url";
import { getStripeConfigStatus } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = getStripeConfigStatus();
  const authBaseUrl = resolveAuthBaseUrl();
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const onVercel = process.env.VERCEL === "1";
  const authUrlMisconfigured =
    onVercel && isLocalhostOrigin(authBaseUrl);

  return NextResponse.json({
    ok: dbOk && hasAuthSecret() && !authUrlMisconfigured,
    db: dbOk,
    authBaseUrl,
    hasAuthSecret: hasAuthSecret(),
    authUrlMisconfigured,
    vercel: onVercel,
    ...config,
    timestamp: new Date().toISOString(),
  });
}
