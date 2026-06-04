"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function SuccessClient() {
  const { update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("Đang xác nhận thanh toán...");

  useEffect(() => {
    async function confirmAndRefresh() {
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        try {
          const res = await fetch("/api/stripe/confirm-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (res.ok) {
            setStatus(
              data.updated
                ? `Đã nâng cấp lên gói ${data.tier}!`
                : `Gói hiện tại: ${data.tier ?? "đã xử lý"}`
            );
          } else {
            setStatus(data.error ?? "Chưa xác nhận được — thử webhook hoặc liên hệ admin");
          }
        } catch {
          setStatus("Lỗi kết nối khi xác nhận session");
        }
      } else {
        setStatus("Không có session_id — tier chỉ đổi qua webhook");
      }

      await fetch("/api/session/refresh");
      await update();
      router.refresh();
    }
    confirmAndRefresh();
  }, [searchParams, update, router]);

  return (
    <div className="text-center py-12 rounded-2xl bg-white border shadow-sm">
      <h1 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h1>
      <p className="mt-4 text-slate-600">{status}</p>
      <p className="mt-2 text-sm text-slate-500">
        Stripe TEST mode — không trừ tiền thật. Thẻ test: 4242 4242 4242 4242
      </p>
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <Link href="/play" className="rounded-xl bg-indigo-600 px-6 py-2 text-white">
          Chơi quiz
        </Link>
        <Link href="/vip-lab" className="rounded-xl border px-6 py-2">
          VIP Lab
        </Link>
        <Link href="/pricing" className="rounded-xl border px-6 py-2">
          Bảng giá
        </Link>
      </div>
    </div>
  );
}
