import type { Question } from "./types";

export const QUESTIONS: Question[] = [
  // Bước 1 — Ý tưởng & MVP
  {
    id: "q1-1",
    step: 1,
    question: "MVP hợp lý nhất cho game học Stripe là gì?",
    options: [
      "Quiz thử 5 lượt, sau đó nạp phí mở khóa",
      "Chỉ landing page không có game",
      "Bán source code trên GitHub ngay từ đầu",
    ],
    correctIndex: 0,
    explanation: "MVP nên có luồng thử → paywall → paid để học đúng tiến trình thương mại hóa.",
  },
  {
    id: "q1-2",
    step: 1,
    question: "Khi xác định phạm vi dự án web có nạp tiền, điều nào nên ưu tiên trước?",
    options: [
      "Luồng unlock nội dung sau thanh toán",
      "Tích hợp 20 cổng thanh toán cùng lúc",
      "Thiết kế logo trước khi có luồng thanh toán",
    ],
    correctIndex: 0,
    explanation: "Luồng unlock (tier Pro/Vip) là lõi nghiệp vụ của sản phẩm trả phí.",
  },
  {
    id: "q1-3",
    step: 1,
    question: "Phân biệt Pro và Vip trong game học nên dựa trên?",
    options: [
      "Quyền tính năng (quiz vs thêm lab code)",
      "Màu avatar người chơi",
      "Số lượng font chữ trên trang",
    ],
    correctIndex: 0,
    explanation: "Gói trả phí nên map rõ quyền: Pro = quiz không giới hạn, Vip = thêm thực chiến.",
  },
  {
    id: "q1-4",
    step: 1,
    question: "Stripe test mode dùng để làm gì trong giai đoạn MVP?",
    options: [
      "Thử thanh toán và webhook không dùng tiền thật",
      "Chạy production với khách hàng thật",
      "Thay thế hoàn toàn database",
    ],
    correctIndex: 0,
    explanation: "Test mode cho phép mô phỏng Checkout và webhook an toàn khi học.",
  },
  // Bước 2 — Luồng guest → paid
  {
    id: "q2-1",
    step: 2,
    question: "Luồng chơi thử 5 lượt nên đếm ở đâu?",
    options: [
      "Server (DB/cookie httpOnly), không chỉ localStorage",
      "Chỉ sessionStorage trình duyệt",
      "Đếm bằng số lần refresh trang",
    ],
    correctIndex: 0,
    explanation: "Lưu server-side tránh reset quota khi xóa cache hoặc đổi trình duyệt.",
  },
  {
    id: "q2-2",
    step: 2,
    question: "Khi hết 5 lượt, UX đúng nhất là?",
    options: [
      "Hiện paywall dẫn tới trang pricing / Stripe Checkout",
      "Ẩn luôn toàn bộ website",
      "Cho chơi tiếp nhưng không chấm điểm",
    ],
    correctIndex: 0,
    explanation: "Paywall rõ ràng chuyển người dùng sang bước thanh toán.",
  },
  {
    id: "q2-3",
    step: 2,
    question: "Guest chưa đăng nhập nên được nhận diện bằng?",
    options: [
      "Cookie guestId + bản ghi GuestPlay",
      "Địa chỉ MAC máy người dùng",
      "Tên file HTML",
    ],
    correctIndex: 0,
    explanation: "guestId uuid trong cookie httpOnly là pattern phổ biến cho trial.",
  },
  {
    id: "q2-4",
    step: 2,
    question: "Sau khi user đăng nhập, dữ liệu lượt chơi guest nên?",
    options: [
      "Merge vào tài khoản (playsUsed cộng dồn)",
      "Xóa hết và reset về 0",
      "Bỏ qua, tạo account mới mỗi lần",
    ],
    correctIndex: 0,
    explanation: "Merge giữ trải nghiệm liên tục và tránh lạm dụng đăng ký lại.",
  },
  // Bước 3 — Khởi tạo Next.js
  {
    id: "q3-1",
    step: 3,
    question: "Vì sao chọn Next.js App Router cho dự án này?",
    options: [
      "API Routes + UI cùng repo, phù hợp webhook Stripe",
      "Chỉ render static, không cần server",
      "Không hỗ trợ TypeScript",
    ],
    correctIndex: 0,
    explanation: "Next.js gộp frontend và API (Checkout, webhook) trong một codebase.",
  },
  {
    id: "q3-2",
    step: 3,
    question: "File `.env.local` nên chứa?",
    options: [
      "Biến bí mật (STRIPE_SECRET_KEY, DATABASE_URL)",
      "Toàn bộ mã nguồn production",
      "Mật khẩu user đã hash sẵn trong git",
    ],
    correctIndex: 0,
    explanation: "Secrets chỉ ở env, không commit vào git.",
  },
  {
    id: "q3-3",
    step: 3,
    question: "Monorepo với packages/shared dùng để?",
    options: [
      "Chia sẻ câu hỏi quiz và types giữa app và lab",
      "Chạy hai database khác nhau",
      "Thay thế Stripe SDK",
    ],
    correctIndex: 0,
    explanation: "shared gom dữ liệu quiz và hằng số dùng chung.",
  },
  {
    id: "q3-4",
    step: 3,
    question: "Prisma trong dự án đóng vai trò?",
    options: [
      "ORM truy cập PostgreSQL (User, plays, tier)",
      "CSS framework",
      "Công cụ deploy Vercel",
    ],
    correctIndex: 0,
    explanation: "Prisma quản lý schema và truy vấn DB type-safe.",
  },
  // Bước 4 — UI
  {
    id: "q4-1",
    step: 4,
    question: "Trang `/pricing` cần hiển thị gì?",
    options: [
      "So sánh Free / Pro / Vip và nút nâng cấp",
      "Chỉ ảnh nền full màn hình",
      "Danh sách commit git",
    ],
    correctIndex: 0,
    explanation: "Pricing phải map gói với quyền và CTA thanh toán.",
  },
  {
    id: "q4-2",
    step: 4,
    question: "Trang `/play` nên hiển thị với user Free?",
    options: [
      "Tiến độ câu hỏi và 'Còn X/5 lượt'",
      "Toàn bộ đáp án đúng ngay từ đầu",
      "Form đăng ký domain",
    ],
    correctIndex: 0,
    explanation: "Người chơi cần biết quota còn lại để hiểu paywall.",
  },
  {
    id: "q4-3",
    step: 4,
    question: "Sau Stripe Checkout thành công, redirect hợp lý?",
    options: [
      "/success với hướng dẫn chơi tiếp hoặc vào VIP Lab",
      "/404",
      "Trang login của Stripe Dashboard",
    ],
    correctIndex: 0,
    explanation: "success_url xác nhận thanh toán và hướng dẫn bước tiếp.",
  },
  {
    id: "q4-4",
    step: 4,
    question: "Landing `/` nên nhấn mạnh?",
    options: [
      "CTA 'Chơi thử' và lợi ích học Stripe qua game",
      "Chỉ copyright footer",
      "API documentation OpenAPI",
    ],
    correctIndex: 0,
    explanation: "Landing chuyển đổi visitor → bắt đầu trial quiz.",
  },
  // Bước 5 — Database
  {
    id: "q5-1",
    step: 5,
    question: "Bảng nào lưu số lượt chơi thử hợp lý nhất?",
    options: [
      "GuestPlay / playsUsed trên User",
      "Chỉ localStorage",
      "File JSON tĩnh trên CDN",
    ],
    correctIndex: 0,
    explanation: "playsUsed gắn guestId hoặc userId trên server.",
  },
  {
    id: "q5-2",
    step: 5,
    question: "Trường `tier` trên User nên là enum?",
    options: [
      "FREE, PRO, VIP",
      "Chuỗi tự do không validate",
      "Boolean isPaid duy nhất",
    ],
    correctIndex: 0,
    explanation: "Enum tier rõ ràng cho middleware và UI.",
  },
  {
    id: "q5-3",
    step: 5,
    question: "PlaySession lưu gì sau mỗi lượt quiz?",
    options: [
      "score, total, questionIds, userId/guestId",
      "Chỉ IP address",
      "Screenshot màn hình",
    ],
    correctIndex: 0,
    explanation: "Lịch sử lượt chơi hỗ trợ thống kê và debug.",
  },
  {
    id: "q5-4",
    step: 5,
    question: "ActivePlay dùng để?",
    options: [
      "Giữ trạng thái lượt đang chơi (câu hỏi + đáp án tạm)",
      "Cache ảnh Stripe",
      "Lưu secret key",
    ],
    correctIndex: 0,
    explanation: "Một lượt đang dở cần state server-side trước khi submit.",
  },
  // Bước 6 — Auth
  {
    id: "q6-1",
    step: 6,
    question: "NextAuth (Auth.js) hỗ trợ trong dự án?",
    options: [
      "Credentials + Google + GitHub",
      "Chỉ đăng nhập bằng SMS",
      "Không cần session",
    ],
    correctIndex: 0,
    explanation: "Đa kênh auth theo kế hoạch: email và OAuth.",
  },
  {
    id: "q6-2",
    step: 6,
    question: "Mật khẩu user lưu thế nào?",
    options: [
      "bcrypt hash trong passwordHash, không lưu plain text",
      "Plain text trong cột password",
      "Gửi qua URL query",
    ],
    correctIndex: 0,
    explanation: "Hash một chiều là chuẩn bảo mật cơ bản.",
  },
  {
    id: "q6-3",
    step: 6,
    question: "API `/api/guest/merge` gọi khi nào?",
    options: [
      "Sau khi đăng nhập thành công",
      "Trước khi tạo database",
      "Mỗi lần load CSS",
    ],
    correctIndex: 0,
    explanation: "Merge chuyển playsUsed từ guest sang user.",
  },
  {
    id: "q6-4",
    step: 6,
    question: "Stripe Checkout yêu cầu user?",
    options: [
      "Nên đăng nhập để gắn metadata userId",
      "Không bao giờ cần identity",
      "Chỉ cần cookie quảng cáo",
    ],
    correctIndex: 0,
    explanation: "metadata.userId giúp webhook cập nhật đúng tài khoản.",
  },
  // Bước 7 — API lượt chơi
  {
    id: "q7-1",
    step: 7,
    question: "POST `/api/plays/start` cần kiểm tra?",
    options: [
      "playsUsed < 5 (FREE) hoặc tier PRO/VIP",
      "Chỉ User-Agent header",
      "Màu theme dark/light",
    ],
    correctIndex: 0,
    explanation: "Quota server-side trước khi phát câu hỏi.",
  },
  {
    id: "q7-2",
    step: 7,
    question: "Một lượt quiz gồm bao nhiêu câu?",
    options: [
      "10 câu ngẫu nhiên không trùng trong lượt",
      "1 câu duy nhất",
      "Toàn bộ 48 câu mỗi lượt",
    ],
    correctIndex: 0,
    explanation: "10 câu/lượt cân bằng thời gian chơi và học.",
  },
  {
    id: "q7-3",
    step: 7,
    question: "POST `/api/plays/submit` làm gì?",
    options: [
      "Chấm điểm, lưu PlaySession, tăng playsUsed nếu FREE",
      "Gửi email spam",
      "Xóa database",
    ],
    correctIndex: 0,
    explanation: "Submit kết thúc lượt và cập nhật quota.",
  },
  {
    id: "q7-4",
    step: 7,
    question: "GET `/api/me` trả về?",
    options: [
      "tier, playsUsed, playsRemaining, canPlay",
      "Stripe secret key",
      "Toàn bộ bảng User khác",
    ],
    correctIndex: 0,
    explanation: "Client dùng /api/me để render UI quota và tier.",
  },
  // Bước 8 — Stripe Product/Price
  {
    id: "q8-1",
    step: 8,
    question: "Sau khi tạo Price trên Stripe Dashboard, bước tiếp theo?",
    options: [
      "Gắn price_id vào API tạo Checkout Session phía server",
      "Dán Secret Key vào component React client",
      "Chỉ cần Publishable Key là đủ thu tiền",
    ],
    correctIndex: 0,
    explanation: "Checkout Session server-side dùng price ID và secret key.",
  },
  {
    id: "q8-2",
    step: 8,
    question: "Publishable Key (pk_test_) dùng ở đâu?",
    options: [
      "Client (nếu dùng Elements); Checkout redirect có thể chỉ cần server",
      "Commit vào git public",
      "Ghi vào webhook handler",
    ],
    correctIndex: 0,
    explanation: "pk_ an toàn hơn sk_ nhưng vẫn không lộ sk_ ra client.",
  },
  {
    id: "q8-3",
    step: 8,
    question: "Tách STRIPE_PRICE_PRO và STRIPE_PRICE_VIP để?",
    options: [
      "Map đúng gói khi tạo Checkout Session",
      "Trang trí .env",
      "Chạy quiz nhanh hơn",
    ],
    correctIndex: 0,
    explanation: "Mỗi tier một Price ID riêng trên Stripe.",
  },
  {
    id: "q8-4",
    step: 8,
    question: "Secret Key (sk_test_) được phép ở?",
    options: [
      "Chỉ server (API routes, webhook)",
      "Monaco editor VIP Lab phía browser",
      "Thẻ HTML meta tag",
    ],
    correctIndex: 0,
    explanation: "sk_ lộ client = lỗ hổng nghiêm trọng.",
  },
  // Bước 9 — Checkout Session
  {
    id: "q9-1",
    step: 9,
    question: "Tạo Checkout Session nên dùng mode?",
    options: [
      "payment (one-time) hoặc subscription tùy sản phẩm",
      "setup_intent cho quiz",
      "Không cần line_items",
    ],
    correctIndex: 0,
    explanation: "mode payment phù hợp mua một lần mở khóa Pro/Vip demo.",
  },
  {
    id: "q9-2",
    step: 9,
    question: "success_url và cancel_url nên?",
    options: [
      "Trỏ về /success và /cancel trên app của bạn",
      "Trỏ về google.com",
      "Để trống",
    ],
    correctIndex: 0,
    explanation: "Stripe redirect user về URL bạn kiểm soát.",
  },
  {
    id: "q9-3",
    step: 9,
    question: "metadata trong Session nên có?",
    options: [
      "userId và tier (PRO hoặc VIP)",
      "Mật khẩu user",
      "DATABASE_URL",
    ],
    correctIndex: 0,
    explanation: "Webhook đọc metadata để cập nhật tier đúng user.",
  },
  {
    id: "q9-4",
    step: 9,
    question: "Client nhận URL thanh toán bằng cách?",
    options: [
      "API server trả session.url, client redirect",
      "Hardcode link Dashboard",
      "window.alert sk_test",
    ],
    correctIndex: 0,
    explanation: "Server tạo session, client chỉ redirect tới url.",
  },
  // Bước 10 — Webhook
  {
    id: "q10-1",
    step: 10,
    question: "Webhook checkout.session.completed nên làm gì?",
    options: [
      "Cập nhật tier user trong DB theo metadata.userId",
      "Gửi email marketing hàng loạt",
      "Xóa cookie guest",
    ],
    correctIndex: 0,
    explanation: "Thanh toán thành công = nguồn sự thật để unlock tier.",
  },
  {
    id: "q10-2",
    step: 10,
    question: "Verify webhook signature cần?",
    options: [
      "STRIPE_WEBHOOK_SECRET và raw body",
      "Chỉ JSON.parse không verify",
      "Publishable key",
    ],
    correctIndex: 0,
    explanation: "constructEvent với whsec_ chống giả request.",
  },
  {
    id: "q10-3",
    step: 10,
    question: "Dev local test webhook dùng?",
    options: [
      "stripe listen --forward-to localhost:3000/api/stripe/webhook",
      "Chỉ sửa DB tay, không test webhook",
      "FTP upload",
    ],
    correctIndex: 0,
    explanation: "Stripe CLI forward event tới máy dev.",
  },
  {
    id: "q10-4",
    step: 10,
    question: "Nếu webhook fail, hậu quả?",
    options: [
      "User đã trả tiền nhưng tier chưa unlock — cần retry/idempotent",
      "Stripe tự sửa database Prisma",
      "Game tự động VIP vĩnh viễn",
    ],
    correctIndex: 0,
    explanation: "Webhook phải tin cậy; Stripe retry event.",
  },
  // Bước 11 — Kiểm tra quyền
  {
    id: "q11-1",
    step: 11,
    question: "Route `/vip-lab` nên bảo vệ?",
    options: [
      "Chỉ tier === VIP",
      "Mọi guest",
      "Chỉ khi có Publishable Key",
    ],
    correctIndex: 0,
    explanation: "Lab thực chiến là quyền Vip.",
  },
  {
    id: "q11-2",
    step: 11,
    question: "User PRO được phép?",
    options: [
      "Quiz không giới hạn, không VIP Lab",
      "VIP Lab nhưng không quiz",
      "Không được chơi quiz",
    ],
    correctIndex: 0,
    explanation: "Phân tầng: Pro = quiz unlimited; Vip = thêm lab.",
  },
  {
    id: "q11-3",
    step: 11,
    question: "Kiểm tra quota ở đâu là đúng?",
    options: [
      "API /api/plays/start (không chỉ UI)",
      "Chỉ ẩn nút bằng CSS",
      "Chỉ kiểm tra ở trang pricing",
    ],
    correctIndex: 0,
    explanation: "Authorization phải enforce server-side.",
  },
  {
    id: "q11-4",
    step: 11,
    question: "Middleware Next.js có thể?",
    options: [
      "Redirect /vip-lab nếu chưa VIP",
      "Thay thế PostgreSQL",
      "Tạo Stripe Price",
    ],
    correctIndex: 0,
    explanation: "Middleware bảo vệ route sớm trước khi render.",
  },
  // Bước 12 — Test E2E
  {
    id: "q12-1",
    step: 12,
    question: "Thẻ test Stripe phổ biến?",
    options: [
      "4242 4242 4242 4242",
      "0000 0000 0000 0001 real card",
      "Số CMND người dùng",
    ],
    correctIndex: 0,
    explanation: "4242... là thẻ test success mặc định.",
  },
  {
    id: "q12-2",
    step: 12,
    question: "E2E test: guest 5 lượt xong thì?",
    options: [
      "Bị chặn start → thấy pricing → Checkout → lượt 6+ nếu Pro",
      "Tự động VIP không cần trả",
      "Reset plays khi F5",
    ],
    correctIndex: 0,
    explanation: "Luồng đầy đủ trial → pay → unlock.",
  },
  {
    id: "q12-3",
    step: 12,
    question: "VIP Lab bước cuối verify?",
    options: [
      "API /api/lab/verify xác nhận hoàn thành checklist",
      "User tự gõ 'done' không kiểm tra",
      "Chỉ xem video",
    ],
    correctIndex: 0,
    explanation: "Server validate từng bước lab, không tin client.",
  },
  {
    id: "q12-4",
    step: 12,
    question: "Sau khi webhook + tier VIP, user có thể?",
    options: [
      "Vào /vip-lab code từng bước Stripe test mode",
      "Chỉ xem trang 403",
      "Chỉ chơi 1 lượt nữa",
    ],
    correctIndex: 0,
    explanation: "Vip unlock cả quiz unlimited và lab thực chiến.",
  },
];

export function pickQuestionsForPlay(count: number): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
