import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateRegister } from "../schemas/authSchemas";
import { authService } from "../services/authService";

export function useRegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const update = (k: string) => (v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRegister(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone
      });
      navigate("/login");
    } catch (error: any) {
      setErrors({ email: error?.response?.data?.message || "Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại." });
    } finally {
      setLoading(false);
    }
  };

  return {
    form, update,
    errors,
    loading,
    showPw, setShowPw,
    handleSubmit
  };
}
