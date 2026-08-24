import { useState } from "react";
import { User } from "@/features/auth/schemas/auth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { userService } from "../services/userService";
import { AvatarSelector } from "./AvatarSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, User as UserIcon, Phone, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!fullName.trim()) {
      tempErrors.fullName = "Họ và tên không được để trống";
    } else if (fullName.length > 100) {
      tempErrors.fullName = "Họ và tên tối đa 100 ký tự";
    }

    if (phone.trim() && !/^[0-9+.\s-]{8,20}$/.test(phone)) {
      tempErrors.phone = "Số điện thoại không hợp lệ (từ 8 đến 20 chữ số)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });

      // Update authStore
      updateUser(updatedUser);
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
        <AvatarSelector avatar={avatar} onChange={setAvatar} name={fullName || user.username} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username (Readonly) */}
        <div className="space-y-2">
          <Label className="text-slate-600 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5" />
            Tên đăng nhập
          </Label>
          <div className="relative">
            <Input
              type="text"
              value={user.username}
              disabled
              className="py-5 bg-slate-50 border-slate-200 text-slate-500 rounded-xl pr-10"
            />
            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Email (Readonly) */}
        <div className="space-y-2">
          <Label className="text-slate-600 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Địa chỉ Email
          </Label>
          <div className="relative">
            <Input
              type="email"
              value={user.email}
              disabled
              className="py-5 bg-slate-50 border-slate-200 text-slate-500 rounded-xl pr-10"
            />
            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyen Van A"
            className={`py-5 rounded-xl border-slate-200 ${errors.fullName ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          {errors.fullName && <div className="text-xs text-red-500 mt-1">{errors.fullName}</div>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label className="text-slate-700 font-semibold text-[13px] tracking-wide uppercase flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            Số điện thoại
          </Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09XXXXXXXX"
            className={`py-5 rounded-xl border-slate-200 ${errors.phone ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="px-8 py-5 h-auto rounded-xl bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-darker font-bold shadow-md text-white border-0 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Đang lưu thay đổi...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
