"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  tier: string;
  playsUsed: number;
  createdAt: string;
};

const TIERS = ["FREE", "PRO", "VIP", "ADMIN"] as const;

export function AdminPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    else setMsg(data.error ?? "Lỗi tải danh sách");
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setTier(userId: string, tier: string) {
    setMsg(null);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tier }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Cập nhật thất bại");
      return;
    }
    setMsg(`Đã đổi ${data.user.email} → ${data.user.tier}`);
    load();
  }

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {msg && (
        <p className="bg-indigo-50 text-indigo-900 px-4 py-2 text-sm">{msg}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Lượt</th>
              <th className="px-4 py-2">Đổi tier</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.email ?? "—"}</td>
                <td className="px-4 py-2 font-medium">{u.tier}</td>
                <td className="px-4 py-2">{u.playsUsed}</td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.tier}
                    onChange={(e) => setTier(u.id, e.target.value)}
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
