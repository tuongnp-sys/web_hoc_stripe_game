import type { Tier } from "@prisma/client";
import { prisma } from "./prisma";

export type PaidTier = "PRO" | "VIP";

export function isPaidTier(tier: string | undefined): tier is PaidTier {
  return tier === "PRO" || tier === "VIP";
}

export async function applyTierFromCheckoutMetadata(
  userId: string | undefined,
  tier: string | undefined,
  stripeCustomerId?: string | null
): Promise<{ updated: boolean; tier?: Tier }> {
  if (!userId || !isPaidTier(tier)) {
    return { updated: false };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { updated: false };

  if (user.tier === tier || user.tier === "ADMIN") {
    return { updated: false, tier: user.tier };
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      tier,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    },
  });

  return { updated: true, tier: updated.tier };
}
