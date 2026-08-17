import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — PrivPDF" },
      { name: "description", content: "Common questions about PrivPDF's privacy-first PDF tools." },
      { property: "og:title", content: "FAQ — PrivPDF" },
      { property: "og:description", content: "Common questions about PrivPDF's privacy-first PDF tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Frequently asked questions" description="Answers about PrivPDF tools, privacy and pricing will be published here." />;
}
