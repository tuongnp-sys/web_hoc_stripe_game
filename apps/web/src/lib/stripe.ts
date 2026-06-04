import Stripe from "stripe";
import { assertStripeCheckoutReady } from "./env";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const ready = assertStripeCheckoutReady();
  if (!ready.ok) throw new Error(ready.message);

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripe;
}

export type CheckoutTier = "PRO" | "VIP";

export function getPriceId(tier: CheckoutTier): string {
  const ready = assertStripeCheckoutReady();
  if (!ready.ok) throw new Error(ready.message);

  const priceId =
    tier === "PRO"
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_VIP;
  if (!priceId?.startsWith("price_")) {
    throw new Error(`Stripe price cho ${tier} chưa cấu hình hợp lệ`);
  }
  return priceId;
}
