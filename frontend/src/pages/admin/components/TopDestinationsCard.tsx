import { Progress } from "@/components/ui/progress"
import { StarIcon, MapPinIcon } from "lucide-react"

const destinations = [
  {
    name: "Ba Na Hills & Golden Bridge",
    location: "Da Nang",
    bookings: 1240,
    percentage: 82,
    rating: "4.9",
    revenue: "542M ₫",
  },
  {
    name: "Ha Long Bay 5-Star Cruise",
    location: "Quang Ninh",
    bookings: 780,
    percentage: 64,
    rating: "4.8",
    revenue: "385M ₫",
  },
  {
    name: "Phu Quoc Sunset & Coral Diving",
    location: "Kien Giang",
    bookings: 540,
    percentage: 45,
    rating: "4.7",
    revenue: "248M ₫",
  },
  {
    name: "Sapa Fansipan & Cat Cat Village",
    location: "Lao Cai",
    bookings: 420,
    percentage: 36,
    rating: "4.9",
    revenue: "189M ₫",
  },
]

export function TopDestinationsCard() {
  return (
    <div className="space-y-4">
      {destinations.map((dest) => (
        <div key={dest.name} className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <MapPinIcon className="size-3.5 text-primary" />
              <span className="font-semibold">{dest.name}</span>
              <span className="text-muted-foreground">({dest.location})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                {dest.rating}
              </span>
              <span className="font-mono font-semibold text-foreground">{dest.revenue}</span>
            </div>
          </div>
          <Progress value={dest.percentage} className="h-2" />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{dest.bookings} total bookings</span>
            <span>{dest.percentage}% capacity share</span>
          </div>
        </div>
      ))}
    </div>
  )
}
