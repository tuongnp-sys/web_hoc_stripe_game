import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="text-center py-12 rounded-2xl bg-white border shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">Đã hủy thanh toán</h1>
      <Link href="/pricing" className="mt-6 inline-block text-indigo-600 font-medium">
        Quay lại bảng giá
      </Link>
    </div>
  );
}
