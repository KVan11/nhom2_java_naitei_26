import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { placeService } from "../services/place.service";
import type { Place } from "@/constants/mockData";
import { MOCK_TOURS as TOURS, MOCK_FOODS as FOODS } from "@/constants/mockData";
import TourCard from "@/features/tour/components/TourCard";
import FoodCard from "@/features/food/components/FoodCard";
import PlaceGallery from "../components/PlaceGallery";
import PlaceInfo from "../components/PlaceInfo";

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      try {
        const data = await placeService.getPlaceById(Number(id));
        setPlace(data || null);
      } catch (error) {
        console.error("Failed to fetch place:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const relatedTours = TOURS.filter((t) => t.destination === place?.name).slice(0, 3);
  const relatedFoods = FOODS.filter((f) => f.placeId === place?.id);
  
  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <div className="h-[480px] w-full bg-slate-200 animate-pulse" />
      <div className="container-wrapper py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );

  if (!place) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl text-slate-900">Không tìm thấy địa điểm</h1>
      <Link to="/places" className="text-brand font-semibold hover:text-brand-dark">← Quay lại danh sách điểm đến</Link>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50">
      <PlaceGallery place={place} />

      <div className="container-wrapper py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          <div className="flex-1 min-w-0">
            {/* Header Box */}
            <div className="bg-white rounded-2xl border border-slate-100 p-7 mb-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-brand/10 text-brand rounded-full text-xs font-semibold px-2.5 py-0.5">
                  Điểm đến
                </span>
              </div>
              <h1 className="text-[clamp(22px,4vw,34px)] text-slate-900 leading-tight mb-3">
                {place.name}
              </h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="text-sm text-slate-600">
                  📍 {place.city} · {place.address}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-7 mb-6">
              <h2 className="text-2xl text-slate-900 mb-3.5">Về {place.name}</h2>
              <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-line">{place.description}</p>
            </div>

            {relatedFoods.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl text-slate-900 mb-4">Đặc sản & Ẩm thực</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedFoods.map((f) => <FoodCard key={f.id} food={f} />)}
                </div>
              </div>
            )}

            {relatedTours.length > 0 && (
              <div>
                <h2 className="text-2xl text-slate-900 mb-4">Các Tour đến {place.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedTours.map((t) => <TourCard key={t.id} tour={t} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right — Quick info panel */}
          <div className="w-full lg:w-[360px] shrink-0">
            <PlaceInfo place={place} />
          </div>
        </div>
      </div>
    </div>
  );
}
