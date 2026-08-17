import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/rotate-pdf")({
  head: () => ({
    meta: [
      { title: "Rotate PDF — PrivPDF" },
      { name: "description", content: "Rotate PDF pages with PrivPDF's upcoming local-first rotation tool." },
      { property: "og:title", content: "Rotate PDF — PrivPDF" },
      { property: "og:description", content: "Rotate PDF pages with PrivPDF's upcoming local-first rotation tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Rotate PDF" description="Fix page orientation across your document. This tool is being built as a browser-side tool." />;
}
