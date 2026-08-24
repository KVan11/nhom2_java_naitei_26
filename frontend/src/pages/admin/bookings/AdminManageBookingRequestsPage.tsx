import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Ticket,
  CheckCircle2,
  Clock,
  Ban,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { adminBookingService } from "@/features/booking/services/admin-booking.service";
import {
  AdminBookingResponse,
  BookingStatus,
} from "@/features/booking/types/admin-booking.types";
import { AdminBookingTable } from "@/features/booking/components/admin/AdminBookingTable";
import { AdminBookingDetailModal } from "@/features/booking/components/admin/AdminBookingDetailModal";

export default function AdminManageBookingRequestsPage() {
  const [bookings, setBookings] = useState<AdminBookingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<AdminBookingResponse | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    failed: 0,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminBookingService.getAdminBookings({
        page,
        size: 10,
        searchKeyword: debouncedKeyword || undefined,
        status: (statusFilter as BookingStatus) || undefined,
      });
      setBookings(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error("Failed to fetch admin bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await adminBookingService.getAdminBookingStats();
      setStats(res);
    } catch (error) {
      console.error("Failed to fetch admin booking stats:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [page, debouncedKeyword, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchBookings();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Booking</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và duyệt các yêu cầu đặt tour từ khách hàng
          </p>
        </div>
      </div>

      {/* 4 Metric / KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Card 1: Total */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Tổng số Booking
            </CardDescription>
            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ticket className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số đặt chỗ trên hệ thống
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Confirmed */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Đã xác nhận
            </CardDescription>
            <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{stats.confirmed}</span>
              {stats.confirmed > 0 && (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600 font-medium">
              Khách đã thanh toán xong
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Pending */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Đang chờ thanh toán
            </CardDescription>
            <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.pending}
            </div>
            <p className="text-xs text-amber-600 font-medium">
              Chờ khách chuyển khoản
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Cancelled & Expired */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Hủy bỏ / Hết hạn
            </CardDescription>
            <div className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.failed}
            </div>
            <p className="text-xs text-rose-600 font-medium">
              Bị hủy hoặc quá hạn thanh toán
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã, tên khách hàng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(0);
              }}
              className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING_PAYMENT">Chờ thanh toán</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-b-2xl transition-all duration-300">
              <Loader2 className="w-8 h-8 animate-spin text-brand drop-shadow-md" />
            </div>
          )}
          <AdminBookingTable
            bookings={bookings}
            onViewDetails={(b) => setSelectedBooking(b)}
            onStatusChanged={() => {
              fetchBookings();
              fetchStats();
            }}
          />
        </div>

        {/* Pagination */}
        {bookings.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-border text-xs text-muted-foreground bg-muted/20">
            <div>
              Hiển thị{" "}
              <span className="font-semibold text-foreground">
                {bookings.length}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-semibold text-foreground">
                {totalElements}
              </span>{" "}
              booking
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="inline-flex items-center justify-center h-8 px-2.5 text-xs font-medium border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Trước
              </button>
              <div className="px-3 py-1 bg-background border border-border rounded-md font-mono text-xs font-semibold text-foreground">
                Trang {page + 1} / {Math.max(totalPages, 1)}
              </div>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center justify-center h-8 px-2.5 text-xs font-medium border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
              >
                Sau
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AdminBookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
