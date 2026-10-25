import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PaymentSplit } from "@/components/landing/PaymentSplit";
import { ReceiptScan } from "@/components/landing/ReceiptScan";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Ticker } from "@/components/landing/Ticker";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <ReceiptScan />
        <PaymentSplit />
        <FeatureGrid />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
