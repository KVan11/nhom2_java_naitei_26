import { Link } from "react-router-dom";
import type { Place } from "@/constants/mockData";

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <Link to={`/places/${place.id}`} className="group block bg-white rounded-[18px] overflow-hidden border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300">
      <div className="h-[240px] overflow-hidden relative">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3.5 left-4 right-4">
          <div className="text-white font-bold text-lg leading-tight mb-1">{place.name}</div>
          <div className="text-white/80 text-[13px] font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {place.city}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{place.description}</div>
        <div className="mt-4 text-[13px] font-bold text-brand flex items-center group-hover:translate-x-1 transition-transform">Khám phá <span className="ml-1">→</span></div>
      </div>
    </Link>
  );
}
