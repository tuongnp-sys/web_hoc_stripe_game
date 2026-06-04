import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

export const GUEST_COOKIE = "guestId";

export async function getOrCreateGuestId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_COOKIE)?.value;
  if (existing) {
    await prisma.guestPlay.upsert({
      where: { guestId: existing },
      create: { guestId: existing },
      update: {},
    });
    return existing;
  }

  const guestId = uuidv4();
  cookieStore.set(GUEST_COOKIE, guestId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  await prisma.guestPlay.create({
    data: { guestId },
  });

  return guestId;
}

export async function getGuestId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_COOKIE)?.value ?? null;
}
