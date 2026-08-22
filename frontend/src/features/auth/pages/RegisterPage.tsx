import { Link } from "react-router-dom";
import AuthLayout from "@/app/layouts/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=900&h=1000&fit=crop&auto=format"
      title={
        <>
          Bắt đầu hành trình<br />
          <span className="text-brand italic">Vietnam's Wonders</span>
        </>
      }
      subtitle="Tạo tài khoản để khám phá hàng trăm tour du lịch đẳng cấp khắp Việt Nam."
    >
      <h1 className="text-3xl text-foreground mb-1.5">Tạo tài khoản</h1>
      <p className="text-muted text-sm mb-7">Gia nhập cùng hàng ngàn tín đồ đam mê du lịch</p>

      <RegisterForm />

      <div className="text-center mt-5 text-sm text-slate-500">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-brand font-semibold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
}
