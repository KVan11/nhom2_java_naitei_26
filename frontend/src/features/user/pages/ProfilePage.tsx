import { useAuthStore } from "@/features/auth/store/authStore";
import MyReviewsSection from "@/features/user/components/MyReviewsSection";
import { ProfileForm } from "../components/ProfileForm";
import { PasswordForm } from "../components/PasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, KeyRound, Settings } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="py-20 text-center text-slate-500">
        Vui lòng đăng nhập để xem thông tin tài khoản.
      </div>
    );
  }

  const role = String(user.role || "").toUpperCase();
  const isUser = role === "USER";

  const initialChar =
    user.fullName?.charAt(0)?.toUpperCase() ||
    user.username?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand/90 to-brand-dark p-6 md:p-8 text-white shadow-lg mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl bg-white/15 flex items-center justify-center text-white text-3xl md:text-4xl font-bold backdrop-blur-md">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              initialChar
            )}
          </div>

          <div className="text-center md:text-left flex-1 space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {user.fullName || user.username}
            </h1>
            <p className="text-white/80 font-medium text-sm md:text-base">
              {user.email}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/25 transition-colors rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-xs border border-white/10 mt-1">
              <Shield className="w-3.5 h-3.5" />
              {user.role}
            </div>
          </div>
        </div>
      </div>

      <Card className="border-slate-100 shadow-md rounded-3xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <Tabs defaultValue="info" className="space-y-8">
            <TabsList className="bg-slate-100/70 p-1 w-full sm:w-auto grid grid-cols-2 rounded-xl">
              <TabsTrigger
                value="info"
                className="text-xs font-bold flex items-center justify-center gap-2 py-2.5 rounded-lg data-active:bg-white data-active:shadow-sm"
              >
                <Settings className="w-3.5 h-3.5" />
                Thông tin cá nhân
              </TabsTrigger>

              <TabsTrigger
                value="security"
                className="text-xs font-bold flex items-center justify-center gap-2 py-2.5 rounded-lg data-active:bg-white data-active:shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Đổi mật khẩu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="outline-none focus:outline-none">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Thông tin cá nhân
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Cập nhật họ tên, số điện thoại và ảnh đại diện của bạn.
                </p>
              </div>
              <ProfileForm user={user} />
            </TabsContent>

            <TabsContent
              value="security"
              className="outline-none focus:outline-none"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Đổi mật khẩu
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Hãy nhập mật khẩu hiện tại và mật khẩu mới để bảo vệ tài khoản.
                </p>
              </div>
              <PasswordForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isUser && (
        <div className="mt-8">
          <MyReviewsSection />
        </div>
      )}
    </div>
  );
}
