import type { Tier } from "@prisma/client";
import { auth } from "@/auth";
import { isAdminEmail, isAdminTier } from "./env";
import { prisma } from "./prisma";

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) return null;

  const isAdmin =
    isAdminTier(user.tier) || isAdminEmail(user.email);

  if (!isAdmin) return null;

  return { session, user };
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error("FORBIDDEN");
  return admin;
}

export const ASSIGNABLE_TIERS: Tier[] = ["FREE", "PRO", "VIP"];
