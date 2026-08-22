import { Link } from "react-router-dom";
import TourCard from "@/features/tour/components/TourCard";
import type { Tour } from "@/constants/mockData";

export default function FeaturedTours({ tours }: { tours: Tour[] }) {


  return (
    <section className="container-wrapper py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand/10 rounded-full px-3.5 py-1 mb-3">
            <span className="text-brand text-xs font-bold uppercase tracking-widest">Nổi bật</span>
          </div>
          <h2 className="text-[clamp(24px,4vw,38px)] text-slate-900 leading-[1.15]">Tour Phổ Biến</h2>
          <p className="text-slate-400 text-[15px] mt-2 max-w-[520px]">Những trải nghiệm tour được yêu thích nhất, dành riêng cho bạn</p>
        </div>
        <Link to="/tours" className="text-sm font-semibold text-brand flex items-center gap-1 whitespace-nowrap mb-1 hover:text-brand-dark transition-colors">
          Xem tất cả <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
      </div>
    </section>
  );
}
