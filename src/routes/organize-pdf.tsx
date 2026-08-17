import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/organize-pdf")({
  head: () => ({
    meta: [
      { title: "Organize PDF — PrivPDF" },
      { name: "description", content: "Reorder and clean up PDF pages with PrivPDF's upcoming local-first organizer." },
      { property: "og:title", content: "Organize PDF — PrivPDF" },
      { property: "og:description", content: "Reorder and clean up PDF pages with PrivPDF's upcoming local-first organizer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Organize PDF" description="Reorder, remove and arrange pages inside a document. This tool is being built as a browser-side tool." />;
}
