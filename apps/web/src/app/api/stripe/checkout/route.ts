import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { assertStripeCheckoutReady, getAppBaseUrl } from "@/lib/env";
import { getStripe, getPriceId, type CheckoutTier } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Vui lòng đăng nhập trước khi thanh toán" },
      { status: 401 }
    );
  }

  const ready = assertStripeCheckoutReady();
  if (!ready.ok) {
    return NextResponse.json({ error: ready.message }, { status: 400 });
  }

  const { tier } = await request.json();
  if (tier !== "PRO" && tier !== "VIP") {
    return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const priceId = getPriceId(tier as CheckoutTier);
    const baseUrl = getAppBaseUrl();

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        userId: session.user.id,
        tier,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe không trả về URL thanh toán" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe lỗi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
