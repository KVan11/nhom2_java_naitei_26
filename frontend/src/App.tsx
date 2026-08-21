import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OAuth2Redirect } from './pages/auth/OAuth2Redirect';
import { LogOut, User as UserIcon, Shield, Compass, MapPin, Coffee, Newspaper, Calendar } from 'lucide-react';

// Route guard for authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-indigo-300">Đang tải cấu hình hệ thống...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route guard for guest-only pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Premium Dashboard/Homepage component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Premium Glassmorphic Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/35">
                  <Compass className="w-6 h-6 text-white animate-pulse" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 bg-clip-text text-transparent tracking-wider">
                  SUN BOOKING
                </span>
              </div>
              <div className="hidden md:flex space-x-4">
                <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">Tours</a>
                <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">Địa điểm</a>
                <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">Ẩm thực</a>
                <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all">Tin tức</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold uppercase">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Xin chào,</p>
                  <p className="text-sm font-bold text-slate-850 leading-none">{user?.fullName}</p>
                </div>
                {user?.role === 'ADMIN' && (
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 transition-all cursor-pointer shadow-sm"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome Section */}
        <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-50/50 via-white to-indigo-50/50 border border-indigo-100/80 shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-750 border border-indigo-500/20">
              <Calendar className="w-3.5 h-3.5" /> Khám phá Việt Nam
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Tìm kiếm hành trình tiếp theo của bạn,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-650 bg-clip-text text-transparent font-black">
                {user?.fullName}
              </span>
            </h2>
            <p className="text-slate-650 text-sm sm:text-base leading-relaxed">
              Chào mừng bạn đến với cổng thông tin SUN Booking Tours. Hãy bắt đầu chọn lựa những địa danh du lịch tuyệt vời nhất, trải nghiệm những món ăn truyền thống đặc sắc, và theo dõi các tin tức du hành nóng hổi.
            </p>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Khám phá Tour du lịch',
              desc: 'Tìm kiếm tour du lịch và đăng ký lịch trình xuất phát.',
              icon: Compass,
              color: 'from-blue-600 to-indigo-600',
              shadow: 'shadow-blue-500/10',
            },
            {
              title: 'Điểm đến lý tưởng',
              desc: 'Danh sách các danh lam thắng cảnh và di tích nổi tiếng.',
              icon: MapPin,
              color: 'from-indigo-600 to-purple-600',
              shadow: 'shadow-indigo-500/10',
            },
            {
              title: 'Trải nghiệm ẩm thực',
              desc: 'Khám phá những món ăn truyền thống và đặc sản độc đáo.',
              icon: Coffee,
              color: 'from-purple-600 to-pink-600',
              shadow: 'shadow-purple-500/10',
            },
            {
              title: 'Tin tức du lịch',
              desc: 'Cập nhật tin tức sự kiện du lịch và cẩm nang đi lại.',
              icon: Newspaper,
              color: 'from-pink-600 to-rose-600',
              shadow: 'shadow-pink-500/10',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group cursor-pointer bg-white border border-slate-200/60 hover:border-indigo-200 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} ${item.shadow} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-500 transition-colors">
                Xem ngay →
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        © 2026 SUN Booking Tours
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
