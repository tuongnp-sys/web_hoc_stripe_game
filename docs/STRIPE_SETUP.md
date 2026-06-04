# Cấu hình Stripe (test mode)

## 1. Tạo tài khoản & bật Test mode

1. Đăng ký tại [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Bật **Test mode** (toggle góc trên)

## 2. API keys

Developers → API keys:

- **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- **Secret key** → `STRIPE_SECRET_KEY=sk_test_...` (chỉ server, không commit)

## 3. Products & Prices

Products → Add product:

| Sản phẩm | Giá gợi ý                  | Biến env                     |
| -------- | -------------------------- | ---------------------------- |
| Pro      | 99.000 VND (hoặc USD test) | `STRIPE_PRICE_PRO=price_...` |
| Vip      | 199.000 VND                | `STRIPE_PRICE_VIP=price_...` |

Copy **Price ID** (bắt đầu `price_`) vào `.env` — **không** dùng `price_placeholder`.

Kiểm tra:

```bash
npm run stripe:check
```

## 4. Webhook local (tùy chọn khi dev)

**Local không bắt buộc webhook:** sau Checkout, trang `/success` gọi `confirm-session` và cập nhật tier tự động.

Dùng đúng URL app (khớp `NEXTAUTH_URL` / port đang chạy, ví dụ 3000):

```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Copy `whsec_...` → `STRIPE_WEBHOOK_SECRET`

Trong Dashboard có thể thêm endpoint production sau.

Events cần: `checkout.session.completed`

## 5. Thẻ test

| Số thẻ              | Kết quả    |
| ------------------- | ---------- |
| 4242 4242 4242 4242 | Thành công |
| 4000 0000 0000 0002 | Từ chối    |

Expiry: bất kỳ tương lai · CVC: 3 số

## 6. Kiểm tra E2E

- [ ] `npm run stripe:check` pass
- [ ] Guest chơi 5 lượt → paywall
- [ ] Checkout Pro (4242...) → `/success` → tier PRO (không cần webhook local)
- [ ] Checkout Vip → `/vip-lab` (một lệnh `npm run dev`)
- [ ] VIP Lab tab **Khám phá dự án**: click `webhook/route.ts` (hoặc `api/stripe/`) — đọc giải thích + **Đến bước lab** nếu cần

## 7. Dev — thử nạp không qua Stripe

Trong `.env` (chỉ local / không production):

```env
ENABLE_DEV_TOOLS=true
```

- Trang `/pricing`: nút **Mock Pro** / **Mock Vip**
- Hoặc seed: `npm run db:seed` → đăng nhập `pro@localhost` / `vip@localhost` (demo123456)

## 8. OAuth (tuỳ chọn)

Google Cloud Console / GitHub OAuth App:

- Callback: `http://localhost:3000/api/auth/callback/google` (hoặc github)

Điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_*` trong `.env`.
