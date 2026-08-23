import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/store/authStore"
import { GlobeIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

export function AdminUserNav() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const displayName = user?.fullName || user?.username || "Admin Manager"
  const displayEmail = user?.email || "admin@sunbooking.vn"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore
    }
    navigate("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background outline-none hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="size-8">
          {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
          <AvatarFallback className="text-xs font-semibold bg-slate-200 text-slate-800">
            {initials || "AD"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {user?.role || "System Admin"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer text-xs"
          >
            <UserIcon className="mr-2 size-3.5 text-muted-foreground" />
            Profile Info
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/admin/revenue")}
            className="cursor-pointer text-xs"
          >
            <SettingsIcon className="mr-2 size-3.5 text-muted-foreground" />
            Financial Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate("/")}
            className="cursor-pointer text-xs"
          >
            <GlobeIcon className="mr-2 size-3.5 text-muted-foreground" />
            View Public Site
            <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOutIcon className="mr-2 size-3.5" />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
