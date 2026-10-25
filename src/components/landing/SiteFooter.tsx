import { Link } from "react-router";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/layout/Container";
import { APP_NAME } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink py-10 text-paper">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo tone="light" />
        <nav aria-label="Footer" className="flex gap-6 text-sm text-paper/60">
          <Link to="/login" className="hover:text-paper">
            Log in
          </Link>
          <Link to="/register" className="hover:text-paper">
            Create account
          </Link>
        </nav>
        <p className="text-sm text-paper/40">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </Container>
    </footer>
  );
}
