# Sửa lỗi deploy & đăng nhập Vercel

## Cấu hình monorepo

1. **Settings → General → Root Directory** = `apps/web`
2. Build dùng [`apps/web/vercel.json`](../apps/web/vercel.json) — không `prisma db push` lúc build
3. `db:push` + `db:seed` chạy **một lần** từ máy (DATABASE_URL = Neon)

## Biến môi trường bắt buộc (Production + Preview, áp dụng khi Build)

| Biến | Ví dụ |
|------|--------|
| `AUTH_SECRET` | Chuỗi ngẫu nhiên ≥ 32 ký tự |
| `NEXTAUTH_SECRET` | **Cùng giá trị** `AUTH_SECRET` |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_URL` | Cùng URL (có `https://`) |
| `NEXT_PUBLIC_APP_URL` | Cùng URL |
| `DATABASE_URL` | Neon — nên dùng **pooled** connection string (`-pooler` host) nếu Neon gợi ý |

**Không** set `ENABLE_DEV_TOOLS` trên production.

## Lỗi đăng nhập "Server configuration" / vòng lặp form

- Thiếu `AUTH_SECRET` hoặc URL không có `https://` → sửa env → Redeploy
- **Không** để `NEXTAUTH_URL=http://localhost:3000` trên Vercel — code tự ưu tiên `VERCEL_URL`, nhưng nên set đúng URL production cho đồng bộ
- Kiểm tra: `GET https://<domain>/api/health` → `authBaseUrl` phải là domain Vercel, `authUrlMisconfigured: false`, `hasAuthSecret: true`
- Đã seed: `npm run db:seed` với `DATABASE_URL` trỏ Neon
- Chỉ đăng nhập email/mật khẩu; OAuth chỉ hiện khi có `GOOGLE_*` / `GITHUB_*`
- Sau đăng nhập redirect dùng full page load (tránh middleware chặn trước khi cookie gắn)
- Middleware phải `getToken` với `secureCookie: true` và `cookieName: __Secure-authjs.session-token` trên HTTPS/Vercel

## Sau khi sửa code auth

```bash
git add .
git commit -m "fix: NextAuth secret, AUTH_URL, Header client"
git push
```

Redeploy trên Vercel.
