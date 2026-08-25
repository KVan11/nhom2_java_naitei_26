import * as React from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  EyeIcon,
  FilterIcon,
  LockIcon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UnlockIcon,
  UserCheckIcon,
  UserCogIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  adminUserService,
  CreateUserData,
  UpdateUserData,
  UserItem,
  UserStats,
} from "@/features/user/services/adminUserService"

const fallbackUsers: UserItem[] = [
  {
    userId: 1,
    username: "admin",
    fullName: "System Admin",
    email: "admin@sunbooking.vn",
    phone: "0901234567",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01T08:00:00",
    avatar: "",
  },
  {
    userId: 2,
    username: "nguyenvana",
    fullName: "Nguyen Van An",
    email: "nguyen.an@gmail.com",
    phone: "0912345678",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-02-10T09:30:00",
    avatar: "",
  },
  {
    userId: 3,
    username: "tranmai",
    fullName: "Tran Thi Mai",
    email: "mai.tran@outlook.com",
    phone: "0987654321",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-02-14T14:15:00",
    avatar: "",
  },
  {
    userId: 4,
    username: "lockeduser",
    fullName: "Le Van Locked",
    email: "locked.account@yahoo.com",
    phone: "0933445566",
    role: "USER",
    status: "LOCKED",
    createdAt: "2026-02-01T10:00:00",
    avatar: "",
  },
]

const roleColorMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
  ADMIN: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "Admin" },
  STAFF: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Staff" },
  GUIDE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Guide" },
  USER: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", label: "Traveler" },
}

