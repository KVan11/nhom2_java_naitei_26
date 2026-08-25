import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OAuth2RedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const checkSession = useAuthStore((state) => state.checkSession);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);

      checkSession()
        .then(() => {
          toast.success("Đăng nhập thành công!");
          navigate("/", { replace: true });
        })
        .catch(() => {
          localStorage.removeItem("token");
          toast.error("Không thể lấy thông tin người dùng từ server.");
          navigate("/login", { replace: true });
        });
    } else {
      toast.error(error || "Đăng nhập thất bại. Vui lòng thử lại.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, checkSession, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin w-10 h-10 text-brand mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Đang xử lý đăng nhập...</h2>
        <p className="text-slate-500 text-sm">Vui lòng chờ trong giây lát.</p>
      </div>
    </div>
  );
}
