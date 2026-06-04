import { auth } from "@/auth";
import {
  corsPreflightResponse,
  jsonWithCors,
} from "@/lib/api-cors";
import { prisma } from "@/lib/prisma";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonWithCors(request, { error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.tier !== "VIP" && user?.tier !== "ADMIN") {
    return jsonWithCors(request, { error: "VIP required" }, { status: 403 });
  }

  const { step, payload } = await request.json();

  switch (step) {
    case 1: {
      const pk = payload?.publishableKey as string | undefined;
      const validPk = pk?.startsWith("pk_test_") || pk?.startsWith("pk_live_");
      if (!validPk) {
        return jsonWithCors(request, {
          passed: false,
          hint: "Publishable Key phải bắt đầu bằng pk_test_ (không dán Secret Key vào form).",
        });
      }
      return jsonWithCors(request, { passed: true, message: "Bước 1 OK — key format hợp lệ." });
    }
    case 2: {
      const hasRoute =
        typeof payload?.code === "string" &&
        payload.code.includes("checkout") &&
        payload.code.includes("stripe");
      if (!hasRoute) {
        return jsonWithCors(request, {
          passed: false,
          hint: "Code cần gọi Stripe để tạo Checkout Session (server-side).",
        });
      }
      return jsonWithCors(request, { passed: true, message: "Bước 2 OK — mẫu API checkout đúng hướng." });
    }
    case 3: {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey?.startsWith("sk_test_")) {
        return jsonWithCors(request, {
          passed: false,
          hint: "Cấu hình STRIPE_SECRET_KEY sk_test_ trên server để demo.",
        });
      }
      return jsonWithCors(request, {
        passed: true,
        message: "Bước 3 OK — server Stripe test mode sẵn sàng.",
        demoUrl: "/pricing",
      });
    }
    case 4: {
      const hasWebhook =
        typeof payload?.code === "string" &&
        (payload.code.includes("webhook") || payload.code.includes("constructEvent"));
      if (!hasWebhook) {
        return jsonWithCors(request, {
          passed: false,
          hint: "Handler cần verify signature webhook (constructEvent).",
        });
      }
      return jsonWithCors(request, { passed: true, message: "Bước 4 OK — webhook handler mẫu." });
    }
    case 5: {
      await prisma.labProgress.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, currentStep: 5, completed: true },
        update: { currentStep: 5, completed: true },
      });
      return jsonWithCors(request, {
        passed: true,
        message: "Stripe test mode hoạt động — hoàn thành VIP Lab!",
        badge: "stripe-test-ok",
      });
    }
    default:
      return jsonWithCors(request, { error: "Bước không hợp lệ" }, { status: 400 });
  }
}
