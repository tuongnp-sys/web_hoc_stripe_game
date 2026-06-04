import { Suspense } from "react";
import { SuccessClient } from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center py-12">Đang tải...</p>}>
      <SuccessClient />
    </Suspense>
  );
}
