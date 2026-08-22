import { useState } from "react";
import { Link } from "react-router-dom";
import type { Tour } from "@/constants/mockData";
import { formatPrice } from "@/constants/mockData";

function StarRating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} style={{ width: size, height: size }} viewBox="0 0 20 20" className={s <= Math.round(value) ? "text-brand fill-current" : "text-slate-200 fill-current"}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: size - 2, fontWeight: 600, color: "#0f172a" }}>{value.toFixed(1)}</span>
      {count !== undefined && <span style={{ fontSize: size - 2, color: "#94a3b8" }}>({count})</span>}
    </div>
  );
}

export default function TourCard({ tour }: { tour: Tour }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid #f1f5f9",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.25s, transform 0.25s",
        transform: hovered ? "translateY(-3px)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 210, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={tour.images[0]?.url}
          alt={tour.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "white", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
          {tour.categoryName}
        </span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", padding: "24px 14px 12px" }}>
          <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tour.duration}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", lineHeight: 1.35, marginBottom: 10 }}>{tour.name}</h3>
        <div className="flex flex-col gap-2 mb-3" style={{ flex: 1 }}>
          <div className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: "#475569" }}>
            <svg className="w-3.5 h-3.5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tour.destination}
          </div>
          <div className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: "#475569" }}>
            <svg className="w-3.5 h-3.5 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Khởi hành từ {tour.departure}
          </div>
        </div>
        <div className="mb-3">
          <StarRating value={tour.averageRating} count={tour.reviewCount} />
        </div>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 1 }}>Chỉ từ</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>{formatPrice(tour.basePrice)}</div>
          </div>
          <Link
            to={`/tours/${tour.id}`}
            className={tour.status === "AVAILABLE" ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-md shadow-brand/20 hover:opacity-90 transition-opacity" : "bg-slate-100 text-slate-400 pointer-events-none"}
            style={{
              borderRadius: 10,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {tour.status === "AVAILABLE" ? "Xem chi tiết" : tour.status === "FULL" ? "Đã đầy" : "Đã đóng"}
          </Link>
        </div>
      </div>
    </article>
  );
}
