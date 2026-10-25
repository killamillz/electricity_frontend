import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFoundPage() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-ink px-4 text-paper">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="relative text-center">
        <p className="font-wide text-[clamp(6rem,24vw,14rem)] leading-none font-black text-volt">404</p>
        <h1 className="mt-2 font-wide text-2xl font-extrabold">This page has no power</h1>
        <p className="mt-2 text-paper/60">The link may be old, or the page may have moved.</p>
        <Link to="/" className={cn(buttonVariants({ size: "xl" }), "mt-8 bg-volt text-volt-foreground hover:bg-volt/85")}>
          <ArrowLeft /> Back home
        </Link>
      </div>
    </main>
  );
}
