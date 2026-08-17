import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/split-pdf")({
  head: () => ({
    meta: [
      { title: "Split PDF — PrivPDF" },
      { name: "description", content: "Split a PDF into pages or parts with PrivPDF's upcoming local-first split tool." },
      { property: "og:title", content: "Split PDF — PrivPDF" },
      { property: "og:description", content: "Split a PDF into pages or parts with PrivPDF's upcoming local-first split tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Split PDF" description="Extract pages or split a document into separate files. This tool is being built as a browser-side tool." />;
}
