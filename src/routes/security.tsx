import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — PrivPDF" },
      { name: "description", content: "The security principles behind PrivPDF's local-first PDF tools." },
      { property: "og:title", content: "Security — PrivPDF" },
      { property: "og:description", content: "The security principles behind PrivPDF's local-first PDF tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Security" description="Details about the PrivPDF security approach will be published here." />;
}
