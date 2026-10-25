import { LogOut } from "lucide-react";
import { displayName, useAuth } from "@/auth/auth-context";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

// Placeholder until the layout and bills features are built
export default function DashboardPage() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-svh">
      <header className="border-b border-border bg-card">
        <Container className="flex h-16 items-center justify-between">
          <Logo />
          <Button variant="ghost" size="lg" onClick={signOut}>
            <LogOut /> Log out
          </Button>
        </Container>
      </header>
      <Container className="py-12">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {user.role === "ADMIN" ? "Admin" : "Dashboard"}
        </p>
        <h1 className="mt-3 font-wide text-4xl font-black tracking-tight">Hi, {displayName(user)}</h1>
        <p className="mt-3 max-w-md text-muted-foreground">Your bills and purchases will show here.</p>
      </Container>
    </div>
  );
}
