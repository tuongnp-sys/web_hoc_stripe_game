# Web Học Stripe Game

Game quiz học tiến trình xây dựng dự án web tích hợp Stripe: **5 lượt chơi thử**, sau đó nâng cấp **Pro** / **Vip** qua **Stripe TEST** (thẻ `4242...`, không tiền thật).

## Tính năng

- **Guest**: 5 lượt quiz · **Pro/Vip**: quiz không giới hạn + VIP Lab (thực hành 5 bước Stripe + **khám phá cây thư mục dự án**)
- **Một lệnh dev**: `npm run dev` (VIP Lab build vào `/vip-lab/index.html`, không cần `:5173`)
- **Stripe TEST**: Checkout + `/success` tự cập nhật tier (không bắt buộc `stripe listen` khi local)
- **Admin** `/admin` · **Mock nạp** khi `ENABLE_DEV_TOOLS=true`

## Chạy nhanh (một terminal)

```bash
cp .env.example .env
# Điền DATABASE_URL, sk_test_, price_... (npm run stripe:check)

npm install
npx prisma generate
npx prisma db push
npm run db:seed

npm run dev    # predev tự build VIP Lab → http://localhost:3000
```

Đăng nhập demo: `vip@localhost` / `demo123456` → `/vip-lab` (tab **Khám phá dự án** để xem vai trò từng file Stripe/web)

## Stripe TEST

```bash
npm run stripe:check
```

Tạo Price trên [Stripe Dashboard](https://dashboard.stripe.com) (**Test mode**) → `.env` → Mua Pro/Vip → thẻ **4242 4242 4242 4242**.

Chi tiết: [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md)

## Deploy (GitHub → Vercel / Render)

- Build gồm VIP Lab (`npm run build:lab`) — cùng domain `/vip-lab/`
- Env: `NEXTAUTH_URL` = `NEXT_PUBLIC_APP_URL` = URL production
- Webhook: `https://<domain>/api/stripe/webhook`

[docs/DEPLOY.md](docs/DEPLOY.md) · CI: `.github/workflows/ci.yml`

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Next.js + VIP Lab (predev build lab) |
| `npm run dev:all` | Next + Vite HMR (sửa lab) |
| `npm run stripe:check` | Kiểm tra Stripe TEST env |
| `npm run build` | Lab + Next production |
| `npm run db:seed` | admin / pro / vip demo |
