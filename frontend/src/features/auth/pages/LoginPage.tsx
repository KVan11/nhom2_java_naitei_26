import { Link } from "react-router-dom";
import AuthLayout from "@/app/layouts/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { SocialAuth } from "../components/SocialAuth";
import loginBg from "@/assets/login.png";

export default function LoginPage() {
  return (
    <AuthLayout
      imageSrc={loginBg}
      title={
        <>
          Khám phá vẻ đẹp
          <br />
          <span className="text-brand italic">Vietnam's Wonders</span>
        </>
      }
      subtitle="Từ Vịnh Hạ Long kỳ vĩ đến ruộng bậc thang Sapa — mọi chuyến phiêu lưu đều bắt đầu bằng một cú click."
    >
      <h1 className="text-3xl text-foreground mb-1.5">
        Chào mừng trở lại
      </h1>
      <p className="text-muted text-sm mb-8">Đăng nhập để tiếp tục</p>

      <LoginForm />

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted font-medium uppercase tracking-wider">
          hoặc đăng nhập bằng
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <SocialAuth />

      <div className="text-center mt-6 text-sm text-slate-500">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="text-brand font-semibold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
}
