import type { Tier } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier?: Tier;
      playsUsed?: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tier?: Tier;
    playsUsed?: number;
    email?: string | null;
  }
}
