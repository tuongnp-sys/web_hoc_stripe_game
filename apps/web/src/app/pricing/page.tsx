import Link from "next/link";
import { auth } from "@/auth";
import { CheckoutButton } from "@/components/CheckoutButton";
import { DevToolsPanel } from "@/components/DevToolsPanel";
import { StripeStatusBanner } from "@/components/StripeStatusBanner";
import { StripeTestGuide } from "@/components/StripeTestGuide";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ need?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const needVip = params.need === "vip";

  return (
    <div className="space-y-8">
      {needVip && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-900">
          VIP Lab chỉ dành cho gói <strong>Vip</strong>. Nâng cấp để mở khóa thực chiến code.
        </div>
      )}

      <h1 className="text-3xl font-bold text-center">Bảng giá</h1>
      <p className="text-center text-slate-600">
        Thanh toán qua Stripe Checkout (test mode). Đăng nhập trước khi mua.
      </p>

      <StripeTestGuide />
      <StripeStatusBanner />
      <DevToolsPanel />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Free</h2>
          <p className="text-3xl font-semibold mt-2">0đ</p>
          <ul className="mt-4 text-sm text-slate-600 space-y-2">
            <li>5 lượt quiz</li>
            <li>10 câu / lượt</li>
            <li>Guest hoặc đã đăng nhập</li>
          </ul>
          <Link
            href="/play"
            className="mt-6 block text-center rounded-xl border py-2 hover:bg-slate-50"
          >
            Chơi thử
          </Link>
        </div>

        <div className="rounded-2xl border-2 border-indigo-200 bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-indigo-700">Pro</h2>
          <p className="text-3xl font-semibold mt-2">99.000đ</p>
          <ul className="mt-4 text-sm text-slate-600 space-y-2">
            <li>Quiz không giới hạn</li>
            <li>Toàn bộ 48 câu hỏi</li>
          </ul>
          {session?.user ? (
            <CheckoutButton tier="PRO" label="Mua Pro (Stripe test)" className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50" />
          ) : (
            <Link
              href="/auth/signin?callbackUrl=/pricing"
              className="mt-6 block text-center rounded-xl bg-indigo-600 text-white py-2.5"
            >
              Đăng nhập để mua
            </Link>
          )}
        </div>

        <div className="rounded-2xl border-2 border-amber-200 bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-amber-700">Vip</h2>
          <p className="text-3xl font-semibold mt-2">199.000đ</p>
          <ul className="mt-4 text-sm text-slate-600 space-y-2">
            <li>Mọi quyền Pro</li>
            <li>VIP Lab — code Stripe từng bước</li>
          </ul>
          {session?.user ? (
            <CheckoutButton tier="VIP" label="Mua Vip (Stripe test)" className="mt-6 w-full rounded-xl bg-amber-600 px-4 py-2.5 text-white hover:bg-amber-700 disabled:opacity-50" />
          ) : (
            <Link
              href="/auth/signin?callbackUrl=/pricing"
              className="mt-6 block text-center rounded-xl bg-amber-600 text-white py-2.5"
            >
              Đăng nhập để mua
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
