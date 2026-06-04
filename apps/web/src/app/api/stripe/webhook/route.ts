import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { applyTierFromCheckoutMetadata } from "@/lib/stripe-tier";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook chưa cấu hình" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const customerId =
      typeof checkoutSession.customer === "string"
        ? checkoutSession.customer
        : undefined;

    await applyTierFromCheckoutMetadata(
      checkoutSession.metadata?.userId,
      checkoutSession.metadata?.tier,
      customerId
    );
  }

  return NextResponse.json({ received: true });
}
