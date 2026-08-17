import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — PrivPDF" },
      { name: "description", content: "Three simple steps: choose a tool, process your PDF and download the result." },
      { property: "og:title", content: "How It Works — PrivPDF" },
      { property: "og:description", content: "Three simple steps: choose a tool, process your PDF and download the result." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="How PrivPDF works" description="Choose a tool, process your PDF, download the result. Where technically possible, processing happens directly in your browser." />;
}
