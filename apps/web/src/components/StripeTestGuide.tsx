import Link from "next/link";

export function StripeTestGuide() {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 text-sm text-slate-800 space-y-2">
      <p className="font-semibold text-indigo-900">Stripe TEST mode — không trừ tiền thật</p>
      <ul className="list-disc list-inside space-y-1 text-slate-700">
        <li>Dashboard bật <strong>Test mode</strong>, tạo Product/Price → copy vào .env</li>
        <li>Thẻ: <code className="bg-white px-1 rounded">4242 4242 4242 4242</code> — expiry tương lai, CVC bất kỳ</li>
        <li>Sau thanh toán: tier tự cập nhật trên trang /success (không cần webhook khi dev local)</li>
      </ul>
      <div className="flex flex-wrap gap-3 pt-1">
        <Link href="/docs-stripe" className="text-indigo-700 font-medium underline">
          Hướng dẫn chi tiết
        </Link>
        <a
          href="/api/health"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-700 font-medium underline"
        >
          Kiểm tra cấu hình (/api/health)
        </a>
      </div>
      <p className="text-xs text-slate-500">
        Terminal: <code>npm run stripe:check</code>
      </p>
    </div>
  );
}
