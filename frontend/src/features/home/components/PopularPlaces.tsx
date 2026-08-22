import { Link } from "react-router-dom";
import type { Place } from "@/constants/mockData";

export default function PopularPlaces({ places }: { places: Place[] }) {

  return (
    <section className="bg-white py-20">
      <div className="container-wrapper">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand/10 rounded-full px-3.5 py-1 mb-3">
              <span className="text-brand text-xs font-bold uppercase tracking-widest">Điểm đến</span>
            </div>
            <h2 className="text-[clamp(24px,4vw,38px)] text-slate-900 leading-[1.15]">Khám phá Điểm đến</h2>
            <p className="text-slate-400 text-[15px] mt-2 max-w-[520px]">Những địa danh mang tính biểu tượng đang chờ bước chân bạn</p>
          </div>
          <Link to="/places" className="text-sm font-semibold text-brand flex items-center gap-1 whitespace-nowrap mb-1 hover:text-brand-dark transition-colors">
            Xem tất cả <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {places.map((place) => (
            <Link key={place.id} to={`/places/${place.id}`} className="group relative rounded-2xl overflow-hidden block h-[260px]">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-white font-bold text-lg mb-0.5">{place.name}</div>
                <div className="text-white/65 text-[13px]">{place.city}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
