import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const paths = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "apps/web/.env"),
  ];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
    break;
  }
}

loadEnv();

const sk = process.env.STRIPE_SECRET_KEY;
const pricePro = process.env.STRIPE_PRICE_PRO;
const priceVip = process.env.STRIPE_PRICE_VIP;
const wh = process.env.STRIPE_WEBHOOK_SECRET;

let ok = true;

function fail(msg) {
  console.error("✗", msg);
  ok = false;
}
function pass(msg) {
  console.log("✓", msg);
}

console.log("\n--- Stripe TEST config check ---\n");

if (!sk?.startsWith("sk_test_")) {
  fail("STRIPE_SECRET_KEY phải là sk_test_... (Dashboard bật Test mode)");
} else {
  pass("STRIPE_SECRET_KEY là test key");
}

if (sk?.startsWith("sk_live_")) {
  fail("Dự án chỉ dùng TEST mode — không dùng sk_live_");
}

for (const [name, id] of [
  ["STRIPE_PRICE_PRO", pricePro],
  ["STRIPE_PRICE_VIP", priceVip],
]) {
  if (!id?.startsWith("price_") || /placeholder/i.test(id)) {
    fail(`${name} cần price_... thật từ Stripe Dashboard (Test mode)`);
  }
}

if (ok && sk) {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(sk);
    for (const [label, id] of [
      ["Pro", pricePro],
      ["Vip", priceVip],
    ]) {
      if (!id?.startsWith("price_")) continue;
      try {
        const price = await stripe.prices.retrieve(id);
        if (!price.active) fail(`Price ${label} (${id}) không active`);
        else pass(`Price ${label} (${id}) hợp lệ — ${price.currency} ${price.unit_amount}`);
      } catch (e) {
        fail(`Price ${label} (${id}): ${e.message}`);
      }
    }
  } catch (e) {
    fail(`Không gọi được Stripe API: ${e.message}`);
  }
}

if (!wh?.startsWith("whsec_") || /placeholder/i.test(wh)) {
  console.warn("⚠ STRIPE_WEBHOOK_SECRET chưa có — local vẫn OK nhờ confirm-session trên /success");
} else {
  pass("Webhook secret đã cấu hình");
}

console.log("");
if (ok) {
  console.log("Stripe TEST sẵn sàng cho Checkout. Thẻ test: 4242 4242 4242 4242\n");
  process.exit(0);
} else {
  console.log("Sửa .env và docs/STRIPE_SETUP.md\n");
  process.exit(1);
}
