import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { adminBookingService } from "@/features/booking/services/admin-booking.service";
import { AdminBookingResponse } from "@/features/booking/types/admin-booking.types";
import { BookingStatusBadge } from "@/features/booking/components/admin/BookingStatusBadge";
import { formatPrice } from "@/constants/mockData";

interface AdminBookingDetailModalProps {
  booking: AdminBookingResponse | null;
  onClose: () => void;
}

export function AdminBookingDetailModal({
  booking,
  onClose,
}: AdminBookingDetailModalProps) {
  const [details, setDetails] = useState<AdminBookingResponse | null>(booking);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    setDetails(booking);

    if (!booking) return;

    const fetchFullDetails = async () => {
      try {
        setLoadingExtra(true);
        const data = await adminBookingService.getAdminBookingDetails(
          booking.id,
        );
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
      } finally {
        setLoadingExtra(false);
      }
    };

    fetchFullDetails();
  }, [booking]);

  if (!booking || !details) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              Chi tiết Đặt chỗ #{details.id}
            </h2>
            {loadingExtra && (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                  Thông tin Khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">Người đặt:</span>{" "}
                    <span className="font-medium">{details.userName}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span>{" "}
                    {details.userEmail}
                  </p>
                  <p>
                    <span className="text-slate-500">Tên liên hệ:</span>{" "}
                    {details.contactName}
                  </p>
                  <p>
                    <span className="text-slate-500">SĐT liên hệ:</span>{" "}
                    {details.contactPhone}
                  </p>
                  <p>
                    <span className="text-slate-500">Email liên hệ:</span>{" "}
                    {details.contactEmail}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                  Thông tin Chuyến đi
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-slate-500">Tour:</span>{" "}
                    <span className="font-medium">{details.tourName}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Ngày khởi hành:</span>{" "}
                    {details.departureDate?.split("-").reverse().join("/")}
                  </p>
                  <p>
                    <span className="text-slate-500">Ngày đặt:</span>{" "}
                    {details.bookingDate
                      ? new Date(details.bookingDate).toLocaleString("vi-VN")
                      : "N/A"}
                  </p>
                  <p>
                    <span className="text-slate-500">Số lượng người:</span>{" "}
                    {details.numberOfPeople}
                  </p>
                  <p>
                    <span className="text-slate-500">Trạng thái:</span>{" "}
                    <BookingStatusBadge
                      status={details.status}
                      className="ml-2"
                    />
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Danh sách Hành khách
              </h3>
              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative min-h-[60px]">
                {loadingExtra && !details.travelers ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-brand" />
                  </div>
                ) : null}

                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100/50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 font-medium">Họ tên</th>
                      <th className="px-4 py-2 font-medium text-center">
                        Phân loại
                      </th>
                      <th className="px-4 py-2 font-medium text-center">
                        Giới tính
                      </th>
                      <th className="px-4 py-2 font-medium text-center">
                        Ngày sinh
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {details.travelers?.length > 0 ? (
                      details.travelers.map((t, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-slate-900">
                            <div>{t.fullName}</div>
                            {t.phone && (
                              <div className="text-xs text-slate-500">
                                {t.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center text-xs font-medium">
                            <span
                              className={`px-2 py-0.5 rounded-full ${t.travelerType === "ADULT" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                            >
                              {t.travelerType === "ADULT"
                                ? "Người lớn"
                                : t.travelerType === "CHILD"
                                  ? "Trẻ em"
                                  : "Em bé"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {t.gender === "MALE"
                              ? "Nam"
                              : t.gender === "FEMALE"
                                ? "Nữ"
                                : "Khác"}
                          </td>
                          <td className="px-4 py-2 text-center text-slate-500">
                            {t.dateOfBirth
                              ? t.dateOfBirth.split("-").reverse().join("/")
                              : ""}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-4 text-center text-slate-500 italic"
                        >
                          {loadingExtra
                            ? "Đang tải dữ liệu..."
                            : "Không có dữ liệu hành khách"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Thanh toán
              </h3>
              <div className="bg-brand/5 rounded-xl border border-brand/10 p-4 relative">
                {loadingExtra && !details.payment ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-brand" />
                  </div>
                ) : null}

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">
                    Tổng thanh toán:
                  </span>
                  <span className="text-lg font-bold text-brand">
                    {formatPrice(details.totalPrice)}
                  </span>
                </div>
                {details.payment && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">
                      Phương thức:{" "}
                      <span className="font-medium text-slate-900">
                        {details.payment.method || "Chưa chọn"}
                      </span>
                    </span>
                    <span className="text-slate-500">
                      Tình trạng:{" "}
                      <span className="font-medium text-slate-900">
                        {details.payment.status || "N/A"}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
