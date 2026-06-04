import { Suspense } from "react";
import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập / Đăng ký</h1>
      <Suspense fallback={<p className="text-center text-slate-500">Đang tải...</p>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
