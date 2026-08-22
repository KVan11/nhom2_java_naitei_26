import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filters } from "../schemas/tour";

function CheckGroup({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-2 outline-none">
        <span className="font-semibold text-xs text-slate-900 uppercase tracking-widest">{label}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-2 mt-2">
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label key={opt} className="flex items-center space-x-2.5 cursor-pointer">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => onChange(c ? [...selected, opt] : selected.filter((s) => s !== opt))}
                />
                <span className={`text-sm ${checked ? 'text-slate-900 font-medium' : 'text-slate-600 font-normal'}`}>{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TourSidebarProps {
  filters: Filters;
  update: (key: keyof Filters, val: unknown) => void;
  clear: () => void;
  activeCount: number;
  categories: { name: string }[];
  destinations: string[];
  departures: string[];
}

export default function TourSidebar({ filters, update, clear, activeCount, categories, destinations, departures }: TourSidebarProps) {
  return (
    <aside className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-[15px] text-slate-900">Bộ lọc</span>
        {activeCount > 0 && <button onClick={clear} className="text-xs text-brand font-semibold hover:text-brand-dark">Xóa tất cả</button>}
      </div>
      
      {/* Keyword */}
      <div className="mb-4 border-b border-slate-100 pb-4">
        <label className="font-semibold text-xs text-slate-900 uppercase tracking-widest block mb-2">Từ khóa</label>
        <Input value={filters.keyword} onChange={(e) => update("keyword", e.target.value)} placeholder="Tìm kiếm tour..." />
      </div>
      
      <CheckGroup label="Danh mục" options={categories.map(c => c.name)} selected={filters.categories} onChange={(v) => update("categories", v)} />
      <CheckGroup label="Điểm đến" options={destinations.slice(0, 6)} selected={filters.destinations} onChange={(v) => update("destinations", v)} />
      <CheckGroup label="Khởi hành từ" options={departures} selected={filters.departures} onChange={(v) => update("departures", v)} />
      
      {/* Price */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <label className="font-semibold text-xs text-slate-900 uppercase tracking-widest block mb-2">Mức giá (₫)</label>
        <div className="flex gap-2">
          {["minPrice", "maxPrice"].map((k) => (
            <Input key={k} type="number" value={filters[k as keyof Filters] as number} onChange={(e) => update(k as keyof Filters, parseInt(e.target.value) || 0)} placeholder={k === "minPrice" ? "Từ" : "Đến"} />
          ))}
        </div>
      </div>
      
      {/* Availability */}
      <div>
        <label className="font-semibold text-xs text-slate-900 uppercase tracking-widest block mb-2.5">Trạng thái</label>
        {[{ v: "", l: "Tất cả" }, { v: "AVAILABLE", l: "Còn chỗ" }, { v: "FULL", l: "Đã đầy" }].map((opt) => (
          <label key={opt.v} className="flex items-center space-x-2.5 cursor-pointer mb-2">
            <input type="radio" checked={filters.status === opt.v} onChange={() => update("status", opt.v)} className="accent-brand w-4 h-4" />
            <span className={`text-sm ${filters.status === opt.v ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{opt.l}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
