import { auth } from "@/auth";
import { corsPreflightResponse, jsonWithCors } from "@/lib/api-cors";
import { prisma } from "@/lib/prisma";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonWithCors(request, { error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.tier !== "VIP" && user?.tier !== "ADMIN") {
    return jsonWithCors(request, { error: "VIP required" }, { status: 403 });
  }

  const progress = await prisma.labProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, currentStep: 1 },
    update: {},
  });

  return jsonWithCors(request, progress);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonWithCors(request, { error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.tier !== "VIP" && user?.tier !== "ADMIN") {
    return jsonWithCors(request, { error: "VIP required" }, { status: 403 });
  }

  const { currentStep, completed } = await request.json();

  const progress = await prisma.labProgress.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      currentStep: currentStep ?? 1,
      completed: completed ?? false,
    },
    update: {
      currentStep: currentStep ?? undefined,
      completed: completed ?? undefined,
    },
  });

  return jsonWithCors(request, progress);
}
