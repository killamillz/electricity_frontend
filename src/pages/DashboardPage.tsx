import { Link } from "react-router";
import { ArrowRight, Users } from "lucide-react";
import { displayName, useAuth } from "@/auth/auth-context";
import { PageHeader } from "@/components/layout/PageHeader";

// Bills and purchases for the logged-in user come in the next feature
export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Overview"
        title={`Hi, ${displayName(user)}`}
        description="Your bills and purchases will show here."
      />

      {user.role === "ADMIN" && (
        <Link
          to="/admin/users"
          className="group flex items-center gap-5 rounded-3xl bg-ink p-6 text-paper transition-transform hover:-translate-y-0.5 sm:p-8"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-volt text-volt-foreground">
            <Users className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-wide text-xl font-extrabold">Manage people</span>
            <span className="mt-1 block text-sm text-paper/60">
              See everyone, set monthly amounts and check their bills.
            </span>
          </span>
          <ArrowRight className="size-5 text-volt transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
