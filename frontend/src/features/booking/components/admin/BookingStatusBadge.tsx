import { cn } from "@/lib/utils";
import { BookingStatus } from "../../types/admin-booking.types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800 border-blue-200" },
  CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
  EXPIRED: { label: "Hết hạn", className: "bg-slate-100 text-slate-800 border-slate-200" },
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
