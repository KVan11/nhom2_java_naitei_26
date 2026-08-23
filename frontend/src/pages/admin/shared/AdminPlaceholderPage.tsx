import * as React from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Metric = {
  label: string
  value: string
  trend: string
}

type Row = {
  name: string
  status: string
  updatedAt: string
  extra?: string
}

type AdminPlaceholderPageProps = {
  title: string
  description: string
  actionLabel: string
  metrics: Metric[]
  rows: Row[]
}

function statusBadge(status: string) {
  const value = status.toLowerCase()

  if (value.includes("active") || value.includes("approved") || value.includes("verified") || value.includes("stable")) {
    return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">{status}</Badge>
  }
  if (value.includes("pending")) {
    return <Badge className="bg-amber-50 text-amber-700 border-amber-200">{status}</Badge>
  }
  if (value.includes("closed") || value.includes("draft")) {
    return <Badge variant="secondary" className="bg-slate-100 text-slate-700">{status}</Badge>
  }
  if (value.includes("locked") || value.includes("rejected") || value.includes("inactive")) {
    return <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200">{status}</Badge>
  }

  return <Badge variant="outline">{status}</Badge>
}

export default function AdminPlaceholderPage({
  title,
  description,
  actionLabel,
  metrics,
  rows,
}: AdminPlaceholderPageProps) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const handleAction = () => {
    toast.info(`Action triggered: ${actionLabel}`, {
      description: `Create flow modal or drawer will be integrated here for ${title}.`,
    })
  }

  const handleExport = () => {
    toast.success("Data Exported", {
      description: `CSV file for ${title} generated successfully.`,
    })
  }

  const filteredRows = rows.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase())
    if (statusFilter === "all") return matchesSearch
    return matchesSearch && row.status.toLowerCase().includes(statusFilter.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs gap-1.5 shadow-2xs hover:bg-muted"
          >
            <DownloadIcon className="size-3.5" />
            <span>Export</span>
          </Button>
          <Button
            size="sm"
            onClick={handleAction}
            className="text-xs gap-1.5 shadow-2xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircleIcon className="size-3.5" />
            <span>{actionLabel}</span>
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="shadow-xs border-border/80 transition-all hover:shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-muted-foreground">
                {metric.label}
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                {metric.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUpIcon className="size-3 text-emerald-600" />
                <span>{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Card with Filter and Table */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Records List</CardTitle>
              <CardDescription className="text-xs">
                Manage, filter, and review active entries in this module.
              </CardDescription>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-60">
                <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter records..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 h-8 px-2.5 text-xs rounded-md border border-border bg-background hover:bg-muted text-muted-foreground">
                  <FilterIcon className="size-3.5" />
                  <span>Filter</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-xs cursor-pointer">
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")} className="text-xs cursor-pointer">
                    Active / Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="text-xs cursor-pointer">
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")} className="text-xs cursor-pointer">
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-semibold pl-6">Record / Item</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right pr-6">Last Updated</TableHead>
                <TableHead className="text-xs font-semibold w-12 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row, idx) => (
                  <TableRow key={`${row.name}-${idx}`} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="font-medium text-xs text-foreground pl-6">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-xs">
                      {statusBadge(row.status)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground pr-6 font-mono">
                      {row.updatedAt}
                    </TableCell>
                    <TableCell className="text-center pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="size-7 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground">
                          <MoreHorizontalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => toast.info(`View detail: ${row.name}`)}>
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => toast.info(`Edit record: ${row.name}`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs cursor-pointer text-destructive focus:text-destructive" onClick={() => toast.error(`Deleted: ${row.name}`)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-xs text-muted-foreground">
                    No matching records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Table Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">1-{filteredRows.length}</span> of{" "}
              <span className="font-semibold text-foreground">{rows.length}</span> items
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-7" disabled>
                <ChevronLeftIcon className="size-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="size-7" disabled>
                <ChevronRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
