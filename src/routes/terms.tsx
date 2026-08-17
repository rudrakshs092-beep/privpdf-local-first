import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — PrivPDF" },
      { name: "description", content: "Terms of service for the PrivPDF privacy-first PDF platform." },
      { property: "og:title", content: "Terms — PrivPDF" },
      { property: "og:description", content: "Terms of service for the PrivPDF privacy-first PDF platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Terms" description="The PrivPDF terms of service will be published here." />;
}
