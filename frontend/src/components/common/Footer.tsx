import { Link } from "react-router-dom";
import { SunIcon } from "@/components/common/icons";

export default function Footer() {
  return (
    <footer className="bg-slate-50 mt-20 pt-14 pb-8 border-t border-slate-200">
      <div className="container-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark rounded-lg shadow-sm">
                <SunIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 text-lg tracking-tight leading-none">
                SUN <span className="text-brand">Booking</span> Tours
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              Khám phá những điểm đến tuyệt đẹp tại Việt Nam cùng với các tour du lịch được tuyển chọn kỹ lưỡng và hướng dẫn viên chuyên nghiệp. Hành trình khó quên của bạn bắt đầu từ đây.
            </p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "YouTube"].map((s) => (
                <a key={s} href="#" className="bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-slate-500 text-xs font-medium hover:text-brand hover:border-brand/30 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-slate-900 text-[11px] font-bold uppercase tracking-widest mb-4">Khám phá</div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Tất cả Tour", to: "/tours" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-slate-500 text-sm hover:text-brand transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-slate-900 text-[11px] font-bold uppercase tracking-widest mb-4">Liên hệ</div>
            <div className="text-slate-500 text-sm leading-loose">
              <div>📍 123 Hoàn Kiếm, Hà Nội</div>
              <div>📞 1900 1234</div>
              <div>✉️ hello@sunbooking.vn</div>
              <div>🕗 Thứ 2 – CN, 8:00 – 20:00</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-between items-center flex-wrap gap-3">
          <span className="text-slate-400 text-[13px]">© 2026 SUN Booking Tours. Tất cả các quyền được bảo lưu.</span>
          <div className="flex gap-6">
            {["Chính sách bảo mật", "Điều khoản dịch vụ", "Chính sách Cookie"].map((s) => (
              <a key={s} href="#" className="text-slate-400 text-xs hover:text-brand transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
