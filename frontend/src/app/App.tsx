import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    // When the app loads, verify the user session with the backend if a token exists
    const token = localStorage.getItem("token");
    if (token) {
      checkSession();
    }
  }, [checkSession]);

  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors />
    </TooltipProvider>
  );
}
