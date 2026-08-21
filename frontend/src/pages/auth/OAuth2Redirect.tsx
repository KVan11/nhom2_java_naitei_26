import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export const OAuth2Redirect: React.FC = () => {
  const { checkSession, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processRedirect = async () => {
      try {
        // Parse token if passed in URL query (just in case)
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
          localStorage.setItem('token', token);
        }

        // Trigger session check to fetch user profile via cookies/headers
        await checkSession();
      } catch (err: any) {
        console.error('OAuth2 redirect processing error:', err);
        setError('Xác thực tài khoản qua mạng xã hội thất bại. Vui lòng thử lại.');
      }
    };

    processRedirect();
  }, [location, checkSession]);

  useEffect(() => {
    // Navigate home if authentication is successful and user state is populated
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full">
        {error ? (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Đăng nhập thất bại</h2>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-md text-sm"
            >
              Quay lại Đăng nhập
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Đang đăng nhập</h2>
            <p className="text-sm text-slate-400">
              Đang xác thực thông tin tài khoản của bạn. Vui lòng đợi trong giây lát...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
