import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Button } from "@/components/ui/button"

const monthlyData = [
  { name: "Jan", revenue: 180000000, bookings: 140, revenueUsd: 7500 },
  { name: "Feb", revenue: 245000000, bookings: 210, revenueUsd: 10200 },
  { name: "Mar", revenue: 310000000, bookings: 260, revenueUsd: 12900 },
  { name: "Apr", revenue: 420000000, bookings: 350, revenueUsd: 17500 },
  { name: "May", revenue: 490000000, bookings: 410, revenueUsd: 20400 },
  { name: "Jun", revenue: 620000000, bookings: 530, revenueUsd: 25800 },
  { name: "Jul", revenue: 680000000, bookings: 590, revenueUsd: 28300 },
  { name: "Aug", revenue: 560000000, bookings: 480, revenueUsd: 23300 },
  { name: "Sep", revenue: 380000000, bookings: 310, revenueUsd: 15800 },
  { name: "Oct", revenue: 340000000, bookings: 280, revenueUsd: 14100 },
  { name: "Nov", revenue: 290000000, bookings: 240, revenueUsd: 12000 },
  { name: "Dec", revenue: 450000000, bookings: 390, revenueUsd: 18750 },
]

export function OverviewChart() {
  const [metric, setMetric] = React.useState<"revenue" | "bookings">("revenue")

  const formatYAxis = (value: number) => {
    if (metric === "revenue") {
      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
      if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
      return `${value}`
    }
    return `${value}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {metric === "revenue"
            ? "Showing monthly revenue generated across all verified tours."
            : "Showing total confirmed booking requests by month."}
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          <Button
            size="xs"
            variant={metric === "revenue" ? "default" : "ghost"}
            onClick={() => setMetric("revenue")}
            className="text-xs h-7 px-2.5 font-medium"
          >
            Revenue (VND)
          </Button>
          <Button
            size="xs"
            variant={metric === "bookings" ? "default" : "ghost"}
            onClick={() => setMetric("bookings")}
            className="text-xs h-7 px-2.5 font-medium"
          >
            Bookings
          </Button>
        </div>
      </div>

      <div className="h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                      <div className="font-semibold text-foreground">{label} 2026</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">
                          {metric === "revenue" ? "Revenue:" : "Bookings:"}
                        </span>
                        <span className="font-semibold text-foreground font-mono">
                          {metric === "revenue"
                            ? `${data.revenue.toLocaleString("vi-VN")} ₫ ($${data.revenueUsd.toLocaleString()})`
                            : `${data.bookings} bookings`}
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey={metric}
              fill="currentColor"
              radius={[6, 6, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
