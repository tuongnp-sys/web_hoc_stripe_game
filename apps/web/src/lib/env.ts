import type { Tier } from "@prisma/client";
import { resolveAuthBaseUrl } from "./auth-url";

const PLACEHOLDER_PATTERN = /placeholder|changeme|xxx$/i;

export function getAppBaseUrl(): string {
  return resolveAuthBaseUrl();
}

/** VIP Lab SPA: same-origin `/vip-lab/index.html` (tránh trùng route Next `/vip-lab`). HMR: :5173 */
export function getVipLabUrl(userId?: string): string {
  const useHmr =
    process.env.VIP_LAB_DEV_HMR === "true" && process.env.VIP_LAB_ORIGIN;
  const base = useHmr
    ? (process.env.VIP_LAB_ORIGIN ?? "http://localhost:5173").replace(/\/$/, "")
    : `${getAppBaseUrl()}/vip-lab`;
  const url = useHmr
    ? base.endsWith("/") ? base : `${base}/`
    : `${base}/index.html`;
  if (!userId) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}userId=${encodeURIComponent(userId)}`;
}

export function isProductionDeploy(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    (process.env.VERCEL === "1" ||
      !!process.env.RENDER ||
      process.env.VERCEL_ENV === "production")
  );
}

export function isDevToolsEnabled(): boolean {
  if (process.env.ENABLE_DEV_TOOLS !== "true") return false;
  if (process.env.VERCEL_ENV === "production") return false;
  return true;
}

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "admin@localhost";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function isAdminTier(tier: Tier | string | undefined): boolean {
  return tier === "ADMIN";
}

export function hasPaidTier(tier: Tier | string | undefined): boolean {
  return tier === "PRO" || tier === "VIP" || tier === "ADMIN";
}

export function canAccessVipLab(tier: Tier | string | undefined): boolean {
  return tier === "VIP" || tier === "ADMIN";
}

function isValidStripePriceId(id: string | undefined): boolean {
  if (!id) return false;
  if (PLACEHOLDER_PATTERN.test(id)) return false;
  return id.startsWith("price_");
}

function isValidStripeSecret(key: string | undefined): boolean {
  if (!key) return false;
  if (PLACEHOLDER_PATTERN.test(key)) return false;
  return key.startsWith("sk_test_");
}

export function getStripeConfigStatus() {
  const missing: string[] = [];
  const secret = process.env.STRIPE_SECRET_KEY;
  const pricePro = process.env.STRIPE_PRICE_PRO;
  const priceVip = process.env.STRIPE_PRICE_VIP;
  const webhook = process.env.STRIPE_WEBHOOK_SECRET;

  if (!isValidStripeSecret(secret)) missing.push("STRIPE_SECRET_KEY");
  if (!isValidStripePriceId(pricePro)) missing.push("STRIPE_PRICE_PRO");
  if (!isValidStripePriceId(priceVip)) missing.push("STRIPE_PRICE_VIP");

  const webhookOk =
    !!webhook &&
    !PLACEHOLDER_PATTERN.test(webhook) &&
    webhook.startsWith("whsec_");

  const usingLiveKey = secret?.startsWith("sk_live_");

  return {
    stripeConfigured: missing.length === 0,
    webhookConfigured: webhookOk,
    missingEnv: missing,
    appBaseUrl: getAppBaseUrl(),
    devToolsEnabled: isDevToolsEnabled(),
    stripeTestModeOnly: true,
    usingLiveKey,
    vipLabUrl: getVipLabUrl(),
  };
}

export function assertStripeCheckoutReady(): { ok: true } | { ok: false; message: string } {
  const status = getStripeConfigStatus();
  if (!status.stripeConfigured) {
    return {
      ok: false,
      message: `Stripe chưa cấu hình đủ. Thiếu hoặc sai: ${status.missingEnv.join(", ")}. Xem docs/STRIPE_SETUP.md`,
    };
  }
  return { ok: true };
}
