import {
  FREE_PLAY_LIMIT,
  QUESTIONS_PER_PLAY,
  getQuestionById,
  pickQuestionsForPlay,
} from "@web-hoc-stripe/shared";
import type { Tier } from "@prisma/client";
import { hasPaidTier } from "./env";
import { prisma } from "./prisma";

export function canPlayMore(tier: Tier, playsUsed: number): boolean {
  if (hasPaidTier(tier)) return true;
  return playsUsed < FREE_PLAY_LIMIT;
}

export function playsRemaining(tier: Tier, playsUsed: number): number | null {
  if (hasPaidTier(tier)) return null;
  return Math.max(0, FREE_PLAY_LIMIT - playsUsed);
}

export async function startPlay(userId: string | null, guestId: string | null) {
  let tier: Tier = "FREE";
  let playsUsed = 0;

  if (userId) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    tier = user.tier;
    playsUsed = user.playsUsed;
  } else if (guestId) {
    const guest = await prisma.guestPlay.findUniqueOrThrow({
      where: { guestId },
    });
    playsUsed = guest.playsUsed;
  } else {
    throw new Error("Không xác định được người chơi");
  }

  if (!canPlayMore(tier, playsUsed)) {
    return { ok: false as const, reason: "quota_exceeded" as const };
  }

  const questions = pickQuestionsForPlay(QUESTIONS_PER_PLAY);
  const questionIds = questions.map((q) => q.id);

  if (userId) {
    await prisma.activePlay.deleteMany({ where: { userId } });
    const active = await prisma.activePlay.create({
      data: { userId, questionIds, answers: [] },
    });
    return { ok: true as const, playId: active.id, questions };
  }

  await prisma.activePlay.deleteMany({ where: { guestId } });
  const active = await prisma.activePlay.create({
    data: { guestId: guestId!, questionIds, answers: [] },
  });
  return { ok: true as const, playId: active.id, questions };
}

export async function submitPlay(
  playId: string,
  answers: number[],
  userId: string | null,
  guestId: string | null
) {
  const active = await prisma.activePlay.findUnique({ where: { id: playId } });
  if (!active) throw new Error("Không tìm thấy lượt chơi");

  if (userId && active.userId !== userId) throw new Error("Không hợp lệ");
  if (guestId && active.guestId !== guestId) throw new Error("Không hợp lệ");

  let score = 0;
  const breakdown = active.questionIds.map((qid, i) => {
    const q = getQuestionById(qid);
    const correct = q ? answers[i] === q.correctIndex : false;
    if (correct) score++;
    return {
      questionId: qid,
      correct,
      correctIndex: q?.correctIndex,
      explanation: q?.explanation ?? "",
    };
  });

  const total = active.questionIds.length;

  await prisma.playSession.create({
    data: {
      userId: userId ?? undefined,
      guestId: guestId ?? undefined,
      questionIds: active.questionIds,
      score,
      total,
      completed: true,
    },
  });

  if (userId) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.tier === "FREE") {
      await prisma.user.update({
        where: { id: userId },
        data: { playsUsed: { increment: 1 } },
      });
    }
  } else if (guestId) {
    await prisma.guestPlay.update({
      where: { guestId },
      data: { playsUsed: { increment: 1 } },
    });
  }

  await prisma.activePlay.delete({ where: { id: playId } });

  return { score, total, breakdown };
}
