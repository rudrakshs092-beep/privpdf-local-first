import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/image-to-pdf")({
  head: () => ({
    meta: [
      { title: "Image to PDF — PrivPDF" },
      { name: "description", content: "Convert images into a PDF with PrivPDF's upcoming local-first converter." },
      { property: "og:title", content: "Image to PDF — PrivPDF" },
      { property: "og:description", content: "Convert images into a PDF with PrivPDF's upcoming local-first converter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Image to PDF" description="Turn JPG or PNG images into a clean PDF. This tool is being built as a browser-side tool." />;
}
