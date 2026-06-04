import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { assertStripeCheckoutReady } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { applyTierFromCheckoutMetadata } from "@/lib/stripe-tier";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ready = assertStripeCheckoutReady();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.message }, { status: 400 });
  }

  const { sessionId } = await request.json();
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Thiếu sessionId" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Thanh toán chưa hoàn tất", status: checkoutSession.payment_status },
        { status: 400 }
      );
    }

    const metadataUserId = checkoutSession.metadata?.userId;
    if (metadataUserId !== session.user.id) {
      return NextResponse.json({ error: "Session không thuộc user hiện tại" }, { status: 403 });
    }

    const customerId =
      typeof checkoutSession.customer === "string"
        ? checkoutSession.customer
        : null;

    const result = await applyTierFromCheckoutMetadata(
      metadataUserId,
      checkoutSession.metadata?.tier,
      customerId
    );

    return NextResponse.json({
      ok: true,
      tier: result.tier ?? checkoutSession.metadata?.tier,
      updated: result.updated,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe lỗi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
