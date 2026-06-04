import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSecret } from "@/lib/auth-url";
import { handleApiCors } from "@/lib/api-cors";

function canAccessVipLab(tier: string | undefined) {
  return tier === "VIP" || tier === "ADMIN";
}

function isAdmin(tier: string | undefined, email: string | undefined) {
  if (tier === "ADMIN") return true;
  const admins = (process.env.ADMIN_EMAILS ?? "admin@localhost")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  return email ? admins.includes(email.toLowerCase()) : false;
}

/** Auth.js: HTTP → authjs.session-token, HTTPS/Vercel → __Secure-authjs.session-token */
function getSessionTokenCookieOptions(req: NextRequest) {
  const secure =
    process.env.VERCEL === "1" || req.nextUrl.protocol === "https:";
  return {
    secureCookie: secure,
    cookieName: secure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  };
}

export async function middleware(req: NextRequest) {
  const corsResponse = handleApiCors(req);
  if (corsResponse) return corsResponse;

  const token = await getToken({
    req,
    secret: getAuthSecret(),
    ...getSessionTokenCookieOptions(req),
  });

  const pathname = req.nextUrl.pathname;
  const userId = token?.sub;
  const tier = token?.tier as string | undefined;
  const email = (token?.email as string | undefined) ?? undefined;

  if (pathname.startsWith("/admin")) {
    if (!userId) {
      return NextResponse.redirect(
        new URL("/auth/signin?callbackUrl=/admin", req.url)
      );
    }
    if (!isAdmin(tier, email)) {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
    return NextResponse.next();
  }

  const isVipLabStatic =
    pathname.startsWith("/vip-lab/assets/") ||
    pathname === "/vip-lab/favicon.svg" ||
    pathname === "/vip-lab/icons.svg";

  if (isVipLabStatic) {
    return NextResponse.next();
  }

  const isVipLabShell =
    pathname === "/vip-lab" || pathname === "/vip-lab/";
  const isVipLabEmbed = pathname === "/vip-lab/index.html";

  if (isVipLabShell || isVipLabEmbed) {
    if (!userId) {
      return NextResponse.redirect(
        new URL("/auth/signin?callbackUrl=/vip-lab", req.url)
      );
    }
    if (!canAccessVipLab(tier)) {
      return NextResponse.redirect(new URL("/pricing?need=vip", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/vip-lab",
    "/vip-lab/",
    "/vip-lab/index.html",
    "/vip-lab/assets/:path*",
    "/admin/:path*",
  ],
};
