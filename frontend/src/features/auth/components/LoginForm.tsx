import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginForm() {
  const {
    username, setUsername,
    password, setPassword,
    errors,
    loading,
    showPw, setShowPw,
    handleSubmit
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
      <div className="space-y-2">
        <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase">Tên đăng nhập <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          className={`py-5 rounded-xl text-base ${errors.username ? "border-red-400 focus-visible:ring-red-400" : ""}`}
        />
        {errors.username && <div className="text-xs text-red-500 mt-1">{errors.username}</div>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase">Mật khẩu <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`py-5 pr-10 rounded-xl ${errors.password ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-6 rounded-xl mt-2 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-darker text-base font-bold shadow-md text-white border-0"
      >
        {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
