import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Học Stripe qua game
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Trắc nghiệm 12 bước xây dựng dự án web có thanh toán Stripe. Chơi thử{" "}
          <strong>5 lượt</strong>, sau đó nâng cấp Pro hoặc Vip (Stripe test mode).
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/play"
            className="rounded-xl bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-700"
          >
            Chơi thử ngay
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-300 px-8 py-3 font-semibold hover:bg-white"
          >
            Xem gói Pro / Vip
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 border shadow-sm">
          <h3 className="font-bold text-slate-800">Free / Guest</h3>
          <p className="mt-2 text-sm text-slate-600">
            5 lượt quiz, mỗi lượt 10 câu về tiến trình dự án web + Stripe.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 border shadow-sm ring-2 ring-indigo-100">
          <h3 className="font-bold text-indigo-700">Pro</h3>
          <p className="mt-2 text-sm text-slate-600">Quiz không giới hạn sau thanh toán một lần.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 border shadow-sm ring-2 ring-amber-100">
          <h3 className="font-bold text-amber-700">Vip</h3>
          <p className="mt-2 text-sm text-slate-600">
            Pro + VIP Lab: code từng bước đến khi Stripe test mode hoạt động.
          </p>
        </div>
      </section>
    </div>
  );
}
