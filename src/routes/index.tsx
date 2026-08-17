import { createFileRoute } from "@tanstack/react-router";

import { CTASection } from "@/components/home/CTASection";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PrivacySection } from "@/components/home/PrivacySection";
import { ToolGrid } from "@/components/home/ToolGrid";
import { TrustPoints } from "@/components/home/TrustPoints";
import { WhyPrivPDF } from "@/components/home/WhyPrivPDF";

const title = "PrivPDF — Privacy-first PDF tools for everyday documents";
const description =
  "Merge, split, compress and organize PDFs with privacy-first tools. No unnecessary uploads, no signup, no watermarks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustPoints />
      <ToolGrid />
      <WhyPrivPDF />
      <HowItWorks />
      <PrivacySection />
      <CTASection />
    </>
  );
}
