import { useState } from "react";
import { userService } from "../services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const tempErrors: typeof errors = {};

    if (!currentPassword) {
      tempErrors.currentPassword = "Mật khẩu hiện tại không được để trống";
    }

    if (!newPassword) {
      tempErrors.newPassword = "Mật khẩu mới không được để trống";
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    } else if (newPassword === currentPassword) {
      tempErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu cũ";
    }

    if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = "Xác nhận mật khẩu mới không trùng khớp";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Thay đổi mật khẩu thành công!");
      // Reset form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto py-4">
      {/* Current Password */}
      <div className="space-y-2">
        <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
          Mật khẩu hiện tại <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showCurrentPw ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className={`py-5 pr-10 rounded-xl border-slate-200 ${errors.currentPassword ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPw(!showCurrentPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.currentPassword && <div className="text-xs text-red-500 mt-1">{errors.currentPassword}</div>}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
          Mật khẩu mới <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showNewPw ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className={`py-5 pr-10 rounded-xl border-slate-200 ${errors.newPassword ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowNewPw(!showNewPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.newPassword && <div className="text-xs text-red-500 mt-1">{errors.newPassword}</div>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
          Xác nhận mật khẩu mới <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showConfirmPw ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className={`py-5 pr-10 rounded-xl border-slate-200 ${errors.confirmPassword ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPw(!showConfirmPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <div className="text-xs text-red-500 mt-1">{errors.confirmPassword}</div>}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="px-8 py-5 h-auto rounded-xl bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-darker font-bold shadow-md text-white border-0 transition-all flex items-center gap-2 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Đang thực hiện...
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              Cập nhật mật khẩu
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