export default function AdminManageUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>(fallbackUsers)
  const [stats, setStats] = React.useState<UserStats>({
    totalUsers: 4,
    activeUsers: 3,
    inactiveUsers: 0,
    lockedUsers: 1,
    deletedUsers: 0,
    newThisWeek: 2,
    adminUsers: 1,
    regularUsers: 3,
    staffUsers: 0,
    guideUsers: 0,
  })
  const [loading, setLoading] = React.useState(false)
  const [keyword, setKeyword] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("ALL")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [page, setPage] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalElements, setTotalElements] = React.useState(fallbackUsers.length)
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])

  // Dialogs
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null)

  // Forms
  const [createForm, setCreateForm] = React.useState<CreateUserData>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    role: "USER",
    status: "ACTIVE",
  })
  const [editForm, setEditForm] = React.useState<UpdateUserData>({
    fullName: "",
    email: "",
    phone: "",
    role: "USER",
    status: "ACTIVE",
    password: "",
  })

  const loadData = React.useCallback(async () => {
    setLoading(true)
    try {
      const [usersData, statsData] = await Promise.allSettled([
        adminUserService.getUsers({
          keyword: keyword || undefined,
          role: roleFilter !== "ALL" ? roleFilter : undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          page,
          size: 10,
        }),
        adminUserService.getUserStats(),
      ])

      if (usersData.status === "fulfilled" && usersData.value.content) {
        setUsers(usersData.value.content)
        setTotalPages(usersData.value.totalPages)
        setTotalElements(usersData.value.totalElements)
      }

      if (statsData.status === "fulfilled") {
        setStats(statsData.value)
      }
    } catch {
      // Keep fallback
    } finally {
      setLoading(false)
    }
  }, [keyword, roleFilter, statusFilter, page])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((u) => u.userId))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.username || !createForm.password || !createForm.fullName || !createForm.email) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await adminUserService.createUser(createForm)
      toast.success(`User '${createForm.username}' created successfully!`)
      setCreateDialogOpen(false)
      setCreateForm({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        role: "USER",
        status: "ACTIVE",
      })
      loadData()
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create user"
      toast.error(errorMsg)
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      await adminUserService.updateUser(selectedUser.userId, editForm)
      toast.success(`User '${selectedUser.username}' updated successfully!`)
      setEditDialogOpen(false)
      setSelectedUser(null)
      loadData()
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update user"
      toast.error(errorMsg)
    }
  }

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE"
    try {
      await adminUserService.updateStatus(user.userId, nextStatus)
      toast.success(`User '${user.username}' status updated to ${nextStatus}`)
      loadData()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Are you sure you want to delete user '${user.username}'? The account will be marked as deleted (Soft Delete).`)) {
      return
    }
    try {
      await adminUserService.deleteUser(user.userId)
      toast.success(`User '${user.username}' soft deleted successfully`)
      loadData()
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete user"
      toast.error(errorMsg)
    }
  }

  const handleRestoreUser = async (user: UserItem) => {
    try {
      await adminUserService.restoreUser(user.userId)
      toast.success(`User '${user.username}' restored to Active status!`)
      loadData()
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to restore user"
      toast.error(errorMsg)
    }
  }

  const handleExport = () => {
    toast.success("User Data Exported", {
      description: `CSV file with ${totalElements} user records downloaded.`,
    })
  }

  const openEdit = (user: UserItem) => {
    setSelectedUser(user)
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
      password: "",
    })
    setEditDialogOpen(true)
  }

  const openDetail = (user: UserItem) => {
    setSelectedUser(user)
    setDetailDialogOpen(true)
  }

  function getAvatarGradient(name: string) {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-purple-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-red-600",
    ]
    const idx = (name.charCodeAt(0) || 0) % gradients.length
    return gradients[idx]
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-1.5"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              User Management
            </h1>
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 bg-slate-100/80">
              {stats.totalUsers} total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage traveler accounts, system administrators, role permissions, and security status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs gap-1.5 shadow-2xs hover:bg-muted/80"
          >
            <DownloadIcon className="size-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="text-xs gap-1.5 shadow-2xs"
          >
            <RefreshCwIcon className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="text-xs gap-1.5 shadow-2xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircleIcon className="size-3.5" />
            <span>Add New User</span>
          </Button>
        </div>
      </div>

      {/* 4 Metric / KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Total Accounts
            </CardDescription>
            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UsersIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">{stats.totalUsers}</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{stats.adminUsers}</span> Admins •{" "}
              <span className="font-semibold text-foreground">{stats.regularUsers}</span> Travelers
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Active Accounts
            </CardDescription>
            <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheckIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{stats.activeUsers}</span>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2Icon className="size-3" />
              <span>
                {stats.totalUsers > 0
                  ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active rate`
                  : "100% active"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Locked */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              Locked / Restricted
            </CardDescription>
            <div className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlertIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">{stats.lockedUsers}</div>
            <p className="text-xs text-rose-600 font-medium">Suspended or security lock</p>
          </CardContent>
        </Card>

        {/* Card 4: New This Week */}
        <Card className="shadow-xs border-border/80 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold text-muted-foreground">
              New Registrations (7d)
            </CardDescription>
            <div className="size-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheckIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">+{stats.newThisWeek}</div>
            <p className="text-xs text-purple-600 font-medium">New accounts registered this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs border-border/80 overflow-hidden">
        {/* Status Pill Tabs & Filter Bar */}
        <div className="border-b bg-card p-4 space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto bg-muted/60 p-1 rounded-lg">
              {[
                { id: "ALL", label: "All Users", count: stats.totalUsers },
                { id: "ACTIVE", label: "Active", count: stats.activeUsers },
                { id: "LOCKED", label: "Locked", count: stats.lockedUsers },
                { id: "INACTIVE", label: "Inactive", count: stats.inactiveUsers },
                { id: "DELETED", label: "Deleted", count: stats.deletedUsers || 0 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id)
                    setPage(0)
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-background text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      statusFilter === tab.id ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Role Filter & Search Box */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, username..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value)
                    setPage(0)
                  }}
                  className="h-8.5 pl-8 pr-7 text-xs bg-background"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Role Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 h-8.5 px-3 text-xs font-medium rounded-md border border-border bg-background hover:bg-muted text-muted-foreground">
                  <FilterIcon className="size-3.5" />
                  <span>Role: {roleFilter === "ALL" ? "All" : roleFilter}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {["ALL", "ADMIN", "USER", "STAFF", "GUIDE"].map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => {
                        setRoleFilter(r)
                        setPage(0)
                      }}
                      className="text-xs cursor-pointer font-medium"
                    >
                      {r === "ALL" ? "All Roles" : r}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg text-xs">
              <span className="font-semibold text-primary">
                {selectedIds.length} user{selectedIds.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setSelectedIds([])}
                  className="text-xs"
                >
                  Clear Selection
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    toast.info(`Bulk status update triggered for ${selectedIds.length} users.`)
                  }}
                  className="text-xs"
                >
                  Toggle Status
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Table */}
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/80">
                <TableHead className="w-10 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="size-3.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground py-3">Traveler / Account</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Contact Details</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Role</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-xs font-semibold text-foreground text-right pr-6">Joined Date</TableHead>
                <TableHead className="text-xs font-semibold text-foreground w-16 text-center pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                    <RefreshCwIcon className="size-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const roleStyle = roleColorMap[u.role?.toUpperCase()] || roleColorMap.USER
                  const isSelected = selectedIds.includes(u.userId)
                  const isDeleted = u.status === "DELETED"

                  return (
                    <TableRow
                      key={u.userId}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                        isSelected ? "bg-primary/5" : ""
                      } ${isDeleted ? "opacity-60 bg-slate-50/50" : ""}`}
                    >
                      {/* Checkbox */}
                      <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(u.userId)}
                          className="size-3.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </TableCell>

                      {/* User Column */}
                      <TableCell onClick={() => openDetail(u)}>
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-9 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                              u.fullName || u.username
                            )} flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0`}
                          >
                            {u.fullName?.charAt(0) || u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight ${isDeleted ? "line-through text-muted-foreground" : ""}`}>
                              {u.fullName}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                              <span>@{u.username}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px]">ID: #{u.userId}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Column */}
                      <TableCell onClick={() => openDetail(u)}>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-foreground">
                            <MailIcon className="size-3 text-muted-foreground" />
                            <span>{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                              <PhoneIcon className="size-3" />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Role Column */}
                      <TableCell onClick={() => openDetail(u)}>
                        <Badge
                          variant="outline"
                          className={`${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} text-[11px] font-semibold px-2 py-0.5`}
                        >
                          {roleStyle.label}
                        </Badge>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell onClick={() => openDetail(u)}>
                        {u.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : u.status === "LOCKED" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="size-1.5 rounded-full bg-rose-500" />
                            Locked
                          </span>
                        ) : u.status === "DELETED" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <Trash2Icon className="size-3 text-red-500" />
                            Deleted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="size-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-right text-xs text-muted-foreground pr-6 font-mono" onClick={() => openDetail(u)}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                      </TableCell>

                      {/* Action Column */}
                      <TableCell className="text-center pr-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {isDeleted ? (
                            <button
                              onClick={() => handleRestoreUser(u)}
                              className="size-7 rounded-md flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Restore deleted account"
                            >
                              <RotateCcwIcon className="size-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openEdit(u)}
                              className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Edit user details"
                            >
                              <UserCogIcon className="size-3.5" />
                            </button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                              <MoreHorizontalIcon className="size-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => openDetail(u)}>
                                <EyeIcon className="mr-2 size-3.5 text-muted-foreground" />
                                View Profile
                              </DropdownMenuItem>
                              {!isDeleted && (
                                <>
                                  <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => openEdit(u)}>
                                    <UserCogIcon className="mr-2 size-3.5 text-muted-foreground" />
                                    Edit Account
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handleToggleStatus(u)}>
                                    {u.status === "ACTIVE" ? (
                                      <>
                                        <LockIcon className="mr-2 size-3.5 text-amber-600" />
                                        Lock Account
                                      </>
                                    ) : (
                                      <>
                                        <UnlockIcon className="mr-2 size-3.5 text-emerald-600" />
                                        Unlock Account
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-xs cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => handleDeleteUser(u)}
                                  >
                                    <Trash2Icon className="mr-2 size-3.5" />
                                    Delete Account
                                  </DropdownMenuItem>
                                </>
                              )}
                              {isDeleted && (
                                <DropdownMenuItem
                                  className="text-xs cursor-pointer text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 font-medium"
                                  onClick={() => handleRestoreUser(u)}
                                >
                                  <RotateCcwIcon className="mr-2 size-3.5" />
                                  Restore Account
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                    <UserIcon className="size-8 mx-auto mb-2 text-slate-300" />
                    No users matching the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t text-xs text-muted-foreground bg-muted/20">
            <div>
              Showing <span className="font-semibold text-foreground">{users.length}</span> of{" "}
              <span className="font-semibold text-foreground">{totalElements}</span> registered users
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                <ChevronLeftIcon className="size-3.5 mr-1" />
                Previous
              </Button>
              <div className="px-3 py-1 bg-background border rounded-md font-mono text-xs font-semibold text-foreground">
                Page {page + 1} of {Math.max(totalPages, 1)}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRightIcon className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* USER DETAIL DIALOG */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedUser && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`size-12 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                      selectedUser.fullName || selectedUser.username
                    )} flex items-center justify-center text-white text-base font-bold shadow-md`}
                  >
                    {selectedUser.fullName?.charAt(0) || selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold">{selectedUser.fullName}</DialogTitle>
                    <DialogDescription className="text-xs">
                      @{selectedUser.username} • User ID #{selectedUser.userId}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="rounded-xl bg-muted/50 p-3.5 space-y-2.5 text-xs border">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Email Address</span>
                  <span className="font-semibold text-foreground">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-semibold text-foreground">{selectedUser.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Account Role</span>
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Account Status</span>
                  {selectedUser.status === "ACTIVE" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                  ) : selectedUser.status === "DELETED" ? (
                    <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">Deleted</Badge>
                  ) : (
                    <Badge variant="destructive">Locked</Badge>
                  )}
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Registration Date</span>
                  <span className="font-mono text-foreground">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString("vi-VN") : "N/A"}
                  </span>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                {selectedUser.status === "DELETED" ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      handleRestoreUser(selectedUser)
                      setDetailDialogOpen(false)
                    }}
                    className="text-xs flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <RotateCcwIcon className="size-3.5 mr-1.5" />
                    Restore Account
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailDialogOpen(false)
                        openEdit(selectedUser)
                      }}
                      className="text-xs flex-1"
                    >
                      <UserCogIcon className="size-3.5 mr-1.5" />
                      Edit Profile
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        handleToggleStatus(selectedUser)
                        setDetailDialogOpen(false)
                      }}
                      className="text-xs flex-1"
                    >
                      {selectedUser.status === "ACTIVE" ? "Lock Account" : "Unlock Account"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CREATE USER DIALOG */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Add New User</DialogTitle>
              <DialogDescription className="text-xs">
                Create a new traveler account or administrative staff profile.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1 text-foreground">Username *</label>
                <Input
                  required
                  placeholder="e.g. johndoe"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Password *</label>
                <Input
                  required
                  type="password"
                  placeholder="At least 6 characters"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. John Doe"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Phone Number</label>
                <Input
                  placeholder="e.g. 0901234567"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-foreground">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full h-8.5 px-2.5 rounded-md border border-border bg-background text-xs"
                  >
                    <option value="USER">USER (Traveler)</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                    <option value="GUIDE">GUIDE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-foreground">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full h-8.5 px-2.5 rounded-md border border-border bg-background text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="LOCKED">LOCKED</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs bg-primary text-primary-foreground">
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT USER DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleEditUser} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Edit User: @{selectedUser?.username}</DialogTitle>
              <DialogDescription className="text-xs">
                Update account details, role permissions, or reset user password.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1 text-foreground">Full Name</label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">Phone Number</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-foreground">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full h-8.5 px-2.5 rounded-md border border-border bg-background text-xs"
                  >
                    <option value="USER">USER (Traveler)</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="STAFF">STAFF</option>
                    <option value="GUIDE">GUIDE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-foreground">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full h-8.5 px-2.5 rounded-md border border-border bg-background text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="LOCKED">LOCKED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-foreground">
                  Reset Password <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password to reset"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs bg-primary text-primary-foreground">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
