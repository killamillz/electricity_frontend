import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Banknote, ChevronRight, Search, UserCheck, Users } from "lucide-react";
import { useAdminUsers, type AdminUser } from "@/api/admin";
import { fullName } from "@/auth/auth-context";
import { MonthlyAmountDialog } from "@/components/admin/MonthlyAmountDialog";
import { EmptyState, QueryError, Skeleton } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "Everyone" },
  { value: "plan", label: "On a plan" },
  { value: "none", label: "No plan" },
] as const;

type Filter = (typeof filters)[number]["value"];

function AmountCell({ user }: { user: AdminUser }) {
  return user.monthlyAmount === null ? (
    <span className="text-muted-foreground">No plan</span>
  ) : (
    <span className="font-mono tabular-nums">{formatNaira(user.monthlyAmount)}</span>
  );
}

function RoleTag({ user }: { user: AdminUser }) {
  if (user.role !== "ADMIN") return null;
  return (
    <span className="rounded-md bg-volt px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-volt-foreground uppercase">
      Admin
    </span>
  );
}

export default function AdminUsersPage() {
  const users = useAdminUsers();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (users.data ?? []).filter((user) => {
      if (filter === "plan" && user.monthlyAmount === null) return false;
      if (filter === "none" && user.monthlyAmount !== null) return false;
      return !term || `${fullName(user)} ${user.email}`.toLowerCase().includes(term);
    });
  }, [users.data, search, filter]);

  const all = users.data ?? [];
  const onPlan = all.filter((u) => u.monthlyAmount !== null);
  const expected = onPlan.reduce((sum, u) => sum + (u.monthlyAmount ?? 0), 0);

  const amountButton = (user: AdminUser) => (
    <Button variant={user.monthlyAmount === null ? "default" : "outline"} size="lg" onClick={() => setEditing(user)}>
      <Banknote />
      {user.monthlyAmount === null ? "Set amount" : "Change"}
    </Button>
  );

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Admin"
        title="People"
        description="Set each person's monthly amount and check their bills. Setting an amount creates this month's bill."
      />

      {users.isError ? (
        <QueryError error={users.error} onRetry={() => void users.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {users.isPending ? (
              [0, 1, 2].map((i) => <Skeleton key={i} className="h-[118px]" />)
            ) : (
              <>
                <StatCard label="People" value={all.length} icon={Users} />
                <StatCard
                  label="On a monthly plan"
                  value={onPlan.length}
                  icon={UserCheck}
                  note={`${all.length - onPlan.length} without a plan`}
                />
                <StatCard label="Expected each month" value={formatNaira(expected)} icon={Banknote} tone="dark" />
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:w-80">
              <label htmlFor="people-search" className="sr-only">
                Search people
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="people-search"
                type="search"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl bg-card pl-9"
              />
            </div>
            <div role="radiogroup" aria-label="Filter people" className="flex gap-1 rounded-xl bg-muted p-1">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={filter === value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none",
                    filter === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {users.isPending ? (
            <Skeleton className="h-72" />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Users}
              title={all.length === 0 ? "No one has signed up yet" : "No one matches"}
              description={
                all.length === 0
                  ? "People appear here once they create an account."
                  : "Try a different name or email, or change the filter."
              }
            />
          ) : (
            <>
              {/* Wide screens: table */}
              <div className="hidden overflow-hidden rounded-2xl bg-card ring-1 ring-border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Person</TableHead>
                      <TableHead className="text-right">Monthly amount</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="pr-5 text-right">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visible.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="pl-5">
                          <Link to={`/admin/users/${user.id}`} className="group flex items-center gap-3">
                            <UserAvatar user={user} />
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 font-medium group-hover:underline">
                                {fullName(user)} <RoleTag user={user} />
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <AmountCell user={user} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="pr-5">
                          <div className="flex justify-end gap-2">
                            {amountButton(user)}
                            <Link
                              to={`/admin/users/${user.id}`}
                              className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium hover:bg-muted"
                            >
                              Bills <ChevronRight className="size-4" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Phones: cards */}
              <ul className="grid gap-3 md:hidden">
                {visible.map((user) => (
                  <li key={user.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
                    <Link to={`/admin/users/${user.id}`} className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="truncate">{fullName(user)}</span> <RoleTag user={user} />
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
                      <span className="text-sm">
                        <span className="block text-xs text-muted-foreground">Monthly amount</span>
                        <AmountCell user={user} />
                      </span>
                      {amountButton(user)}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {editing && (
        <MonthlyAmountDialog user={editing} open onOpenChange={(open) => !open && setEditing(null)} />
      )}
    </div>
  );
}
