export type Tier = "FREE" | "PRO" | "VIP";

export interface Question {
  id: string;
  step: number;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
}

export const FREE_PLAY_LIMIT = 5;
export const QUESTIONS_PER_PLAY = 10;

export const STEP_LABELS: Record<number, string> = {
  1: "Ý tưởng & MVP",
  2: "Luồng guest → paid",
  3: "Khởi tạo Next.js",
  4: "UI landing & game",
  5: "Database schema",
  6: "Auth",
  7: "API lượt chơi",
  8: "Stripe Product/Price",
  9: "Checkout Session",
  10: "Webhook",
  11: "Kiểm tra quyền",
  12: "Test end-to-end",
};
