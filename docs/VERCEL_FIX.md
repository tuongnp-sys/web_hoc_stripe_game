# Sửa lỗi deploy Vercel (monorepo)

## Nguyên nhân thường gặp

1. **`prisma db push` lúc build** — Neon chưa kết nối được hoặc thiếu `DATABASE_URL` → build đỏ.
2. **`framework: null`** — Vercel không nhận app Next.js trong `apps/web`.
3. **Root Directory sai** — để `.` thay vì `apps/web`.

## Việc bạn cần làm trên Vercel (1 lần)

1. **Settings** → **General** → **Root Directory** → gõ: `apps/web` → Save.
2. **Settings** → **Environment Variables** — đảm bảo có `DATABASE_URL`, Stripe, `NEXTAUTH_URL`, …
3. **Deployments** → **Redeploy** (hoặc push commit mới lên GitHub).

## Sau khi deploy xong (1 lần trên máy)

```bash
cd d:\web_hoc_stripe_game
# .env trỏ DATABASE_URL Neon
npm run db:push
npm run db:seed
```

## Push code đã sửa

```bash
git add .
git commit -m "fix: Vercel monorepo build (apps/web root, no db push on build)"
git push
```
