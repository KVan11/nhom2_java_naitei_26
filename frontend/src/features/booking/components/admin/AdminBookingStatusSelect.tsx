import { useState } from "react";
import { BookingStatus } from "../../types/admin-booking.types";
import { adminBookingService } from "../../services/admin-booking.service";
import { Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminBookingStatusSelectProps {
  bookingId: number;
  currentStatus: BookingStatus;
  onStatusChange?: (newStatus: BookingStatus) => void;
  className?: string;
}

export function AdminBookingStatusSelect({
  bookingId,
  currentStatus,
  onStatusChange,
  className,
}: AdminBookingStatusSelectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<BookingStatus>(currentStatus);

  const handleCancelBooking = async () => {
    try {
      setIsLoading(true);
      await adminBookingService.updateAdminBookingStatus(bookingId, "CANCELLED");
      setStatus("CANCELLED");
      onStatusChange?.("CANCELLED");
      toast.success("Đã hủy booking thành công!");
    } catch (error) {
      console.error("Lỗi khi hủy booking:", error);
      toast.error("Hủy booking thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {status === "CONFIRMED" && (
        <AlertDialog>
          <AlertDialogTrigger 
            disabled={isLoading}
            title="Hủy Booking"
            className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận hủy đặt chỗ</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy đặt chỗ này không? Thao tác này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Quay lại</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Hủy đặt chỗ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
