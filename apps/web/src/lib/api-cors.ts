import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolveAuthBaseUrl } from "./auth-url";

/** Origins được phép gọi API (VIP Lab :5173 → Next :3000) */
export function getAllowedOrigins(): string[] {
  const set = new Set<string>([
    "http://localhost:5173",
    "http://localhost:3000",
   
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
   
  ]);

  const add = (url?: string) => {
    if (!url) return;
    try {
      set.add(new URL(url).origin);
    } catch {
      set.add(url.replace(/\/$/, ""));
    }
  };

  add(process.env.VIP_LAB_ORIGIN);
  add(process.env.NEXT_PUBLIC_APP_URL);
  add(process.env.NEXTAUTH_URL);
  add(resolveAuthBaseUrl());

  return [...set];
}

export function resolveCorsOrigin(request: Request | NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const allowed = getAllowedOrigins();
  return allowed.includes(origin) ? origin : null;
}

export function buildCorsHeaders(
  request: Request | NextRequest,
  options?: { allowCredentials?: boolean }
): HeadersInit {
  const allowCredentials = options?.allowCredentials ?? true;
  const matched = resolveCorsOrigin(request);

  if (matched && allowCredentials) {
    return {
      "Access-Control-Allow-Origin": matched,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    };
  }

  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

export function applyCorsHeaders(
  response: NextResponse,
  request: Request | NextRequest
): NextResponse {
  const headers = buildCorsHeaders(request);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function corsPreflightResponse(request: Request | NextRequest): NextResponse {
  return applyCorsHeaders(new NextResponse(null, { status: 204 }), request);
}

export function jsonWithCors(
  request: Request | NextRequest,
  data: unknown,
  init?: ResponseInit
): NextResponse {
  const response = NextResponse.json(data, init);
  return applyCorsHeaders(response, request);
}

/** Middleware: xử lý OPTIONS + gắn CORS cho /api/* */
export function handleApiCors(req: NextRequest): NextResponse | null {
  if (!req.nextUrl.pathname.startsWith("/api/")) return null;

  if (req.method === "OPTIONS") {
    return corsPreflightResponse(req);
  }

  const origin = req.headers.get("origin");
  if (!origin) return null;

  const response = NextResponse.next();
  return applyCorsHeaders(response, req);
}
