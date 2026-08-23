import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DailyRevenue } from "@/features/admin/types/revenue"; // Import type

interface OverviewChartProps {
  data: DailyRevenue[]; // Define props for real data
}

export function OverviewChart({ data }: OverviewChartProps) {
  // Format date from YYYY-MM-DD to DD/MM for better UI
  const chartData = data.map(item => ({
    name: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    revenue: item.amount,
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
    return `${value.toLocaleString()}`
  }

  return (
      <div className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
                cursor={{fill: 'transparent'}}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                        <div className="rounded-lg border bg-white p-3 shadow-sm">
                          <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
                          <div className="font-bold text-brand">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value as number)}
                          </div>
                        </div>
                    );
                  }
                  return null;
                }}
            />
            <Bar
                dataKey="revenue"
                fill="var(--color-brand)" // Using Sun Red from your index.css
                radius={[4, 4, 0, 0]}
                barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
  )
}