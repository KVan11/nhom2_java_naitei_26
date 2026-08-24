import { Button } from "@/components/ui/button";
import { GoogleIcon, FacebookIcon } from "@/components/common/icons";

export function SocialAuth() {
  const handleSocialLogin = (provider: "google" | "facebook") => {
    const redirectUri = `${window.location.origin}/oauth2/redirect`;
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" className="w-full py-5 text-slate-700 bg-white hover:bg-slate-50 border-slate-200 rounded-xl" type="button" onClick={() => handleSocialLogin("google")}>
        <GoogleIcon />
        Google
      </Button>
      <Button variant="outline" className="w-full py-5 text-slate-700 bg-white hover:bg-slate-50 border-slate-200 rounded-xl" type="button" onClick={() => handleSocialLogin("facebook")}>
        <FacebookIcon />
        Facebook
      </Button>
    </div>
  );
}

