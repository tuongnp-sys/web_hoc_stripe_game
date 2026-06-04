"use client";

import { useEffect, useState } from "react";

type Me = {
  tier: string;
  playsUsed: number;
  playsRemaining: number | null;
  canPlay: boolean;
  email: string | null;
};

export function PlayerStatus() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => {});
  }, []);

  if (!me) return null;

  return (
    <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
      Gói: <strong>{me.tier}</strong>
      {me.playsRemaining !== null ? (
        <>
          {" "}
          · Còn <strong>{me.playsRemaining}</strong>/5 lượt thử
        </>
      ) : (
        <> · Quiz không giới hạn</>
      )}
      {!me.canPlay && (
        <span className="ml-2 text-amber-700 font-medium">(Đã hết lượt thử)</span>
      )}
    </div>
  );
}
