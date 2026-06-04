# Deploy — Vercel, Render, GitHub

## Biến môi trường (cùng một bộ)

| Biến                              | Local                          | Vercel / Render               |
| --------------------------------- | ------------------------------ | ----------------------------- |
| `DATABASE_URL`                    | Neon / Docker                  | Secret platform               |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | `.env`                         | Secret                        |
| `NEXTAUTH_URL`                    | `http://localhost:3000`        | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL`             | Cùng `NEXTAUTH_URL`            | Cùng URL production           |
| `STRIPE_SECRET_KEY`               | `sk_test_...` only             | `sk_test_...`                 |
| `STRIPE_PRICE_PRO` / `VIP`        | `price_...` test               | `price_...` test              |
| `STRIPE_WEBHOOK_SECRET`           | `stripe listen` hoặc Dashboard | Dashboard endpoint            |

**Không** set `VIP_LAB_ORIGIN=localhost` trên cloud — lab embed tại `/vip-lab/index.html` trên cùng app.

**Không** bật `ENABLE_DEV_TOOLS` trên production.

## Build (giống nhau mọi nơi)

```bash
npm install
npx prisma generate
npx prisma db push
npm run build:lab
npm run build --workspace=@web-hoc-stripe/web
```

`vercel.json` và `render.yaml` đã gọi lệnh tương đương.

## Vercel

1. Import GitHub repo, root = monorepo.
2. Env như bảng trên.
3. Stripe Webhook: `https://<domain>/api/stripe/webhook` → event `checkout.session.completed`.
4. Health: `GET /api/health`

## Render

Dùng [`render.yaml`](../render.yaml) hoặc tạo Web Service thủ công với build/start giống Vercel.

## GitHub Actions

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — build lab + Next trên mỗi push/PR.

## Local

- **Một terminal:** `npm run dev` (không cần `dev:lab` trừ khi sửa lab → `npm run dev:all`)
- Stripe local: `npm run stripe:check`
- Webhook tùy chọn: `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`
- Không webhook: `/success` gọi `confirm-session` vẫn lên tier

## VIP Lab

- Static: `apps/web/public/vip-lab/` (sau `npm run build:lab`)
- iframe: `/vip-lab/index.html` (trang Next `/vip-lab` bọc shell) — Vercel/Render/local

## Seed (một lần)

```bash
npm run db:seed
```

Không chạy seed tự động trên Vercel build.
