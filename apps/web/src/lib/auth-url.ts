/** Auth.js / NextAuth — secret và base URL (Vercel + local) */

const DEV_FALLBACK_SECRET = "dev-only-auth-secret-min-32-characters-long";

function normalizeToOrigin(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

/** URL gốc app — luôn hợp lệ cho `new URL()` */
export function resolveAuthBaseUrl(): string {
  const vercelHost = process.env.VERCEL_URL?.trim();
  const candidates = [
    process.env.NEXTAUTH_URL,
    process.env.AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    vercelHost ? (vercelHost.startsWith("http") ? vercelHost : `https://${vercelHost}`) : undefined,
    "http://localhost:3000",
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const origin = normalizeToOrigin(raw);
    if (origin) return origin;
  }

  return "http://localhost:3000";
}

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (secret?.trim()) return secret.trim();

  if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
    return DEV_FALLBACK_SECRET;
  }

  const msg =
    "Missing AUTH_SECRET or NEXTAUTH_SECRET. Set both to the same random string on Vercel.";
  if (process.env.NODE_ENV === "production") {
    console.error(`[auth] ${msg}`);
  }
  throw new Error(msg);
}

/** Gắn AUTH_URL trước khi khởi tạo NextAuth (tránh Invalid URL trên Vercel) */
export function ensureAuthEnv(): void {
  const base = resolveAuthBaseUrl();
  if (!process.env.AUTH_URL) process.env.AUTH_URL = base;
  if (!process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = base;
}

export function hasGoogleOAuth(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
    process.env.GOOGLE_CLIENT_SECRET?.trim()
  );
}

export function hasGitHubOAuth(): boolean {
  return !!(
    process.env.GITHUB_CLIENT_ID?.trim() &&
    process.env.GITHUB_CLIENT_SECRET?.trim()
  );
}

export function hasOAuthProviders(): boolean {
  return hasGoogleOAuth() || hasGitHubOAuth();
}
