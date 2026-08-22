import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/constants/mockData";
import type { Tour, TourDeparture } from "@/constants/mockData";
import { useAuthStore } from "@/features/auth/store/authStore";

interface TourBookingWidgetProps {
  tour: Tour;
  selectedDeparture?: TourDeparture;
}

export default function TourBookingWidget({
  tour,
  selectedDeparture,
}: TourBookingWidgetProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [travelers, setTravelers] = useState(1);

  const totalPrice = selectedDeparture
    ? selectedDeparture.price * travelers
    : tour.basePrice * travelers;

  const handleBook = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(
      `/booking/create?tourId=${tour.id}&departureId=${selectedDeparture?.id}&travelers=${travelers}`,
    );
  };

  return (
    <div className="w-full lg:w-[360px] shrink-0">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <h3 className="text-[22px] text-slate-900 mb-1">Đặt Tour Này</h3>
        <div className="text-[13px] text-slate-400 mb-5">
          Chọn ngày khởi hành và số lượng hành khách
        </div>

        {/* Selected departure */}
        {selectedDeparture ? (
          <div className="bg-brand/10 border border-brand/20 rounded-xl p-3 mb-4">
            <div className="text-xs text-brand-dark font-semibold mb-1">
              Ngày khởi hành đã chọn
            </div>
            <div className="font-bold text-slate-900">
              {formatDate(selectedDeparture.departureDate)}
            </div>
            <div className="text-[13px] text-brand-dark">
              Còn {selectedDeparture.availableSlots} chỗ ·{" "}
              {formatPrice(selectedDeparture.price)}/khách
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 mb-4 text-[13px] text-slate-400 text-center">
            Vui lòng chọn ngày khởi hành ở tab Lịch Khởi Hành
          </div>
        )}

        {/* Travelers */}
        <div className="mb-5">
          <label className="block font-semibold text-[13px] text-slate-900 mb-2">
            Số Lượng Hành Khách
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-9 h-9 rounded-lg border border-slate-200 text-lg text-slate-900 bg-white flex items-center justify-center hover:bg-slate-50"
            >
              −
            </button>
            <span className="font-bold text-lg text-slate-900 min-w-[24px] text-center">
              {travelers}
            </span>
            <button
              onClick={() =>
                setTravelers(
                  Math.min(
                    selectedDeparture?.availableSlots ?? 10,
                    travelers + 1,
                  ),
                )
              }
              className="w-9 h-9 rounded-lg border border-slate-200 text-lg text-slate-900 bg-white flex items-center justify-center hover:bg-slate-50"
            >
              +
            </button>
          </div>
          {selectedDeparture &&
            travelers > selectedDeparture.availableSlots && (
              <div className="text-xs text-red-500 mt-1.5">
                Không đủ chỗ trống.
              </div>
            )}
        </div>

        {/* Price breakdown */}
        <div className="bg-slate-50 rounded-xl p-3.5 mb-5">
          <div className="flex justify-between mb-2 text-[13px] text-slate-600">
            <span>
              {formatPrice(selectedDeparture?.price ?? tour.basePrice)} ×{" "}
              {travelers} khách
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-[15px] text-slate-900">
            <span>Tổng cộng</span>
            <span className="text-brand">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <Button
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold"
          size="lg"
          onClick={handleBook}
          disabled={tour.status !== "AVAILABLE"}
        >
          {tour.status === "AVAILABLE" ? "Đặt Tour Này" : "Chưa mở bán"}
        </Button>
      </div>
    </div>
  );
}
