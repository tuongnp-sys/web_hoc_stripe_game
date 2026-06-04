export const LAB_STEPS = [
  {
    step: 1,
    title: "Cấu hình Stripe keys (test mode)",
    description:
      "Điền Publishable Key (pk_test_...). Secret Key chỉ đặt trên server .env, không dán vào editor.",
    starterCode: `# .env.local (server)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Form — chỉ pk_test:
publishableKey = "pk_test_..."`,
    hint: "Lấy keys tại Stripe Dashboard → Developers → API keys (Test mode).",
  },
  {
    step: 2,
    title: "API tạo Checkout Session",
    description: "Viết route server gọi stripe.checkout.sessions.create với price_id.",
    starterCode: `// app/api/stripe/checkout/route.ts
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const { tier } = await req.json();
  const priceId = tier === "VIP"
    ? process.env.STRIPE_PRICE_VIP
    : process.env.STRIPE_PRICE_PRO;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId!, quantity: 1 }],
    success_url: \`\${process.env.NEXTAUTH_URL}/success\`,
    cancel_url: \`\${process.env.NEXTAUTH_URL}/cancel\`,
    metadata: { userId: "...", tier },
  });

  return Response.json({ url: session.url });
}`,
    hint: "price_id tạo trên Dashboard → Products.",
  },
  {
    step: 3,
    title: "Nút thanh toán test",
    description: "Client gọi API và redirect tới session.url. Dùng thẻ 4242 4242 4242 4242.",
    starterCode: `// Client
async function pay() {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ tier: "PRO" }),
  });
  const { url } = await res.json();
  window.location.href = url;
}`,
    hint: "Mở /pricing trên app chính để test Checkout thật.",
  },
  {
    step: 4,
    title: "Webhook handler",
    description: "Verify signature và cập nhật tier khi checkout.session.completed.",
    starterCode: `// app/api/stripe/webhook/route.ts
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const event = getStripe().webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  if (event.type === "checkout.session.completed") {
    // await prisma.user.update({ tier: metadata.tier })
  }
  return Response.json({ received: true });
}`,
    hint: "Dev: stripe listen --forward-to localhost:3000/api/stripe/webhook",
  },
  {
    step: 5,
    title: "Hoàn tất — unlock tier trong DB",
    description: "Xác nhận user tier PRO/VIP sau webhook; game mở khóa lượt chơi / VIP Lab.",
    starterCode: `// Sau webhook thành công:
// user.tier = "VIP"
// playsUsed không tăng khi tier !== FREE
// Redirect user tới /vip-lab`,
    hint: "Bấm 'Xác minh bước cuối' để nhận badge Stripe test OK.",
  },
];
