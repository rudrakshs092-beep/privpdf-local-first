import { createFileRoute } from "@tanstack/react-router";

import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PrivacySection } from "@/components/home/PrivacySection";
import { ToolGrid } from "@/components/home/ToolGrid";

const title = "PrivPDF — Simple PDF tools that keep files on your device";
const description =
  "Merge, split, compress and manage PDF files directly in your browser. No upload, no account, no database.";

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
    <div>
      <Hero />
      <ToolGrid />
      <HowItWorks />
      <PrivacySection />
      <FaqSection />
    </div>
  );
}
