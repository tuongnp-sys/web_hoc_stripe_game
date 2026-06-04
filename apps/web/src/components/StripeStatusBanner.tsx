"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Config = {
  stripeConfigured: boolean;
  webhookConfigured: boolean;
  missingEnv: string[];
  devToolsEnabled: boolean;
};

export function StripeStatusBanner() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  if (!config || config.stripeConfigured) return null;

  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-950 text-sm space-y-2">
      <p className="font-semibold">Stripe chưa cấu hình đủ — nút Mua Pro/Vip sẽ không hoạt động.</p>
      <p>Thiếu/sai: {config.missingEnv.join(", ") || "kiểm tra .env"}</p>
      <Link href="/docs-stripe" className="text-indigo-700 underline font-medium">
        Hướng dẫn cấu hình →
      </Link>
      {config.devToolsEnabled && (
        <p className="text-slate-700">
          Dev: dùng <strong>Thử nạp (mock)</strong> bên dưới hoặc đăng nhập{" "}
          <code>pro@localhost</code> / <code>vip@localhost</code> (sau <code>npm run db:seed</code>).
        </p>
      )}
      {!config.webhookConfigured && config.stripeConfigured && (
        <p className="text-slate-600">
          Webhook chưa cấu hình — local vẫn OK: trang /success tự xác nhận session sau Checkout test.
        </p>
      )}
    </div>
  );
}
