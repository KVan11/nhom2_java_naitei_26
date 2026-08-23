import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TourCard from "../components/TourCard";
import { tourService } from "../services/tour.service";
import type { Tour } from "@/constants/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Filters } from "../schemas/tour";
import TourSidebar from "../components/TourSidebar";
import TourPagination from "../components/TourPagination";

const DEFAULT: Filters = {
  keyword: "",
  categories: [],
  departures: [],
  destinations: [],
  minPrice: 0,
  maxPrice: 10000000,
  status: "",
};
const PER_PAGE = 6;

export default function TourList() {
  const [searchParams] = useSearchParams();
  const initialKw = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialDeparture = searchParams.get("departure") ?? "";

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT,
    keyword: initialKw,
    categories: initialCategory ? [initialCategory] : [],
    departures: initialDeparture ? [initialDeparture] : [],
  });
  const [sort, setSort] = useState("Đề xuất");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [tours, setTours] = useState<Tour[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ categories: { name: string }[], destinations: string[], departures: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tourService.getTours(),
      tourService.getFilterOptions()
    ]).then(([toursData, optionsData]) => {
      setTours(toursData);
      setFilterOptions(optionsData);
      setLoading(false);
    });
  }, []);

  const update = (key: keyof Filters, val: unknown) => {
    setFilters((p) => ({ ...p, [key]: val }));
    setPage(1);
  };
  const clear = () => {
    setFilters(DEFAULT);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let r = [...tours];
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      r = r.filter(
        (t: Tour) =>
          t.name.toLowerCase().includes(kw) ||
          t.destination.toLowerCase().includes(kw) ||
          t.categoryName.toLowerCase().includes(kw),
      );
    }
    if (filters.categories.length)
      r = r.filter((t: Tour) => filters.categories.includes(t.categoryName));
    if (filters.departures.length)
      r = r.filter((t: Tour) => filters.departures.includes(t.departure));
    if (filters.destinations.length)
      r = r.filter((t: Tour) => filters.destinations.includes(t.destination));
    if (filters.status) r = r.filter((t: Tour) => t.status === filters.status);
    r = r.filter(
      (t: Tour) =>
        t.basePrice >= filters.minPrice && t.basePrice <= filters.maxPrice,
    );

    return r.sort((a, b) => {
      switch (sort) {
        case "Giá: Thấp đến Cao":
          return a.basePrice - b.basePrice;
        case "Giá: Cao đến Thấp":
          return b.basePrice - a.basePrice;
        case "Đánh giá cao":
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });
  }, [filters, sort, tours]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const activeCount =
    filters.categories.length +
    filters.departures.length +
    filters.destinations.length +
    (filters.status ? 1 : 0) +
    (filters.keyword ? 1 : 0);

  if (loading || !filterOptions) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="container-wrapper pt-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brand font-medium">
                Tour
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <main className="container-wrapper py-8">
        <div className="flex gap-7">
          <div className="hidden lg:block w-72 shrink-0">
            <TourSidebar
              filters={filters}
              update={update}
              clear={clear}
              activeCount={activeCount}
              categories={filterOptions.categories}
              destinations={filterOptions.destinations}
              departures={filterOptions.departures}
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setDrawerOpen(true)}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                  Bộ lọc{" "}
                  {activeCount > 0 && (
                    <span className="ml-1 bg-brand text-white rounded-full text-[11px] px-1.5 py-0.5">
                      {activeCount}
                    </span>
                  )}
                </Button>
                <span className="text-sm text-slate-400">
                  Tìm thấy{" "}
                  <strong className="text-slate-900">{filtered.length}</strong>{" "}
                  tour
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-slate-400">Sắp xếp:</span>
                <Select
                  value={sort}
                  onValueChange={(v) => setSort(v || "Đề xuất")}
                >
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đề xuất">Đề xuất</SelectItem>
                    <SelectItem value="Giá: Thấp đến Cao">
                      Giá: Thấp đến Cao
                    </SelectItem>
                    <SelectItem value="Giá: Cao đến Thấp">
                      Giá: Cao đến Thấp
                    </SelectItem>
                    <SelectItem value="Đánh giá cao">Đánh giá cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.keyword && (
                  <span className="bg-brand/10 text-brand-dark rounded-full text-xs font-semibold px-3 py-1">
                    "{filters.keyword}"{" "}
                    <button onClick={() => update("keyword", "")}>×</button>
                  </span>
                )}
                {filters.categories.map((c) => (
                  <span
                    key={c}
                    className="bg-brand/10 text-brand-dark rounded-full text-xs font-semibold px-3 py-1"
                  >
                    {c}{" "}
                    <button
                      onClick={() =>
                        setFilters((p) => ({
                          ...p,
                          categories: p.categories.filter((x) => x !== c),
                        }))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.status && (
                  <span className="bg-brand/10 text-brand-dark rounded-full text-xs font-semibold px-3 py-1">
                    {filters.status === "AVAILABLE" ? "Còn chỗ" : "Đã đầy"}{" "}
                    <button onClick={() => update("status", "")}>×</button>
                  </span>
                )}
                <button
                  onClick={clear}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Grid */}
            {paginated.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-[22px] text-slate-900 mb-2">
                  Không tìm thấy tour
                </h3>
                <p className="text-slate-500 text-sm mb-5">
                  Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                </p>
                <Button onClick={clear} variant="outline">
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
                {/* Pagination */}
                <TourPagination
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-[min(340px,92vw)] bg-slate-50 h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[17px] text-slate-900">
                Bộ lọc
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <TourSidebar
              filters={filters}
              update={update}
              clear={clear}
              activeCount={activeCount}
              categories={filterOptions.categories}
              destinations={filterOptions.destinations}
              departures={filterOptions.departures}
            />
            <Button
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-4 bg-brand hover:bg-brand-dark text-white"
              size="lg"
            >
              Hiển thị {filtered.length} Tour
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
