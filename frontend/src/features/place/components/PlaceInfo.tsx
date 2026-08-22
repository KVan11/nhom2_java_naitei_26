import type { Place } from "@/constants/mockData";

export default function PlaceInfo({ place }: { place: Place }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 mb-5 p-6 sticky top-24 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <h3 className="text-lg text-slate-900 mb-3.5">Thông tin nhanh</h3>
      {[
        { label: "Tỉnh / Thành phố", value: place.city },
        { label: "Địa chỉ", value: place.address }
      ].map((item) => (
        <div key={item.label} className="mb-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
          <div className="text-sm text-slate-900 mt-0.5">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
