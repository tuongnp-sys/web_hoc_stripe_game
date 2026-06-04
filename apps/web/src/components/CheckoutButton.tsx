"use client";

import { useEffect, useState } from "react";

export function CheckoutButton({
  tier,
  label,
  className = "",
}: {
  tier: "PRO" | "VIP";
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeOk, setStripeOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((c) => setStripeOk(!!c.stripeConfigured))
      .catch(() => setStripeOk(false));
  }, []);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Lỗi thanh toán");
        return;
      }
      if (data.url) window.location.href = data.url;
      else setError("Không nhận được URL Stripe");
    } catch {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || stripeOk === false;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={
          stripeOk === false
            ? "Cấu hình STRIPE_PRICE_PRO/VIP trong .env (xem /docs-stripe)"
            : undefined
        }
        className={
          className ||
          "w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        }
      >
        {loading
          ? "Đang chuyển..."
          : stripeOk === false
            ? "Stripe chưa cấu hình"
            : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
