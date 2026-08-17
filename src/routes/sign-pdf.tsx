import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/sign-pdf")({
  head: () => ({
    meta: [
      { title: "Sign PDF — PrivPDF" },
      { name: "description", content: "Sign documents with PrivPDF's upcoming local-first signing tool." },
      { property: "og:title", content: "Sign PDF — PrivPDF" },
      { property: "og:description", content: "Sign documents with PrivPDF's upcoming local-first signing tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Sign PDF" description="Add a signature to your document. This tool is being built as a browser-side tool." />;
}
