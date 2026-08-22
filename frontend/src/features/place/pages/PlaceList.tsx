import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";
import type { Place } from "@/constants/mockData";
import { placeService } from "../services/place.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import TourPagination from "@/features/tour/components/TourPagination";
import PlaceSidebar from "../components/PlaceSidebar";
import { PlaceFilters } from "../schemas/place";

const DEFAULT: PlaceFilters = { keyword: "", cities: [] };
const PER_PAGE = 6;

export default function PlaceList() {
  const [searchParams] = useSearchParams();
  const initialKw = searchParams.get("q") ?? "";

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<PlaceFilters>({ ...DEFAULT, keyword: initialKw });
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const data = await placeService.getPlaces();
        setPlaces(data);
      } catch (error) {
        console.error("Failed to fetch places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const update = (key: keyof PlaceFilters, val: unknown) => { setFilters((p) => ({ ...p, [key]: val })); setPage(1); };
  const clear = () => { setFilters(DEFAULT); setPage(1); };

  const allCities = useMemo(() => Array.from(new Set(places.map(p => p.city))), [places]);

  const filtered = useMemo(() => {
    let r = [...places];
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      r = r.filter((p: Place) => p.name.toLowerCase().includes(kw) || p.city.toLowerCase().includes(kw));
    }
    if (filters.cities.length) {
      r = r.filter((p: Place) => filters.cities.includes(p.city));
    }
    return r;
  }, [filters, places]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const activeCount = filters.cities.length + (filters.keyword ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-wrapper pt-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brand font-medium">Điểm đến</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <main className="container-wrapper py-8">
        <div className="flex gap-7">
          <div className="hidden lg:block w-72 shrink-0">
            <PlaceSidebar filters={filters} update={update} clear={clear} activeCount={activeCount} allCities={allCities} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                  Bộ lọc {activeCount > 0 && <span className="ml-1 bg-brand text-white rounded-full text-[11px] px-1.5 py-0.5">{activeCount}</span>}
                </Button>
                <span className="text-sm text-slate-400">Tìm thấy <strong className="text-slate-900">{filtered.length}</strong> điểm đến</span>
              </div>
            </div>

            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.keyword && <span className="bg-brand/10 text-brand-dark rounded-full text-xs font-semibold px-3 py-1">"{filters.keyword}" <button onClick={() => update("keyword", "")}>×</button></span>}
                {filters.cities.map((c) => <span key={c} className="bg-brand/10 text-brand-dark rounded-full text-xs font-semibold px-3 py-1">{c} <button onClick={() => update("cities", filters.cities.filter((x) => x !== c))}>×</button></span>)}
                <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600">Xóa tất cả</button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-[18px] border border-slate-100 overflow-hidden h-[340px] animate-pulse">
                    <div className="h-[210px] bg-slate-200" />
                    <div className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-[22px] text-slate-900 mb-2">Không tìm thấy địa điểm</h3>
                <p className="text-slate-500 text-sm mb-5">Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                <Button onClick={clear} variant="outline">Xóa bộ lọc</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((place) => <PlaceCard key={place.id} place={place} />)}
                </div>
                <TourPagination page={page} totalPages={totalPages} setPage={setPage} />
              </>
            )}
          </div>
        </div>
      </main>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[min(340px,92vw)] bg-slate-50 h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[17px] text-slate-900">Bộ lọc</span>
              <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <PlaceSidebar filters={filters} update={update} clear={clear} activeCount={activeCount} allCities={allCities} />
            <Button onClick={() => setDrawerOpen(false)} className="w-full mt-4 bg-brand hover:bg-brand-dark text-white" size="lg">
              Hiển thị {filtered.length} Điểm đến
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
