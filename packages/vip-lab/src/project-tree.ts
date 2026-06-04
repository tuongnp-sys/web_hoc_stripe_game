export type NodeKind = "root" | "folder" | "file";
export type NodeTag =
  | "stripe"
  | "auth"
  | "quiz"
  | "lab"
  | "db"
  | "deploy"
  | "config";

export type ProjectTreeNode = {
  id: string;
  name: string;
  kind: NodeKind;
  children?: ProjectTreeNode[];
  summary: string;
  description: string;
  tags?: NodeTag[];
  relatedLabSteps?: number[];
  relatedPaths?: string[];
};

export const PROJECT_TREE: ProjectTreeNode = {
  id: "root",
  name: "web_hoc_stripe_game",
  kind: "root",
  summary: "Monorepo: game quiz học Stripe + Next.js + VIP Lab",
  description:
    "Dự án gồm app web chính (Next.js), gói quiz dùng chung, VIP Lab thực hành code, Prisma cho database và tài liệu deploy. Mọi thanh toán chỉ chạy Stripe TEST mode.",
  tags: ["config"],
  children: [
    {
      id: "package.json",
      name: "package.json",
      kind: "file",
      summary: "Scripts workspace: dev, build, db, stripe:check",
      description:
        "Điểm điều khiển monorepo: `npm run dev` build lab rồi chạy Next.js; `build:lab` đưa VIP Lab vào public; `db:seed` tạo user demo.",
      tags: ["config", "deploy"],
      relatedPaths: ["scripts/check-stripe.mjs"],
    },
    {
      id: ".env.example",
      name: ".env.example",
      kind: "file",
      summary: "Mẫu biến môi trường — copy sang .env",
      description:
        "Liệt kê DATABASE_URL, AUTH_SECRET, STRIPE_SECRET_KEY (sk_test_), price_id, NEXTAUTH_URL. Không commit file .env thật.",
      tags: ["config", "stripe"],
      relatedLabSteps: [1],
      relatedPaths: ["apps/web/src/lib/env.ts"],
    },
    {
      id: "apps/web",
      name: "apps/web",
      kind: "folder",
      summary: "Ứng dụng Next.js 15 — quiz, auth, Stripe, admin",
      description:
        "App chính người dùng truy cập: trang chơi quiz, pricing, đăng nhập, webhook Stripe và API VIP Lab.",
      tags: ["stripe", "auth", "quiz"],
      children: [
        {
          id: "apps/web/src/app",
          name: "src/app",
          kind: "folder",
          summary: "App Router — mỗi thư mục = một route",
          description:
            "Next.js 15 dùng file-based routing: page.tsx là UI, api/.../route.ts là API serverless.",
          children: [
            {
              id: "apps/web/src/app/page.tsx",
              name: "page.tsx (/)",
              kind: "file",
              summary: "Trang chủ — giới thiệu và CTA",
              description: "Landing: hướng dẫn vào chơi quiz hoặc xem bảng giá Pro/Vip.",
              tags: ["quiz"],
            },
            {
              id: "apps/web/src/app/play",
              name: "play/",
              kind: "folder",
              summary: "Trang chơi quiz 48 câu",
              description:
                "Component QuizGame: guest 5 lượt, user đăng nhập theo tier. Gọi API plays/start và plays/submit.",
              tags: ["quiz"],
              relatedPaths: ["packages/shared", "apps/web/src/components/QuizGame.tsx"],
            },
            {
              id: "apps/web/src/app/pricing",
              name: "pricing/",
              kind: "folder",
              summary: "Bảng giá Pro/Vip + nút Checkout",
              description:
                "Hiển thị gói và CheckoutButton gọi POST /api/stripe/checkout. Thẻ test 4242... trên Stripe TEST.",
              tags: ["stripe"],
              relatedLabSteps: [3],
              relatedPaths: ["apps/web/src/components/CheckoutButton.tsx"],
            },
            {
              id: "apps/web/src/app/success",
              name: "success/",
              kind: "folder",
              summary: "Sau thanh toán — confirm session",
              description:
                "SuccessClient gọi /api/stripe/confirm-session để nâng tier khi webhook chưa kịp (local dev).",
              tags: ["stripe"],
              relatedLabSteps: [4, 5],
              relatedPaths: ["apps/web/src/app/api/stripe/confirm-session"],
            },
            {
              id: "apps/web/src/app/vip-lab",
              name: "vip-lab/",
              kind: "folder",
              summary: "Shell VIP — iframe nhúng lab SPA",
              description:
                "Chỉ user VIP/ADMIN. Iframe trỏ /vip-lab/index.html (build từ packages/vip-lab). Bạn đang dùng tính năng này.",
              tags: ["lab"],
              relatedPaths: ["packages/vip-lab"],
            },
            {
              id: "apps/web/src/app/api/stripe",
              name: "api/stripe/",
              kind: "folder",
              summary: "API Stripe — checkout, webhook, config",
              description: "Cốt lõi tích hợp thanh toán: tạo session, nhận webhook, xác nhận sau redirect.",
              tags: ["stripe"],
              relatedLabSteps: [2, 3, 4],
              children: [
                {
                  id: "apps/web/src/app/api/stripe/checkout",
                  name: "checkout/route.ts",
                  kind: "file",
                  summary: "Tạo Stripe Checkout Session",
                  description:
                    "POST nhận tier PRO/VIP, dùng STRIPE_PRICE_* và stripe.checkout.sessions.create, trả url redirect.",
                  tags: ["stripe"],
                  relatedLabSteps: [2],
                  relatedPaths: ["apps/web/src/lib/stripe.ts"],
                },
                {
                  id: "apps/web/src/app/api/stripe/webhook",
                  name: "webhook/route.ts",
                  kind: "file",
                  summary: "Webhook — verify signature, cập nhật tier",
                  description:
                    "Đọc raw body, constructEvent với STRIPE_WEBHOOK_SECRET, xử lý checkout.session.completed qua stripe-tier helper.",
                  tags: ["stripe"],
                  relatedLabSteps: [4],
                  relatedPaths: ["apps/web/src/lib/stripe-tier.ts"],
                },
                {
                  id: "apps/web/src/app/api/stripe/confirm-session",
                  name: "confirm-session/route.ts",
                  kind: "file",
                  summary: "Fallback local — không bắt buộc stripe listen",
                  description:
                    "Sau /success, client gọi API này để đồng bộ tier từ session_id khi webhook chưa tới.",
                  tags: ["stripe"],
                  relatedLabSteps: [5],
                },
                {
                  id: "apps/web/src/app/api/stripe/config",
                  name: "config/route.ts",
                  kind: "file",
                  summary: "Trả publishable key cho client (pk_test)",
                  description: "GET công khai pk_test và mode; CORS cho VIP Lab dev :5173.",
                  tags: ["stripe"],
                  relatedLabSteps: [1],
                },
              ],
            },
            {
              id: "apps/web/src/app/api/lab",
              name: "api/lab/",
              kind: "folder",
              summary: "API xác minh bước VIP Lab",
              description: "verify và progress: kiểm tra code/pk_test, lưu tiến độ LabProgress trong DB.",
              tags: ["lab", "stripe"],
              relatedLabSteps: [1, 2, 4, 5],
              children: [
                {
                  id: "apps/web/src/app/api/lab/verify",
                  name: "verify/route.ts",
                  kind: "file",
                  summary: "POST xác minh từng bước lab",
                  description:
                    "Kiểm tra nhẹ format pk_test_, từ khóa trong code, sk_test trên server — không thay Checkout thật.",
                  tags: ["lab"],
                },
                {
                  id: "apps/web/src/app/api/lab/progress",
                  name: "progress/route.ts",
                  kind: "file",
                  summary: "GET/POST tiến độ lab theo user",
                  description: "Đồng bộ currentStep trong bảng LabProgress (Prisma).",
                  tags: ["lab", "db"],
                },
              ],
            },
            {
              id: "apps/web/src/app/api/auth",
              name: "api/auth/",
              kind: "folder",
              summary: "NextAuth — đăng nhập email/OAuth",
              description: "Route [...nextauth] và register; session JWT chứa tier.",
              tags: ["auth"],
              relatedPaths: ["apps/web/src/auth.ts"],
            },
            {
              id: "apps/web/src/app/api/plays",
              name: "api/plays/",
              kind: "folder",
              summary: "API lượt chơi quiz",
              description: "start/submit: giới hạn 5 lượt guest, unlimited Pro/Vip theo tier.",
              tags: ["quiz", "db"],
            },
          ],
        },
        {
          id: "apps/web/src/lib",
          name: "src/lib",
          kind: "folder",
          summary: "Logic dùng chung server/client",
          description: "Stripe client, env validation, Prisma singleton, CORS lab, guest cookie.",
          children: [
            {
              id: "apps/web/src/lib/stripe.ts",
              name: "stripe.ts",
              kind: "file",
              summary: "Khởi tạo Stripe SDK (sk_test)",
              description: "getStripe() — chỉ gọi trên server, không lộ secret ra client.",
              tags: ["stripe"],
              relatedLabSteps: [2],
            },
            {
              id: "apps/web/src/lib/stripe-tier.ts",
              name: "stripe-tier.ts",
              kind: "file",
              summary: "Cập nhật tier user sau thanh toán",
              description: "Hàm dùng chung cho webhook và confirm-session: map metadata tier → Prisma User.",
              tags: ["stripe", "db"],
              relatedLabSteps: [4, 5],
            },
            {
              id: "apps/web/src/lib/env.ts",
              name: "env.ts",
              kind: "file",
              summary: "Validate env + getVipLabUrl",
              description:
                "Kiểm tra placeholder price/key; URL lab: index.html same-origin hoặc :5173 khi HMR.",
              tags: ["config", "lab"],
              relatedLabSteps: [1],
            },
            {
              id: "apps/web/src/lib/prisma.ts",
              name: "prisma.ts",
              kind: "file",
              summary: "Prisma client singleton",
              description: "Kết nối PostgreSQL — User, PlaySession, LabProgress, GuestPlay.",
              tags: ["db"],
            },
            {
              id: "apps/web/src/lib/api-cors.ts",
              name: "api-cors.ts",
              kind: "file",
              summary: "CORS cho VIP Lab iframe / :5173",
              description: "Cho phép lab gọi /api/lab/* và /api/stripe/config từ origin dev.",
              tags: ["lab", "config"],
            },
          ],
        },
        {
          id: "apps/web/src/components",
          name: "src/components",
          kind: "folder",
          summary: "UI tái sử dụng",
          description: "Header, quiz, checkout, session, merge guest.",
          children: [
            {
              id: "apps/web/src/components/CheckoutButton.tsx",
              name: "CheckoutButton.tsx",
              kind: "file",
              summary: "Nút Mua Pro/Vip → redirect Checkout",
              description: "Gọi API checkout, chuyển user sang trang thanh toán Stripe hosted.",
              tags: ["stripe"],
              relatedLabSteps: [3],
            },
            {
              id: "apps/web/src/components/QuizGame.tsx",
              name: "QuizGame.tsx",
              kind: "file",
              summary: "UI quiz 12 bước × 4 câu",
              description: "Import câu hỏi từ @web-hoc-stripe/shared, hiển thị tiến trình và điểm.",
              tags: ["quiz"],
            },
            {
              id: "apps/web/src/components/Header.tsx",
              name: "Header.tsx",
              kind: "file",
              summary: "Menu — Play, Pricing, VIP Lab, Admin",
              description: "Link /vip-lab chỉ hữu ích khi user đã có tier VIP.",
              tags: ["auth"],
            },
          ],
        },
        {
          id: "apps/web/src/middleware.ts",
          name: "middleware.ts",
          kind: "file",
          summary: "Bảo vệ /vip-lab, /admin, CORS API",
          description:
            "JWT tier check; static lab assets (/vip-lab/assets) không redirect; shell + index.html cần VIP.",
          tags: ["auth", "lab"],
        },
        {
          id: "apps/web/public/vip-lab",
          name: "public/vip-lab/",
          kind: "folder",
          summary: "Build output VIP Lab (sau build:lab)",
          description: "index.html + assets — embed trong iframe, base /vip-lab/.",
          tags: ["lab", "deploy"],
          relatedPaths: ["packages/vip-lab"],
        },
      ],
    },
    {
      id: "packages/shared",
      name: "packages/shared",
      kind: "folder",
      summary: "Quiz 48 câu — dùng chung web",
      description: "questions.ts: nội dung học 12 bước dự án web + Stripe; types export cho app.",
      tags: ["quiz"],
      children: [
        {
          id: "packages/shared/src/questions.ts",
          name: "questions.ts",
          kind: "file",
          summary: "Ngân hàng câu hỏi quiz",
          description: "Mỗi bước 4 câu — lý thuyết trước khi vào VIP Lab thực hành.",
          tags: ["quiz"],
        },
      ],
    },
    {
      id: "packages/vip-lab",
      name: "packages/vip-lab",
      kind: "folder",
      summary: "SPA Vite — lab + explorer (bạn đang ở đây)",
      description: "Monaco editor, 5 bước verify, tab khám phá cấu trúc project-tree.ts.",
      tags: ["lab"],
      children: [
        {
          id: "packages/vip-lab/src/App.tsx",
          name: "App.tsx",
          kind: "file",
          summary: "Tab Thực hành | Khám phá",
          description: "Điều phối mode practice/explore và gọi API verify.",
          tags: ["lab"],
        },
        {
          id: "packages/vip-lab/src/steps.ts",
          name: "steps.ts",
          kind: "file",
          summary: "5 bước starter code + hint",
          description: "Nội dung bài lab Stripe từ env → checkout → pay → webhook → DB.",
          tags: ["lab", "stripe"],
        },
        {
          id: "packages/vip-lab/src/project-tree.ts",
          name: "project-tree.ts",
          kind: "file",
          summary: "Manifest cây thư mục + giải thích",
          description: "Dữ liệu tĩnh cho Explorer — cập nhật khi repo đổi cấu trúc.",
          tags: ["lab"],
        },
      ],
    },
    {
      id: "prisma",
      name: "prisma/",
      kind: "folder",
      summary: "Schema DB và seed demo",
      description: "PostgreSQL: User.tier, LabProgress, PlaySession, NextAuth models.",
      tags: ["db"],
      children: [
        {
          id: "prisma/schema.prisma",
          name: "schema.prisma",
          kind: "file",
          summary: "Model User, Tier enum, LabProgress",
          description: "Tier FREE | PRO | VIP | ADMIN — webhook/confirm-session ghi vào User.tier.",
          tags: ["db", "stripe"],
          relatedLabSteps: [5],
        },
        {
          id: "prisma/seed.ts",
          name: "seed.ts",
          kind: "file",
          summary: "User demo: admin, pro, vip@localhost",
          description: "Chạy npm run db:seed để test nhanh không cần thanh toán.",
          tags: ["db", "config"],
        },
      ],
    },
    {
      id: "docs",
      name: "docs/",
      kind: "folder",
      summary: "Hướng dẫn Stripe và deploy",
      description: "STRIPE_SETUP.md, DEPLOY.md — checklist keys, webhook, Vercel/Render.",
      tags: ["deploy", "stripe"],
      children: [
        {
          id: "docs/STRIPE_SETUP.md",
          name: "STRIPE_SETUP.md",
          kind: "file",
          summary: "Cấu hình Stripe TEST từng bước",
          description: "Price ID, webhook secret, thẻ 4242, stripe:check.",
          tags: ["stripe", "deploy"],
          relatedLabSteps: [1, 2],
        },
        {
          id: "docs/DEPLOY.md",
          name: "DEPLOY.md",
          kind: "file",
          summary: "Deploy monorepo + build lab",
          description: "Env production, build:lab, iframe /vip-lab/index.html.",
          tags: ["deploy"],
        },
      ],
    },
    {
      id: "scripts/check-stripe.mjs",
      name: "scripts/check-stripe.mjs",
      kind: "file",
      summary: "npm run stripe:check",
      description: "Kiểm tra sk_test_, price_ thật, không placeholder trước khi dev/checkout.",
      tags: ["stripe", "config"],
      relatedLabSteps: [1],
    },
  ],
};

/** Flat index for lookup by id */
export function buildNodeIndex(
  root: ProjectTreeNode = PROJECT_TREE
): Map<string, ProjectTreeNode> {
  const map = new Map<string, ProjectTreeNode>();
  function walk(node: ProjectTreeNode) {
    map.set(node.id, node);
    node.children?.forEach(walk);
  }
  walk(root);
  return map;
}

export const NODE_INDEX = buildNodeIndex();
