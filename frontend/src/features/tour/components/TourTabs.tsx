import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/common/StarRating";
import { formatPrice, formatDate } from "@/constants/mockData";
import type { Tour, TourDeparture, Review } from "@/constants/mockData";

interface TourTabsProps {
  tour: Tour;
  departures: TourDeparture[];
  reviews: Review[];
  selectedDep: number | null;
  setSelectedDep: (id: number | null) => void;
}

export default function TourTabs({ tour, departures, reviews, selectedDep, setSelectedDep }: TourTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "schedule" | "itinerary" | "reviews">("info");
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  return (
    <div className="bg-white rounded-2xl border border-slate-100 mb-5 overflow-hidden">
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {([["info", "Tổng quan"], ["schedule", "Lịch khởi hành"], ["itinerary", "Lịch trình"], ["reviews", "Đánh giá"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} className={`flex-1 min-w-[120px] p-3.5 text-sm transition-colors whitespace-nowrap ${activeTab === k ? 'font-bold text-brand border-b-2 border-brand' : 'font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-600'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "info" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl text-slate-900 mb-3">Về Tour Này</h3>
            <p className="text-slate-600 leading-relaxed text-[15px] mb-5">{tour.description}</p>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl text-slate-900 mb-4">Lịch Khởi Hành Sắp Tới</h3>
            {departures.length === 0 ? <p className="text-slate-400">Hiện chưa có lịch khởi hành.</p> : (
              <div className="flex flex-col gap-3">
                {departures.map((dep: TourDeparture) => {
                  const isSelected = selectedDep === dep.id;
                  const canSelect = dep.status === "OPEN";
                  return (
                    <div key={dep.id} onClick={() => canSelect && setSelectedDep(isSelected ? null : dep.id)} className={`border-2 rounded-xl p-4 transition-all ${isSelected ? 'border-brand bg-brand/5' : 'border-slate-100 bg-white'} ${canSelect ? 'cursor-pointer hover:border-brand/50' : 'cursor-default opacity-60'}`}>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <div className="font-bold text-[15px] text-slate-900 mb-1">
                            {formatDate(dep.departureDate)} → {formatDate(dep.returnDate)}
                          </div>
                          <div className="text-[13px] text-slate-400">
                            Còn {dep.availableSlots} / {dep.totalSlots} chỗ trống
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right min-w-[80px]">
                            <div className="text-lg font-bold text-slate-900">{formatPrice(dep.price)}</div>
                            <div className="text-[11px] text-slate-400">mỗi người</div>
                          </div>
                          <div className="w-[72px] flex justify-center">
                            <Badge variant={dep.status === "OPEN" ? "default" : "secondary"}>{dep.status === "OPEN" ? "Mở Bán" : dep.status === "FULL" ? "Đã Đầy" : "Đóng"}</Badge>
                          </div>
                          {canSelect ? (
                            <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-brand border-brand' : 'border-2 border-slate-300 bg-white'}`}>
                              {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          ) : (
                            <div className="w-[22px] h-[22px] shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xl text-slate-900 mb-4">Lịch Trình Chi Tiết</h3>
            {tour.itinerary ? tour.itinerary.map((day) => (
              <div key={day.dayNumber} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white font-bold text-[13px] flex items-center justify-center">N{day.dayNumber}</div>
                  <div className="font-bold text-[15px] text-slate-900">{day.title}</div>
                </div>
                <div className="ml-12 border-l-2 border-slate-100 pl-5 text-sm text-slate-600">
                  {day.activities}
                </div>
              </div>
            )) : <p className="text-slate-400">Chi tiết lịch trình đang được cập nhật.</p>}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Rating summary */}
            <div className="bg-slate-50 rounded-xl p-5 mb-5 flex gap-6 flex-wrap items-center">
              <div className="text-center w-32">
                <div className="text-[52px] text-brand leading-none">{tour.averageRating}</div>
                <div className="flex justify-center mt-2 mb-1"><StarRating value={tour.averageRating} size={14} /></div>
                <div className="text-[13px] text-slate-400">{tour.reviewCount} đánh giá</div>
              </div>
              <div className="flex-1 min-w-[200px]">
                {[5, 4, 3, 2, 1].map((star) => {
                  let pct = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : 3;
                  if (tour.ratingBreakdown) {
                    const item = tour.ratingBreakdown.find(r => r.star === star);
                    if (item) pct = item.percentage;
                    else pct = 0;
                  }
                  return (
                    <div key={star} className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs text-slate-400 w-4">{star}★</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-7 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {reviews.map((rev: Review) => (
              <div key={rev.id} className="border-b border-slate-100 pb-5 mb-5 last:border-0 last:mb-0">
                <div className="flex items-start gap-3 mb-3">
                  <img src={rev.avatar} alt={rev.userName} className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-900">{rev.userName}</div>
                    <div className="text-xs text-slate-400">{rev.createdAt}</div>
                  </div>
                  <StarRating value={rev.rating} />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{rev.content}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setLiked((p) => ({ ...p, [rev.id]: !p[rev.id] }))} className={`flex items-center gap-1.5 text-[13px] ${liked[rev.id] ? 'text-brand font-semibold' : 'text-slate-400 hover:text-slate-600'}`}>
                    <svg className="w-4 h-4" fill={liked[rev.id] ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {rev.likes + (liked[rev.id] ? 1 : 0)} Thích
                  </button>
                </div>
              </div>
            ))}

            {reviews.length === 0 && <p className="text-slate-400 text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
