import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AdminBookingResponse, BookingStatus } from "@/features/booking/types/admin-booking.types"

interface RecentSalesProps {
  bookings?: AdminBookingResponse[]
  loading?: boolean
}

function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case "CONFIRMED":
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Confirmed</Badge>
    case "PENDING_PAYMENT":
      return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
    case "CANCELLED":
      return <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200">Cancelled</Badge>
    case "EXPIRED":
      return <Badge variant="outline" className="bg-slate-100 text-slate-600">Expired</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function RecentSales({ bookings = [], loading = false }: RecentSalesProps) {
  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-slate-200" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-200" />
              </div>
            </div>
            <div className="h-4 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground">
        No recent bookings recorded yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.slice(0, 5).map((booking) => {
        const name = booking.contactName || booking.userName || "Customer"
        const email = booking.contactEmail || booking.userEmail || "No email"
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()

        return (
          <div key={booking.id} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-9 border border-border shrink-0">
                <AvatarFallback className="font-semibold text-xs bg-slate-100 text-slate-700">
                  {initials || "BK"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold leading-none text-foreground truncate max-w-[140px] sm:max-w-[180px]">
                    {name}
                  </p>
                  {getStatusBadge(booking.status)}
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[240px]">
                  {booking.tourName}
                </p>
                <p className="text-[11px] text-muted-foreground/70 font-mono">
                  #{booking.id} • {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("vi-VN") : "Recent"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-bold text-foreground">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                  booking.totalPrice || 0
                )}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
