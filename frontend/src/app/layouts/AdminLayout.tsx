import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  LayoutDashboard,
  Tags,
  Compass,
  Home,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ChevronRight,
  Sun,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Tổng quan",
      path: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Quản lý Danh mục",
      path: "/admin/categories",
      icon: Tags,
    },
    {
      label: "Quản lý Tour",
      path: "/admin/tours",
      icon: Compass,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white">
            <Sun className="w-5 h-5 fill-current" />
          </div>
          <span>SunAdmin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 shadow-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center text-white shadow-lg shadow-brand/30">
              <Sun className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight leading-none">
                SUN Booking
              </h1>
              <span className="text-[11px] font-semibold text-brand tracking-widest uppercase mt-1 inline-block">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quản trị hệ thống
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-brand text-white shadow-md shadow-brand/20 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-4 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lối tắt
            </div>
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Trang khách</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-xl mb-3">
            <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-sm border border-brand/30">
              {user?.username?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName || user?.username || "Quản trị viên"}
              </div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email || "admin@sunbooking.com"}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-slate-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">Bảng điều khiển Quản trị</span>
            <span>/</span>
            <span className="text-slate-400">Hệ thống SUN Booking</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="text-xs font-bold text-slate-700">{user?.username || "Admin"}</span>
            </div>
          </div>
        </header>

        {/* Page View Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
