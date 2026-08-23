import * as React from "react"
import { CalendarIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const presets = [
  { label: "Today", value: "today", range: "Feb 23, 2026" },
  { label: "Last 7 days", value: "7d", range: "Feb 16, 2026 - Feb 23, 2026" },
  { label: "Last 30 days", value: "30d", range: "Jan 24, 2026 - Feb 23, 2026" },
  { label: "This Month (Feb 2026)", value: "month", range: "Feb 01, 2026 - Feb 28, 2026" },
  { label: "Last Month (Jan 2026)", value: "last_month", range: "Jan 01, 2026 - Jan 31, 2026" },
  { label: "Year to Date (2026)", value: "ytd", range: "Jan 01, 2026 - Dec 31, 2026" },
]

interface DateRangePickerProps {
  className?: string
  onRangeChange?: (range: string) => void
}

export function DateRangePicker({ className, onRangeChange }: DateRangePickerProps) {
  const [selected, setSelected] = React.useState(presets[3])

  const handleSelect = (preset: (typeof presets)[0]) => {
    setSelected(preset)
    onRangeChange?.(preset.range)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger render={<div role="button" tabIndex={0} />}>
          <Button
            variant="outline"
            className="w-[260px] justify-start text-left font-normal shadow-2xs hover:bg-muted/80"
          >
            <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
            <span className="truncate text-xs font-medium">{selected.range}</span>
            <ChevronDownIcon className="ml-auto size-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Filter Time Period
          </div>
          <DropdownMenuSeparator />
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.value}
              className="flex items-center justify-between text-xs cursor-pointer"
              onClick={() => handleSelect(preset)}
            >
              <span>{preset.label}</span>
              {selected.value === preset.value && (
                <CheckIcon className="size-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
