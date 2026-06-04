import { auth } from "@/auth";
import { getVipLabUrl } from "@/lib/env";
import { redirect } from "next/navigation";

export default async function VipLabPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/vip-lab");
  if (session.user.tier !== "VIP" && session.user.tier !== "ADMIN") {
    redirect("/pricing?need=vip");
  }

  const src = getVipLabUrl(session.user.id);

  return (
    <div className="space-y-3">
      <p className="text-slate-600 text-sm">
        Hoàn thành 5 bước: env → checkout API → thanh toán test → webhook → verify.
      </p>
      <iframe
        title="VIP Lab"
        src={src}
        className="w-full min-h-[85vh] h-[calc(100vh-10rem)] rounded-2xl border bg-white shadow-sm"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
