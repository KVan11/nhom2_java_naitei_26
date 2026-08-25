import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SunIcon } from "@/components/common/icons";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Danh sách Tour", to: "/tours" },
  ];

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="w-full px-6 md:px-10">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark rounded-lg">
                <SunIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 text-lg tracking-tight leading-none">
                SUN <span className="text-brand">Booking</span> Tours
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`whitespace-nowrap px-3.5 py-1 text-sm font-medium transition-colors border-b-2 ${
                  isActive(link.to)
                    ? "text-brand border-brand"
                    : "text-slate-600 border-transparent hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth / User */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:text-brand transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-sm text-white">
                    {user.fullName?.charAt(0) ||
                      user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {user.fullName || user.username}
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl overflow-hidden border border-border z-50">
                    <div className="p-4 border-b border-slate-100">
                      <div className="font-semibold text-sm text-slate-900 truncate">
                        {user.fullName || user.username}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {user.email}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-brand mt-1">
                        {user.role}
                      </div>
                    </div>

                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/bookings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Lịch sử đặt Tour
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Tài khoản của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-brand transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand to-brand-dark rounded-lg hover:shadow-lg transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-700 hover:text-brand transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-2 py-2 text-base ${isActive(link.to) ? "font-semibold text-brand" : "text-slate-600 hover:text-brand"}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 mt-3 pt-3">
              {user ? (
                <>
                  <Link
                    to="/bookings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-2 text-base text-slate-700 hover:text-brand"
                  >
                    Lịch sử đặt Tour
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-2 text-base text-slate-700 hover:text-brand"
                  >
                    Tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-2 text-base text-red-400"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-2 text-base text-slate-700 text-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-2 text-base font-semibold text-white bg-brand text-center rounded-lg"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
