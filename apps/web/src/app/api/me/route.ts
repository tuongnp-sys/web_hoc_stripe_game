import { NextResponse } from "next/server";
import { getPlayerContext } from "@/lib/user-context";

export async function GET() {
  const ctx = await getPlayerContext();
  if (!ctx) {
    return NextResponse.json({ error: "Lỗi context" }, { status: 500 });
  }
  return NextResponse.json(ctx);
}
