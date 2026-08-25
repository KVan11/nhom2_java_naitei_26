import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  CompassIcon,
  CreditCardIcon,
  DownloadIcon,
  LayersIcon,
  MapPinIcon,
  MessageSquareQuoteIcon,
  PercentIcon,
  PlusIcon,
  RefreshCwIcon,
  TicketIcon,
  TrendingUpIcon,
  UsersIcon,
  XCircleIcon,
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

// Backend Services
import { adminRevenueService } from "@/features/admin/services/adminRevenueService"
import { RevenueStats, DailyRevenue } from "@/features/admin/types/revenue"
import { adminBookingService } from "@/features/booking/services/admin-booking.service"
import {
  AdminBookingResponse,
  AdminBookingStatsResponse,
} from "@/features/booking/types/admin-booking.types"
import { adminUserService, UserStats } from "@/features/user/services/adminUserService"
import { getAdminTours } from "@/services/adminTourService"
import { getAdminCategories, CategoryResponse } from "@/services/categoryService"
import { adminReviewService } from "@/services/adminReviewService"
import type { BackendTourResponse } from "@/features/tour/services/tour.service"

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)

  // Real State Data from Backend
  const [revenueStats, setRevenueStats] = React.useState<RevenueStats>({
    totalRevenue: 0,
    chartData: [],
  })
  const [bookingStats, setBookingStats] = React.useState<AdminBookingStatsResponse>({
    total: 0,
    confirmed: 0,
    pending: 0,
    failed: 0,
  })
  const [recentBookings, setRecentBookings] = React.useState<AdminBookingResponse[]>([])
  const [userStats, setUserStats] = React.useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    lockedUsers: 0,
    deletedUsers: 0,
    newThisWeek: 0,
    adminUsers: 0,
    regularUsers: 0,
    staffUsers: 0,
    guideUsers: 0,
  })
  const [totalTours, setTotalTours] = React.useState(0)
  const [topTours, setTopTours] = React.useState<BackendTourResponse[]>([])
  const [categories, setCategories] = React.useState<CategoryResponse[]>([])
  const [reviewCount, setReviewCount] = React.useState(0)

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true)
    try {
      const [
        revenueRes,
        bookingStatsRes,
        recentBookingsRes,
        userStatsRes,
        toursRes,
        categoriesRes,
        reviewsRes,
      ] = await Promise.allSettled([
        adminRevenueService.getStats(),
        adminBookingService.getAdminBookingStats(),
        adminBookingService.getAdminBookings({ size: 5, sort: "id,desc" }),
        adminUserService.getUserStats(),
        getAdminTours({ page: 0, size: 5 }),
        getAdminCategories(),
        adminReviewService.getReviews(),
      ])

      if (revenueRes.status === "fulfilled" && revenueRes.value) {
        setRevenueStats(revenueRes.value)
      }
      if (bookingStatsRes.status === "fulfilled" && bookingStatsRes.value) {
        setBookingStats(bookingStatsRes.value)
      }
      if (recentBookingsRes.status === "fulfilled" && recentBookingsRes.value?.content) {
        setRecentBookings(recentBookingsRes.value.content)
      }
      if (userStatsRes.status === "fulfilled" && userStatsRes.value) {
        setUserStats(userStatsRes.value)
      }
      if (toursRes.status === "fulfilled" && toursRes.value) {
        setTotalTours(toursRes.value.totalElements || toursRes.value.content?.length || 0)
        setTopTours(toursRes.value.content || [])
      }
      if (categoriesRes.status === "fulfilled" && categoriesRes.value) {
        setCategories(categoriesRes.value)
      }
      if (reviewsRes.status === "fulfilled" && reviewsRes.value) {
        setReviewCount(reviewsRes.value.length || 0)
      }
    } catch {
      // Handled silently with fallback states
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0)
  }

  const quickModules = [
    {
      title: "Manage Tours",
      description: "Inventory, schedules & publishing",
      to: "/admin/tours",
      icon: CompassIcon,
      count: `${totalTours} Tours`,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Booking Requests",
      description: "Approve & track customer bookings",
      to: "/admin/bookings",
      icon: TicketIcon,
      count: `${bookingStats.pending} Pending`,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Manage Users",
      description: "Travelers, guides & staff roles",
      to: "/admin/users",
      icon: UsersIcon,
      count: `${userStats.totalUsers} Accounts`,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "User Reviews",
      description: "Moderate traveler feedback & ratings",
      to: "/admin/reviews",
      icon: MessageSquareQuoteIcon,
      count: `${reviewCount} Reviews`,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      title: "Revenue & Finance",
      description: "Turnover, payout & VietQR logs",
      to: "/admin/revenue",
      icon: PercentIcon,
      count: formatVND(revenueStats.totalRevenue),
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Tour Categories",
      description: "Destinations, tags & collections",
      to: "/admin/categories",
      icon: LayersIcon,
      count: `${categories.length} Categories`,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time overview of bookings, tour inventory, financial revenue, and registered accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
            className="text-xs shadow-2xs gap-1.5"
          >
            <RefreshCwIcon className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
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
          <TabsTrigger value="bookings" className="text-xs font-medium flex items-center gap-1.5">
            <span>Bookings & Tours</span>
            {bookingStats.pending > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-amber-100 text-amber-800">
                {bookingStats.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs font-medium">
            Daily Revenue Breakdown
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
                <div className="size-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCardIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {formatVND(revenueStats.totalRevenue)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUpIcon className="size-3.5 text-emerald-600" />
                  <span>From all verified payments</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Bookings */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Confirmed Bookings
                </CardTitle>
                <div className="size-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <TicketIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {bookingStats.confirmed}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ClockIcon className="size-3.5 text-amber-600" />
                  <span>{bookingStats.pending} pending confirmation</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Active Tours */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Total Tours in Catalog
                </CardTitle>
                <div className="size-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <CompassIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {totalTours} Tours
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LayersIcon className="size-3.5 text-purple-600" />
                  <span>Across {categories.length} active categories</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Registered Users */}
            <Card className="shadow-xs transition-all hover:shadow-md border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  Registered Accounts
                </CardTitle>
                <div className="size-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <UsersIcon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {userStats.totalUsers} Users
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="text-purple-600 font-semibold">+{userStats.newThisWeek} new</span>
                  <span>this week • {userStats.activeUsers} active</span>
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
                    Revenue Trend (Last 14 Days)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Aggregated daily income from VietQR bank transfers and payments.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <OverviewChart data={revenueStats.chartData} />
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
                    Latest booking reservations submitted by customers.
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
                <RecentSales bookings={recentBookings} loading={loading} />
              </CardContent>
            </Card>
          </div>

          {/* Secondary Row: Top Tours Catalog + Quick Modules */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Top Tours (4 cols) */}
            <Card className="lg:col-span-4 shadow-xs border-border/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MapPinIcon className="size-4 text-primary" />
                    Featured Tours Catalog
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Active tour routes and destinations available for online reservation.
                  </CardDescription>
                </div>
                <Link to="/admin/tours">
                  <Button variant="ghost" size="xs" className="text-xs text-primary">
                    Manage Tours
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <TopDestinationsCard tours={topTours} loading={loading} />
              </CardContent>
            </Card>

            {/* Quick Actions & Moderation Alerts (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Urgent Action Banner */}
              {bookingStats.pending > 0 && (
                <Card className="bg-amber-50/70 border-amber-200/80 shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-amber-800">
                      <ClockIcon className="size-4" />
                      <CardTitle className="text-sm font-semibold">Action Required</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-amber-900 leading-relaxed">
                      You have <span className="font-semibold">{bookingStats.pending} pending booking requests</span> awaiting review and confirmation.
                    </p>
                    <Link to="/admin/bookings">
                      <Button size="xs" className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">
                        Review Bookings ({bookingStats.pending})
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Quick Navigation Cards */}
              <Card className="shadow-xs border-border/80 flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Quick Management</CardTitle>
                  <CardDescription className="text-xs">Direct shortcuts to administrative modules.</CardDescription>
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

        {/* TAB 2: BOOKINGS & TOURS */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Booking Status Summary */}
            <Card className="shadow-xs border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Booking Requests Status</CardTitle>
                <CardDescription className="text-xs">
                  Breakdown of all customer bookings recorded in the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-emerald-50/50 border-emerald-200">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                      <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                      <span>Confirmed</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-950 mt-1">{bookingStats.confirmed}</div>
                  </div>

                  <div className="p-3 rounded-lg border bg-amber-50/50 border-amber-200">
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold">
                      <ClockIcon className="size-3.5 text-amber-600" />
                      <span>Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-950 mt-1">{bookingStats.pending}</div>
                  </div>

                  <div className="p-3 rounded-lg border bg-rose-50/50 border-rose-200">
                    <div className="flex items-center gap-1.5 text-xs text-rose-800 font-semibold">
                      <XCircleIcon className="size-3.5 text-rose-600" />
                      <span>Cancelled / Failed</span>
                    </div>
                    <div className="text-2xl font-bold text-rose-950 mt-1">{bookingStats.failed}</div>
                  </div>

                  <div className="p-3 rounded-lg border bg-blue-50/50 border-blue-200">
                    <div className="flex items-center gap-1.5 text-xs text-blue-800 font-semibold">
                      <TicketIcon className="size-3.5 text-blue-600" />
                      <span>Total Bookings</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-950 mt-1">{bookingStats.total}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/admin/bookings">
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Go to Bookings Management →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Categories Overview */}
            <Card className="shadow-xs border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tour Categories ({categories.length})</CardTitle>
                <CardDescription className="text-xs">
                  Active classification categories configured in catalog.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg border text-xs">
                      <div className="flex items-center gap-2">
                        <LayersIcon className="size-3.5 text-purple-600" />
                        <span className="font-semibold text-foreground">{c.name}</span>
                      </div>
                      <span className="text-muted-foreground text-[11px] font-mono">
                        ID: #{c.id}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No categories created yet.
                  </div>
                )}
                <div className="pt-2">
                  <Link to="/admin/categories">
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Manage Categories →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: DAILY REVENUE */}
        <TabsContent value="revenue" className="space-y-6">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">14-Day Revenue Record</CardTitle>
                <CardDescription className="text-xs">
                  Daily financial turnover recorded from confirmed customer transactions.
                </CardDescription>
              </div>
              <Link to="/admin/revenue">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <PercentIcon className="size-3.5" />
                  <span>Full Financial View</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {revenueStats.chartData && revenueStats.chartData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">Date</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Daily Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueStats.chartData.map((d: DailyRevenue) => (
                      <TableRow key={d.date}>
                        <TableCell className="text-xs font-medium font-mono">
                          {new Date(d.date).toLocaleDateString("vi-VN", {
                            weekday: "short",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-mono font-bold text-right text-emerald-700">
                          {formatVND(d.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No daily revenue transactions recorded in the last 14 days.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
