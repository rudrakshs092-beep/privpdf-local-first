import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/home/Hero";
import { PrivacySection } from "@/components/home/PrivacySection";
import { ToolGrid } from "@/components/home/ToolGrid";

const title = "PrivPDF — Simple PDF tools that keep files on your device";
const description =
  "Simple PDF tools for everyday files. Your files stay safe on your device with no upload needed.";

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
    <div className="landing-shell">
      <Hero />
      <ToolGrid />
      <PrivacySection />
    </div>
  );
}
