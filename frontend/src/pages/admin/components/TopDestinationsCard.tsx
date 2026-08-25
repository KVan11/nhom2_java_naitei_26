import { MapPinIcon, CompassIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { BackendTourResponse } from "@/features/tour/services/tour.service"

interface TopDestinationsCardProps {
  tours?: BackendTourResponse[]
  loading?: boolean
}

export function TopDestinationsCard({ tours = [], loading = false }: TopDestinationsCardProps) {
  if (loading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-4 w-20 rounded bg-slate-200" />
            </div>
            <div className="h-2 w-full rounded bg-slate-200" />
          </div>
        ))}
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground">
        No tours found in catalog.
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {tours.slice(0, 5).map((tour) => (
        <div key={tour.id} className="p-2.5 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground min-w-0">
              <MapPinIcon className="size-3.5 text-primary shrink-0" />
              <span className="font-semibold truncate max-w-[200px] sm:max-w-[260px]">
                {tour.name}
              </span>
            </div>
            <span className="font-mono font-bold text-foreground shrink-0">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                tour.basePrice || 0
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{tour.destination || tour.departure || "Vietnam"}</span>
              <span>•</span>
              <span>{tour.duration || "N/A"}</span>
              {tour.category?.name && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                    {tour.category.name}
                  </Badge>
                </>
              )}
            </div>
            <Badge
              variant="outline"
              className={`text-[10px] py-0 px-1.5 h-4 ${
                tour.status === "AVAILABLE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tour.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
