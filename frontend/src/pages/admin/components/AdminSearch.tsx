import * as React from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AdminSearch() {
  const [query, setQuery] = React.useState("")

  return (
    <div className="relative w-full max-w-[200px] sm:max-w-[280px]">
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search tours, bookings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-9 w-full bg-background pl-8 pr-12 text-xs shadow-none transition-colors hover:bg-muted/40 focus-visible:bg-background"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
        <span className="text-[10px]">⌘</span>K
      </kbd>
    </div>
  )
}
