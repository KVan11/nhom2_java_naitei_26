import { AdminBookingResponse } from "@/features/booking/types/admin-booking.types";
import { BookingStatusBadge } from "@/features/booking/components/admin/BookingStatusBadge";
import { AdminBookingStatusSelect } from "@/features/booking/components/admin/AdminBookingStatusSelect";
import { Eye } from "lucide-react";
import { formatPrice } from "@/constants/mockData"; // assuming this utility exists

interface AdminBookingTableProps {
  bookings: AdminBookingResponse[];
  onViewDetails: (booking: AdminBookingResponse) => void;
  onStatusChanged: () => void;
}

export function AdminBookingTable({ bookings, onViewDetails, onStatusChanged }: AdminBookingTableProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-12 text-center border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <p className="text-sm text-slate-500">Không có dữ liệu booking nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 bg-slate-50/80 uppercase border-y border-slate-100">
          <tr>
            <th className="px-6 py-4 font-semibold">Mã Đặt</th>
            <th className="px-6 py-4 font-semibold">Khách Hàng</th>
            <th className="px-6 py-4 font-semibold">Tour</th>
            <th className="px-6 py-4 font-semibold">Tổng Tiền</th>
            <th className="px-6 py-4 font-semibold">Trạng Thái</th>
            <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">
                #{booking.id}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{booking.userName}</div>
                <div className="text-slate-500 text-xs">{booking.userEmail}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-slate-900 max-w-[320px] truncate" title={booking.tourName}>
                  {booking.tourName}
                </div>
                <div className="text-slate-500 text-xs">KH: {booking.departureDate?.split('-').reverse().join('/')}</div>
              </td>
              <td className="px-6 py-4 font-medium text-brand">
                {formatPrice(booking.totalPrice)}
              </td>
              <td className="px-6 py-4">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="px-6 py-4 text-right space-x-2 flex items-center justify-end">
                <AdminBookingStatusSelect 
                  bookingId={booking.id} 
                  currentStatus={booking.status} 
                  onStatusChange={onStatusChanged}
                  className="mr-2"
                />
                <button
                  onClick={() => onViewDetails(booking)}
                  className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
