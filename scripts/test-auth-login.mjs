/**
 * Smoke test: credentials login + protected routes (local or production).
 * Usage: node scripts/test-auth-login.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

async function login(email, password) {
  const jar = new Map();
  const store = (res) => {
    const raw = res.headers.getSetCookie?.() ?? [];
    const lines = raw.length ? raw : (res.headers.get("set-cookie")?.split(/,(?=\s*\w+=)/) ?? []);
    for (const line of lines) {
      const part = line.split(";")[0]?.trim();
      if (!part) continue;
      const eq = part.indexOf("=");
      if (eq > 0) jar.set(part.slice(0, eq), part.slice(eq + 1));
    }
  };
  const cookieHeader = () =>
    [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");

  const csrfRes = await fetch(`${base}/api/auth/csrf`, {
    headers: cookieHeader() ? { Cookie: cookieHeader() } : {},
  });
  store(csrfRes);
  const { csrfToken } = await csrfRes.json();

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    callbackUrl: "/",
    json: "true",
  });

  const signInRes = await fetch(`${base}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(),
    },
    body,
    redirect: "manual",
  });
  store(signInRes);

  return { cookieHeader, signInStatus: signInRes.status, signInBody: await signInRes.text() };
}

async function fetchPath(cookieHeader, path) {
  const res = await fetch(`${base}${path}`, {
    headers: { Cookie: cookieHeader() },
    redirect: "manual",
  });
  return { status: res.status, location: res.headers.get("location") };
}

async function fetchJson(cookieHeader, path) {
  const res = await fetch(`${base}${path}`, {
    headers: { Cookie: cookieHeader() },
  });
  return { status: res.status, json: await res.json() };
}

async function main() {
  const health = await fetch(`${base}/api/health`).then((r) => r.json());
  console.log("health", {
    ok: health.ok,
    db: health.db,
    authBaseUrl: health.authBaseUrl,
    hasAuthSecret: health.hasAuthSecret,
    authUrlMisconfigured: health.authUrlMisconfigured,
  });

  const cases = [
    { email: "vip@localhost", password: "demo123456", path: "/vip-lab", expect: 200 },
    { email: "admin@localhost", password: "admin123456", path: "/admin", expect: 200 },
    { email: "pro@localhost", password: "demo123456", path: "/play", expect: 200 },
  ];

  let failed = false;
  for (const c of cases) {
    const { cookieHeader, signInStatus, signInBody } = await login(c.email, c.password);
    const page = await fetchPath(cookieHeader, c.path);
    const ok = page.status === c.expect;
    console.log(
      ok ? "PASS" : "FAIL",
      c.email,
      "signIn",
      signInStatus,
      "->",
      c.path,
      page.status,
      page.location ?? "",
      signInBody.slice(0, 80)
    );
    if (!ok) failed = true;
  }

  const pro = await login("pro@localhost", "demo123456");
  const me = await fetchJson(pro.cookieHeader, "/api/me");
  console.log("pro /api/me", me.status, me.json?.tier, me.json?.email);

  if (failed || me.json?.tier !== "PRO") {
    process.exit(1);
  }
  console.log("All auth smoke tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
