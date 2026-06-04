"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { canAccessVipLab, isAdminTier } from "@/lib/env";
import { SignOutButton } from "./SignOutButton";

export function HeaderClient() {
  const { data: session, status } = useSession();
  const tier = session?.user?.tier;

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-indigo-600 text-lg">
          Web Học Stripe Game
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/play" className="hover:text-indigo-600">
            Chơi quiz
          </Link>
          <Link href="/pricing" className="hover:text-indigo-600">
            Gói Pro / Vip
          </Link>
          {canAccessVipLab(tier) && (
            <Link href="/vip-lab" className="hover:text-indigo-600 font-medium">
              VIP Lab
            </Link>
          )}
          {isAdminTier(tier) && (
            <Link href="/admin" className="hover:text-indigo-600 font-medium">
              Admin
            </Link>
          )}
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs hidden sm:inline">
                {session.user.email} · {session.user.tier ?? "FREE"}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
