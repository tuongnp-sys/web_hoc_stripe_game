"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DevToolsPanel() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((r) => r.json())
      .then((c) => setEnabled(!!c.devToolsEnabled))
      .catch(() => {});
  }, []);

  if (!enabled) return null;

  async function mockCheckout(tier: "PRO" | "VIP") {
    setMsg(null);
    const res = await fetch("/api/dev/mock-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Lỗi");
      return;
    }
    setMsg(data.message);
    await update();
    router.refresh();
  }

  if (!session?.user) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Công cụ dev (mock nạp tiền)</p>
        <p className="mt-1">Đăng nhập trước để dùng thử nạp không qua Stripe.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-sm">
      <p className="font-semibold text-indigo-900">Thử nạp (dev — không qua Stripe)</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => mockCheckout("PRO")}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
        >
          Mock Pro
        </button>
        <button
          type="button"
          onClick={() => mockCheckout("VIP")}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700"
        >
          Mock Vip
        </button>
      </div>
      {msg && <p className="mt-2 text-indigo-800">{msg}</p>}
      <p className="mt-2 text-xs text-slate-500">
        Tài khoản seed: pro@localhost / vip@localhost — mật khẩu demo123456
      </p>
    </div>
  );
}
