import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ReactNode } from "react";

interface RouteMiddlewareProps {
  children: ReactNode;
  /**
   * "guest": Only accessible to unauthenticated users (e.g. Login, Register)
   * "auth": Only accessible to authenticated users (e.g. Profile, Admin)
   */
  type: "guest" | "auth";
}

export function RouteMiddleware({ children, type }: RouteMiddlewareProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (type === "guest" && user) {
    return <Navigate to="/" replace />;
  }

  if (type === "auth" && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict admin routes to ADMIN role only
  if (type === "auth" && location.pathname.startsWith("/admin")) {
    const role = String(user?.role || "").toUpperCase();
    if (role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
