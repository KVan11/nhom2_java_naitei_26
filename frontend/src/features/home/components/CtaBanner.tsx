import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section className="bg-white py-20 border-t border-slate-200">
      <div className="container-wrapper text-center">
        <h2 className="text-[clamp(28px,5vw,48px)] text-slate-900 mb-4">
          Sẵn sàng cho <span className="text-brand italic">Chuyến đi tiếp theo?</span>
        </h2>
        <p className="text-slate-600 text-base max-w-[480px] mx-auto mb-8">
          Tham gia cùng hàng ngàn du khách đã khám phá những kỳ quan của Việt Nam với SUN Booking Tours.
        </p>
        <Link 
          to="/tours" 
          className="bg-gradient-to-br from-brand to-brand-dark text-white rounded-xl px-9 py-4 text-base font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand/20"
        >
          Khám phá Tour ngay
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
