import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SunIcon } from "@/components/common/icons";

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc: string;
  title: ReactNode;
  subtitle: string;
}

export default function AuthLayout({ children, imageSrc, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — image */}
      <div className="hidden lg:block relative flex-1">
        <img
          src={imageSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/75" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="text-3xl md:text-4xl text-white leading-tight mb-3">
            {title}
          </div>
          <p className="text-white/60 text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 sm:px-10 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark rounded-xl shadow-sm">
              <SunIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl text-foreground tracking-tight leading-none">
              SUN <span className="text-brand">Booking</span> Tours
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
