import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/merge-pdf")({
  head: () => ({
    meta: [
      { title: "Merge PDF — PrivPDF" },
      { name: "description", content: "Combine several PDFs into one document with PrivPDF's upcoming local-first merge tool." },
      { property: "og:title", content: "Merge PDF — PrivPDF" },
      { property: "og:description", content: "Combine several PDFs into one document with PrivPDF's upcoming local-first merge tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Merge PDF" description="Combine multiple PDF files into a single document. This tool is being built as a browser-side tool." />;
}
