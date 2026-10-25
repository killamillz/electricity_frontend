import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/auth-context";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#how", label: "How it works" },
  { href: "#receipts", label: "Receipts" },
  { href: "#features", label: "Features" },
];

export function SiteHeader() {
  const { status } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled && "bg-ink/85 shadow-[0_1px_0_oklch(1_0_0/0.08)] backdrop-blur-md",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo tone="light" wordmarkClassName="max-[400px]:sr-only" />

        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm text-paper/70 transition-colors hover:text-paper">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <Link to="/dashboard" className={cn(buttonVariants({ size: "lg" }), "bg-volt text-volt-foreground hover:bg-volt/85")}>
              Dashboard <ArrowRight />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "text-paper hover:bg-white/10 hover:text-paper")}
              >
                Log in
              </Link>
              <Link to="/register" className={cn(buttonVariants({ size: "lg" }), "bg-volt text-volt-foreground hover:bg-volt/85")}>
                Get started
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
