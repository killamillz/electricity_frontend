import { NavLink, Outlet } from "react-router";
import { CalendarRange, LayoutDashboard, LogOut, Receipt, Trophy, Users, type LucideIcon } from "lucide-react";
import { displayName, useAuth } from "@/auth/auth-context";
import { Logo } from "@/components/brand/Logo";
import { RecordPurchaseButton } from "@/components/purchases/RecordPurchaseButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { UserAvatar } from "./UserAvatar";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

const userNav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/bills", label: "Bills", icon: CalendarRange },
  { to: "/purchases", label: "Purchases", icon: Receipt },
];
const adminNav: NavItem[] = [{ to: "/admin/users", label: "People", icon: Users }];

/** Header with navigation for every logged-in page */
export function AppShell() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const nav = user.role === "ADMIN" ? [...userNav, ...adminNav] : userNav;

  const links = nav.map(({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-ink text-paper" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  ));

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <Container className="flex h-16 items-center gap-6">
          <Logo wordmarkClassName="max-sm:sr-only" />
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <RecordPurchaseButton size="lg" className="max-sm:hidden" />
            <div className="flex items-center gap-2.5">
              <UserAvatar user={user} />
              <div className="hidden text-sm leading-tight sm:block">
                <p className="font-medium">{displayName(user)}</p>
                <p className="text-xs text-muted-foreground">{user.role === "ADMIN" ? "Admin" : "Member"}</p>
              </div>
            </div>
            <Button variant="ghost" size="lg" onClick={signOut} aria-label="Log out">
              <LogOut />
              <span className="max-sm:sr-only">Log out</span>
            </Button>
          </div>
        </Container>
        {/* Phones: navigation sits on its own scrollable row */}
        <nav aria-label="Main" className="border-t border-border lg:hidden">
          <Container className="flex gap-1 overflow-x-auto py-2">{links}</Container>
        </nav>
      </header>

      <main>
        <Container className="py-8 sm:py-10">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
