"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type SignInFormProps = {
  showGoogle?: boolean;
  showGithub?: boolean;
};

export function SignInForm({ showGoogle = false, showGithub = false }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/play";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showOAuth = showGoogle || showGithub;

  async function mergeGuest() {
    await fetch("/api/guest/merge", { method: "POST" });
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Đăng ký thất bại");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      if (result.error === "Configuration") {
        setError(
          "Lỗi cấu hình server (Configuration). Trên Vercel kiểm tra AUTH_SECRET, NEXTAUTH_SECRET (cùng giá trị) và NEXTAUTH_URL / AUTH_URL = https://domain-của-bạn (có https://)."
        );
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
      return;
    }

    await mergeGuest();
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            mode === "login" ? "bg-indigo-100 text-indigo-800" : "bg-slate-100"
          }`}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            mode === "register" ? "bg-indigo-100 text-indigo-800" : "bg-slate-100"
          }`}
        >
          Đăng ký
        </button>
      </div>

      <form onSubmit={handleCredentials} className="space-y-3">
        {mode === "register" && (
          <input
            type="text"
            placeholder="Tên (tuỳ chọn)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Mật khẩu (≥6 ký tự)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "..." : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
        </button>
      </form>

      {showOAuth && (
        <>
          <div className="relative py-2">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </span>
            <span className="relative flex justify-center text-xs text-slate-400 bg-white px-2">
              hoặc
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {showGoogle && (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="rounded-xl border py-2 text-sm hover:bg-slate-50"
              >
                Google
              </button>
            )}
            {showGithub && (
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl })}
                className="rounded-xl border py-2 text-sm hover:bg-slate-50"
              >
                GitHub
              </button>
            )}
          </div>
        </>
      )}

      <p className="text-xs text-slate-500 text-center">
        Sau đăng nhập, lượt chơi guest sẽ được gộp vào tài khoản.
      </p>
      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
        <p className="font-medium text-slate-800">Tài khoản demo (sau npm run db:seed):</p>
        <p>admin@localhost — quản trị /admin</p>
        <p>pro@localhost / vip@localhost — mật khẩu demo123456</p>
      </div>
    </div>
  );
}
