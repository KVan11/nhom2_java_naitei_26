import * as React from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  BellIcon,
  CompassIcon,
  ExternalLinkIcon,
  LayersIcon,
  LayoutDashboardIcon,
  MenuIcon,
  MessageSquareQuoteIcon,
  PercentIcon,
  TicketIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { AdminTeamSwitcher } from "./components/AdminTeamSwitcher";
import { AdminSearch } from "./components/AdminSearch";
import { AdminUserNav } from "./components/AdminUserNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    to: "/admin",
    label: "Overview",
    icon: LayoutDashboardIcon,
    end: true,
  },
  {
    to: "/admin/tours",
    label: "Tours & Places",
    icon: CompassIcon,
  },
  {
    to: "/admin/bookings",
    label: "Booking Requests",
    icon: TicketIcon,
  },
  {
    to: "/admin/users",
    label: "Users & Roles",
    icon: UsersIcon,
  },
  {
    to: "/admin/reviews",
    label: "User Reviews",
    icon: MessageSquareQuoteIcon,
    badge: "12",
  },
  {
    to: "/admin/revenue",
    label: "Revenue & Finance",
    icon: PercentIcon,
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: LayersIcon,
  },
];

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="container-wrapper flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <AdminTeamSwitcher />
            <div className="hidden lg:block h-5 w-px bg-border" />
            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                SUN Booking Tours
              </span>
              <span>/</span>
              <span className="font-medium text-foreground">
                Management Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AdminSearch />

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
              title="Open customer website"
            >
              <ExternalLinkIcon className="size-3.5" />
              <span>Live Site</span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <BellIcon className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-brand ring-2 ring-background" />
            </Button>

            <div className="h-6 w-px bg-border hidden sm:block" />

            <AdminUserNav />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden size-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Secondary Sub Navigation Bar (Desktop) */}
        <div className="hidden md:block border-t border-border/40 bg-background/50">
          <div className="container-wrapper flex h-11 items-center gap-1 overflow-x-auto no-scrollbar">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                      isActive
                        ? "bg-muted text-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "size-3.5 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-0.5 h-4 px-1.5 text-[10px] font-semibold",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-200 text-slate-700",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 shadow-lg space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="outline" className="h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-border">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ExternalLinkIcon className="size-4" />
                <span>Go to Live Website</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6 sm:py-8">
        <div className="container-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-4 text-center text-xs text-muted-foreground">
        <div className="container-wrapper flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 SUN Booking Tours. Admin Operations Platform.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/admin/revenue" className="hover:underline">
              System Status: Operational
            </Link>
            <span>•</span>
            <Link to="/admin/tours" className="hover:underline">
              Documentation
            </Link>
            <span>•</span>
            <Link to="/admin/users" className="hover:underline">
              Security Logs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
