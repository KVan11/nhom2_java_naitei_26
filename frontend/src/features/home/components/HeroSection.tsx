import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/constants/mockData";

interface HeroSectionProps {
  categories: Category[];
  departuresList: string[];
}

export default function HeroSection({ categories, departuresList }: HeroSectionProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [departure, setDeparture] = useState("Bất kỳ");

  return (
    <>
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=1600&h=700&fit=crop&auto=format"
          alt="Ha Long Bay"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-900/30" />

        <div className="relative container-wrapper py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand/15 border border-brand/30 rounded-full px-3.5 py-1.5 mb-5">
              <span className="text-brand text-xs font-bold uppercase tracking-widest">✦ Nền tảng đặt Tour hàng đầu Việt Nam</span>
            </div>
            <h1 className="text-[clamp(36px,6vw,68px)] text-white leading-[1.1] mb-5">
              Khám Phá<br />
              <span className="text-brand italic">Hành Trình Mới</span>
            </h1>
            <p className="text-white/75 text-[17px] leading-relaxed mb-9 max-w-[500px]">
              Trải nghiệm những điểm đến tuyệt đẹp và đặt các tour du lịch khó quên cùng SUN Booking Tours. Từ du thuyền Vịnh Hạ Long đến leo núi Sapa — cuộc phiêu lưu đang chờ đón bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/tours" className="bg-gradient-to-br from-brand to-brand-dark text-white rounded-xl px-7 py-3.5 text-[15px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand/20">
                Khám phá Tour
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { n: "200+", l: "Tour Chất lượng" },
                { n: "15K+", l: "Khách Hàng" },
                { n: "4.8★", l: "Đánh giá Trung bình" }
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl text-brand">{s.n}</div>
                  <div className="text-white/50 text-[13px]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 mb-8">
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex gap-3 flex-wrap items-end">
          <div className="flex-[2] min-w-[180px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Tìm kiếm Tour</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ha Long Bay, Sapa, Hoi An..."
              className="w-full text-sm h-11"
              onKeyDown={(e) => e.key === "Enter" && navigate(`/tours?q=${search}`)}
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Danh mục</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full h-11 text-sm bg-white border border-slate-200 rounded-md px-3 flex items-center justify-between shadow-xs outline-none focus:ring-2 focus:ring-brand/20 data-[state=open]:border-brand">
                <span className="truncate">{category}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[140px] bg-white z-50 p-1">
                <DropdownMenuItem className="cursor-pointer py-1.5 px-2 text-sm hover:bg-slate-100 rounded-sm" onClick={() => setCategory("Tất cả danh mục")}>Tất cả danh mục</DropdownMenuItem>
                {categories.map((c) => (
                  <DropdownMenuItem key={c.id} className="cursor-pointer py-1.5 px-2 text-sm hover:bg-slate-100 rounded-sm" onClick={() => setCategory(c.name)}>{c.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Điểm khởi hành</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full h-11 text-sm bg-white border border-slate-200 rounded-md px-3 flex items-center justify-between shadow-xs outline-none focus:ring-2 focus:ring-brand/20 data-[state=open]:border-brand">
                <span className="truncate">{departure}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[140px] bg-white z-50 p-1">
                <DropdownMenuItem className="cursor-pointer py-1.5 px-2 text-sm hover:bg-slate-100 rounded-sm" onClick={() => setDeparture("Bất kỳ")}>Bất kỳ</DropdownMenuItem>
                {departuresList.map((dep) => (
                  <DropdownMenuItem key={dep} className="cursor-pointer py-1.5 px-2 text-sm hover:bg-slate-100 rounded-sm" onClick={() => setDeparture(dep)}>{dep}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={() => {
              const params = new URLSearchParams();
              if (search) params.set("q", search);
              if (category !== "Tất cả danh mục") params.set("category", category);
              if (departure !== "Bất kỳ") params.set("departure", departure);
              navigate(`/tours?${params.toString()}`);
            }}
            className="h-11 px-7 whitespace-nowrap bg-gradient-to-br from-brand to-brand-dark hover:opacity-90 text-white font-bold"
          >
            Tìm Tour
          </Button>
        </div>
      </div>
    </>
  );
}
