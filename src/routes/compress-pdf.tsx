import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/compress-pdf")({
  head: () => ({
    meta: [
      { title: "Compress PDF — PrivPDF" },
      { name: "description", content: "Shrink PDF file size with PrivPDF's upcoming local-first compression tool." },
      { property: "og:title", content: "Compress PDF — PrivPDF" },
      { property: "og:description", content: "Shrink PDF file size with PrivPDF's upcoming local-first compression tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Compress PDF" description="Reduce PDF file size for easier sharing. This tool is being built as a browser-side tool." />;
}
