import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../schemas/authSchemas";
import { useAuthStore } from "../store/authStore";

export function useLoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin({ username, password });
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }
    
    try {
      const user = await login({ username, password });
      
      const role = String(user.role || "").toUpperCase();
      if (role.includes("ADMIN") || username.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      // 401 indicates bad credentials
      setErrors({ username: "Tài khoản hoặc mật khẩu không chính xác. Bạn đã đăng ký chưa?" });
    }
  };

  return {
    username, setUsername,
    password, setPassword,
    errors, setErrors,
    loading,
    showPw, setShowPw,
    handleSubmit
  };
}
