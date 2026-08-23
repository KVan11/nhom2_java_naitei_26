import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RecentBooking {
  id: string
  name: string
  email: string
  tour: string
  amount: string
  status: "paid" | "confirmed" | "pending"
  time: string
  avatar?: string
  fallback: string
}

const recentBookings: RecentBooking[] = [
  {
    id: "BK-8021",
    name: "Nguyen Van An",
    email: "nguyen.an@gmail.com",
    tour: "Ba Na Hills 1-Day Fantasy Tour",
    amount: "+1,850,000 ₫",
    status: "paid",
    time: "2m ago",
    fallback: "NA",
  },
  {
    id: "BK-8020",
    name: "Tran Thi Mai",
    email: "mai.tran@outlook.com",
    tour: "Da Nang - Hoi An Heritage 3D2N",
    amount: "+4,950,000 ₫",
    status: "confirmed",
    time: "15m ago",
    fallback: "TM",
  },
  {
    id: "BK-8019",
    name: "Jackson Davis",
    email: "jackson.d@traveler.org",
    tour: "Ha Long Bay 5-Star Luxury Cruise",
    amount: "+8,200,000 ₫",
    status: "paid",
    time: "42m ago",
    fallback: "JD",
  },
  {
    id: "BK-8018",
    name: "Le Hoang Nam",
    email: "nam.le92@yahoo.com",
    tour: "Phu Quoc Sunset Snorkeling & Coral",
    amount: "+3,450,000 ₫",
    status: "pending",
    time: "1h ago",
    fallback: "LN",
  },
  {
    id: "BK-8017",
    name: "Pham Thu Huong",
    email: "huong.pham@gmail.com",
    tour: "Sapa Fansipan Peak Trekking 2D1N",
    amount: "+2,790,000 ₫",
    status: "confirmed",
    time: "3h ago",
    fallback: "PH",
  },
]

function getStatusBadge(status: RecentBooking["status"]) {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Paid</Badge>
    case "confirmed":
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">Confirmed</Badge>
    case "pending":
      return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">Pending</Badge>
  }
}

export function RecentSales() {
  return (
    <div className="space-y-6">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar size="default" className="size-9 border border-border">
              {booking.avatar && <AvatarImage src={booking.avatar} alt={booking.name} />}
              <AvatarFallback className="font-semibold text-xs bg-slate-100 text-slate-700">
                {booking.fallback}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none text-foreground">{booking.name}</p>
                {getStatusBadge(booking.status)}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">
                {booking.tour}
              </p>
              <p className="text-[11px] text-muted-foreground/70">
                {booking.email} • {booking.time}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-semibold text-foreground">
              {booking.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
