import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { AdminPanel } from "./AdminPanel";

export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/auth/signin?callbackUrl=/admin");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản trị</h1>
      <p className="text-slate-600 text-sm">
        Đăng nhập: {admin.user.email} · Tier: {admin.user.tier}
      </p>
      <AdminPanel />
    </div>
  );
}
