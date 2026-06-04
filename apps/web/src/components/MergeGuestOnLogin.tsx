"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export function MergeGuestOnLogin() {
  const { status } = useSession();
  const merged = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !merged.current) {
      merged.current = true;
      fetch("/api/guest/merge", { method: "POST" }).catch(() => {});
    }
  }, [status]);

  return null;
}
