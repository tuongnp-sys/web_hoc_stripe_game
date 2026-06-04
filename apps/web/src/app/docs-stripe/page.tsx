import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";

export default function DocsStripePage() {
  let content = "Xem docs/STRIPE_SETUP.md trong repository.";
  try {
    const path = join(process.cwd(), "..", "..", "docs", "STRIPE_SETUP.md");
    content = readFileSync(path, "utf-8");
  } catch {
    try {
      const path = join(process.cwd(), "docs", "STRIPE_SETUP.md");
      content = readFileSync(path, "utf-8");
    } catch {
      /* fallback */
    }
  }

  return (
    <div className="prose prose-slate max-w-none">
      <Link href="/pricing" className="text-indigo-600 text-sm no-underline">
        ← Quay lại bảng giá
      </Link>
      <pre className="whitespace-pre-wrap text-sm bg-white border rounded-xl p-6 mt-4 font-sans">
        {content}
      </pre>
    </div>
  );
}
