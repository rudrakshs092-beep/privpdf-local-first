import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/pdf-to-image")({
  head: () => ({
    meta: [
      { title: "PDF to Image — PrivPDF" },
      { name: "description", content: "Export PDF pages as images with PrivPDF's upcoming local-first converter." },
      { property: "og:title", content: "PDF to Image — PrivPDF" },
      { property: "og:description", content: "Export PDF pages as images with PrivPDF's upcoming local-first converter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="PDF to Image" description="Export PDF pages as image files. This tool is being built as a browser-side tool." />;
}
