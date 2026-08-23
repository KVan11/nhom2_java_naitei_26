import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ActivityIcon,
  ArrowUpRightIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  LayersIcon,
  MapPinIcon,
  MessageSquareQuoteIcon,
  PercentIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletCardsIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OverviewChart } from "./components/OverviewChart"
import { RecentSales } from "./components/RecentSales"
import { TopDestinationsCard } from "./components/TopDestinationsCard"
import { DateRangePicker } from "./components/DateRangePicker"

const quickModules = [
  {
    title: "Manage Tours",
    description: "Inventory, schedules & publishing",
    to: "/admin/tours",
    icon: CompassIcon,
    count: "142 Tours",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    title: "Booking Requests",
    description: "Approve & track customer bookings",
    to: "/admin/bookings",
    icon: TicketIcon,
    count: "47 Pending",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    title: "Manage Users",
    description: "Travelers, guides & staff roles",
    to: "/admin/users",
    icon: UsersIcon,
    count: "2,468 Users",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
  {
    title: "User Reviews",
    description: "Moderate traveler feedback & ratings",
    to: "/admin/reviews",
    icon: MessageSquareQuoteIcon,
    count: "12 New",
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    title: "Revenue & Finance",
    description: "Turnover, payout & VietQR logs",
    to: "/admin/revenue",
    icon: PercentIcon,
    count: "1.28B VND",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    title: "Tour Categories",
    description: "Destinations, tags & collections",
    to: "/admin/categories",
    icon: LayersIcon,
    count: "18 Active",
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
]

const auditLogs = [
  {
    id: "LOG-01",
    event: "Booking Confirmed",
    detail: "Booking #BK-8021 for Ba Na Hills approved by Admin",
    user: "System / Admin",
    time: "2 mins ago",
    type: "success",
  },
  {
    id: "LOG-02",
    event: "Payment Received",
    detail: "VietQR payment of 8,200,000 ₫ verified for Ha Long Cruise",
    user: "VietQR Gateway",
    time: "15 mins ago",
    type: "success",
  },
  {
    id: "LOG-03",
    event: "New Tour Published",
    detail: "Tour 'Phu Quoc Sunset & Coral' updated to Active status",
    user: "Content Manager",
    time: "1 hour ago",
    type: "info",
  },
  {
    id: "LOG-04",
    event: "Review Flagged",
    detail: "1-star review on Sapa Trekking flagged for moderation review",
    user: "Traveler #482",
    time: "2 hours ago",
    type: "warning",
  },
  {
    id: "LOG-05",
    event: "User Registered",
    detail: "New traveler account registered: hoang.nam@gmail.com",
    user: "Auth Service",
    time: "3 hours ago",
    type: "info",
  },
]

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [selectedRange, setSelectedRange] = React.useState("Feb 01, 2026 - Feb 28, 2026")

  const handleExport = () => {
    toast.success("Financial Report Downloaded", {
      description: `Report for period ${selectedRange} has been generated.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time overview of bookings, tour performance, revenue streams, and customer activities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker onRangeChange={setSelectedRange} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs shadow-2xs hover:bg-muted/80 gap-1.5"
          >
            <DownloadIcon className="size-3.5" />
            <span>Download</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/admin/tours")}
            className="text-xs shadow-2xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusIcon className="size-3.5" />
            <span>Create Tour</span>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/70 p-1">
          <TabsTrigger value="overview" className="text-xs font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs font-medium">
            Analytics & Tours
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs font-medium">
            Reports & Revenue
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-medium flex items-center gap-1.5">
            <span>Audit & Logs</span>
            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-slate-200">
              5
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          {/* 4 Metric / KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Revenue */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                  <CreditCardIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  1,284,500,000 ₫
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <TrendingUpIcon className="size-3.5" />
                  <span>+20.1%</span>
                  <span className="text-muted-foreground font-normal">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Bookings */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Confirmed Bookings
                </CardTitle>
                <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                  <TicketIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  +2,350
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <TrendingUpIcon className="size-3.5" />
                  <span>+180.1%</span>
                  <span className="text-muted-foreground font-normal">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Active Tours */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Active Tours & Routes
                </CardTitle>
                <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <CompassIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  +142 Tours
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                  <CheckCircle2Icon className="size-3.5" />
                  <span>98.6%</span>
                  <span className="text-muted-foreground font-normal">operational rate</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Active Travelers */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Travelers Online Now
                </CardTitle>
                <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
                  <ActivityIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>+573</span>
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
                  <span className="text-emerald-600 font-medium">+201</span>
                  <span>joined in last hour</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main 2-Column Section (7-col grid on xl) */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Overview Chart (4 cols) */}
            <Card className="lg:col-span-4 shadow-xs border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Revenue & Bookings Overview
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Monthly financial performance and tour reservation volume for 2026.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <OverviewChart />
              </CardContent>
            </Card>

            {/* Recent Bookings (3 cols) */}
            <Card className="lg:col-span-3 shadow-xs border-border/80 flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="text-xs">
                    You received 265 booking requests this month.
                  </CardDescription>
                </div>
                <Link to="/admin/bookings">
                  <Button variant="ghost" size="xs" className="text-xs gap-1 text-primary">
                    <span>View all</span>
                    <ArrowUpRightIcon className="size-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="flex-1">
                <RecentSales />
              </CardContent>
            </Card>
          </div>

          {/* Secondary Row: Top Destinations + Quick Modules */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Top Destinations (4 cols) */}
            <Card className="lg:col-span-4 shadow-xs border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MapPinIcon className="size-4 text-primary" />
                    Top Performing Destinations
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Highest booking capacity share and customer review ratings.
                  </CardDescription>
                </div>
                <Link to="/admin/tours">
                  <Button variant="ghost" size="xs" className="text-xs text-primary">
                    Manage Tours
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <TopDestinationsCard />
              </CardContent>
            </Card>

            {/* Quick Actions & Moderation Alerts (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Urgent Action Banner */}
              <Card className="bg-amber-50/70 border-amber-200/80 shadow-xs">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <SparklesIcon className="size-4" />
                    <CardTitle className="text-sm font-semibold">Action Required</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-amber-900 leading-relaxed">
                    You have <span className="font-semibold">47 pending booking requests</span> and <span className="font-semibold">12 new user reviews</span> awaiting moderation.
                  </p>
                  <div className="flex gap-2">
                    <Link to="/admin/bookings" className="flex-1">
                      <Button size="xs" className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">
                        Review Bookings (47)
                      </Button>
                    </Link>
                    <Link to="/admin/reviews" className="flex-1">
                      <Button size="xs" variant="outline" className="w-full border-amber-300 text-amber-900 bg-amber-100/50 hover:bg-amber-100 text-xs">
                        Reviews (12)
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Navigation Cards */}
              <Card className="shadow-xs border-border/80 flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Quick Management</CardTitle>
                  <CardDescription className="text-xs">Direct access to core administrative modules.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2.5">
                    {quickModules.slice(0, 4).map((mod) => {
                      const Icon = mod.icon
                      return (
                        <Link key={mod.title} to={mod.to}>
                          <div className="group rounded-lg border border-border p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xs bg-card">
                            <div className="flex items-center justify-between">
                              <div className={cn("size-7 rounded-md flex items-center justify-center border", mod.color)}>
                                <Icon className="size-3.5" />
                              </div>
                              <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-primary">
                                {mod.count}
                              </span>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-foreground group-hover:text-primary">
                              {mod.title}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full Grid of All Management Modules */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Admin Modules Directory</h2>
              <span className="text-xs text-muted-foreground">6 operational modules</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickModules.map((module) => {
                const Icon = module.icon
                return (
                  <Link key={module.title} to={module.to}>
                    <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className={cn("size-8 rounded-lg flex items-center justify-center border", module.color)}>
                            <Icon className="size-4" />
                          </div>
                          <Badge variant="outline" className="text-[11px] font-semibold">
                            {module.count}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold mt-2 group-hover:text-primary transition-colors flex items-center justify-between">
                          <span>{module.title}</span>
                          <ArrowUpRightIcon className="size-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {module.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="text-xs font-medium text-primary group-hover:underline">
                          Open module →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ANALYTICS & TOURS */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Category Breakdown */}
            <Card className="shadow-xs border-border/80 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tour Categories Performance</CardTitle>
                <CardDescription className="text-xs">
                  Market share and booking volume across tour types in 2026.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Beach & Tropical Island Tours", share: 38, count: "893 bookings", rev: "488M ₫" },
                  { name: "Cultural & Heritage Tours", share: 27, count: "635 bookings", rev: "346M ₫" },
                  { name: "Luxury Cruise & Bay Excursions", share: 18, count: "423 bookings", rev: "231M ₫" },
                  { name: "Mountain Trekking & Eco-Tours", share: 11, count: "258 bookings", rev: "141M ₫" },
                  { name: "Food & Culinary Discovery", share: 6, count: "141 bookings", rev: "78M ₫" },
                ].map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{cat.count}</span>
                        <span className="font-mono font-semibold">{cat.rev} ({cat.share}%)</span>
                      </div>
                    </div>
                    <Progress value={cat.share * 2.5} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Traveler Demographics */}
            <Card className="shadow-xs border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Traveler Origin Breakdown</CardTitle>
                <CardDescription className="text-xs">Domestic vs. International bookings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 text-center">
                  <div className="text-3xl font-bold text-foreground">68.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">Domestic Travelers (Vietnam)</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Domestic (Hanoi, HCM, Da Nang)</span>
                    <span className="font-semibold">68.4%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">South Korea</span>
                    <span className="font-semibold">14.2%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Japan & Taiwan</span>
                    <span className="font-semibold">8.6%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Europe & Americas</span>
                    <span className="font-semibold">5.8%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Others</span>
                    <span className="font-semibold">3.0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: REPORTS & REVENUE */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Payment Gateway & Revenue Summary</CardTitle>
                <CardDescription className="text-xs">
                  Breakdown by payment method and transaction status.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleExport} className="text-xs gap-1.5">
                <FileSpreadsheetIcon className="size-3.5" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Average Value</TableHead>
                    <TableHead className="text-right">Total Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2">
                      <WalletCardsIcon className="size-4 text-emerald-600" />
                      VietQR Instant Bank Transfer
                    </TableCell>
                    <TableCell>1,980</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">99.4%</Badge>
                    </TableCell>
                    <TableCell className="font-mono">3,850,000 ₫</TableCell>
                    <TableCell className="text-right font-mono font-semibold">762,300,000 ₫</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2">
                      <CreditCardIcon className="size-4 text-blue-600" />
                      Credit & Debit Cards (Visa/Mastercard)
                    </TableCell>
                    <TableCell>842</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">98.1%</Badge>
                    </TableCell>
                    <TableCell className="font-mono">4,900,000 ₫</TableCell>
                    <TableCell className="text-right font-mono font-semibold">412,580,000 ₫</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2">
                      <TicketIcon className="size-4 text-purple-600" />
                      MoMo E-Wallet
                    </TableCell>
                    <TableCell>246</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">99.0%</Badge>
                    </TableCell>
                    <TableCell className="font-mono">1,450,000 ₫</TableCell>
                    <TableCell className="text-right font-mono font-semibold">109,620,000 ₫</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: AUDIT LOGS */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">System Audit & Activity Logs</CardTitle>
                <CardDescription className="text-xs">
                  Real-time chronological events recorded across admin and traveler actions.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Live Feed
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between border-b pb-3.5 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 size-2.5 rounded-full bg-primary" />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-foreground">{log.event}</p>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                            {log.user}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.detail}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
