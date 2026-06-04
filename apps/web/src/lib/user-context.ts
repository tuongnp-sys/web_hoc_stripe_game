import { auth } from "@/auth";
import { getGuestId, getOrCreateGuestId } from "./guest";
import { canPlayMore, playsRemaining } from "./plays";
import { prisma } from "./prisma";

export async function getPlayerContext() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    const guestId = await getGuestId();
    return {
      userId,
      guestId,
      tier: user.tier,
      playsUsed: user.playsUsed,
      playsRemaining: playsRemaining(user.tier, user.playsUsed),
      canPlay: canPlayMore(user.tier, user.playsUsed),
      email: user.email,
      name: user.name,
    };
  }

  const guestId = await getOrCreateGuestId();
  const guest = await prisma.guestPlay.findUniqueOrThrow({
    where: { guestId },
  });

  return {
    userId: null,
    guestId,
    tier: "FREE" as const,
    playsUsed: guest.playsUsed,
    playsRemaining: playsRemaining("FREE", guest.playsUsed),
    canPlay: canPlayMore("FREE", guest.playsUsed),
    email: null,
    name: null,
  };
}
