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

## Lỗi đăng nhập "Server configuration"

- Thiếu `AUTH_SECRET` hoặc URL không có `https://` → sửa env → Redeploy
- Đã seed: `npm run db:seed` với `DATABASE_URL` trỏ Neon
- Chỉ đăng nhập email/mật khẩu; OAuth chỉ hiện khi có `GOOGLE_*` / `GITHUB_*`

## Sau khi sửa code auth

```bash
git add .
git commit -m "fix: NextAuth secret, AUTH_URL, Header client"
git push
```

Redeploy trên Vercel.
