import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatPrice } from "@/constants/mockData";
import { tourService } from "../services/tour.service";
import type { Tour, TourDeparture, Review } from "@/constants/mockData";
import StarRating from "@/components/common/StarRating";
import TourGallery from "../components/TourGallery";
import TourTabs from "../components/TourTabs";
import TourBookingWidget from "../components/TourBookingWidget";

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();

  const [tour, setTour] = useState<Tour | null>(null);
  const [departures, setDepartures] = useState<TourDeparture[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDep, setSelectedDep] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const tourId = Number(id);
    Promise.all([
      tourService.getTourById(tourId),
      tourService.getTourDepartures(tourId),
      tourService.getTourReviews(tourId)
    ]).then(([tourData, depsData, reviewsData]) => {
      setTour(tourData || null);
      setDepartures(depsData);
      setReviews(reviewsData);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl text-slate-900">Không tìm thấy tour</h1>
      <Link to="/tours" className="text-brand font-semibold hover:text-brand-dark">← Quay lại danh sách tour</Link>
    </div>
  );

  const selectedDeparture = departures.find((d: TourDeparture) => d.id === selectedDep);
  const statusVariant = tour.status === "AVAILABLE" ? "default" : tour.status === "FULL" ? "destructive" : "secondary";

  return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50">
      <TourGallery tour={tour} />

      <div className="container-wrapper py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Tour Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-7 mb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 ${
                      tour.status === "AVAILABLE" ? "bg-green-500/10 text-green-600" :
                      tour.status === "FULL" ? "bg-red-500/10 text-red-600" :
                      "bg-slate-500/10 text-slate-600"
                    }`}>
                      {tour.status === "AVAILABLE" ? "Còn chỗ" : tour.status === "FULL" ? "Đã đầy" : "Đã đóng"}
                    </span>
                    <span className="bg-brand/10 text-brand rounded-full text-xs font-semibold px-2.5 py-0.5">
                      {tour.categoryName}
                    </span>
                  </div>
                  <h1 className="text-[clamp(22px,4vw,34px)] text-slate-900 leading-tight mb-3">
                    {tour.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {[
                      { icon: "📍", label: tour.destination },
                      { icon: "🏁", label: `Khởi hành từ ${tour.departure}` },
                      { icon: "⏱", label: tour.duration },
                    ].map((item) => (
                      <span key={item.label} className="text-sm text-slate-600">
                        {item.icon} {item.label}
                      </span>
                    ))}
                  </div>
                  <StarRating value={tour.averageRating} count={tour.reviewCount} size={16} />
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Chỉ từ</div>
                  <div className="text-[32px] text-brand">{formatPrice(tour.basePrice)}</div>
                  <div className="text-xs text-slate-400">mỗi người</div>
                </div>
              </div>
            </div>

            <TourTabs 
              tour={tour} 
              departures={departures} 
              reviews={reviews} 
              selectedDep={selectedDep} 
              setSelectedDep={setSelectedDep} 
            />
          </div>

          {/* Right — Booking panel */}
          <TourBookingWidget tour={tour} selectedDeparture={selectedDeparture} />
        </div>
      </div>
    </div>
  );
}
