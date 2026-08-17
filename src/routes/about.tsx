import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PrivPDF" },
      { name: "description", content: "PrivPDF builds simple, privacy-first PDF tools for everyday documents." },
      { property: "og:title", content: "About — PrivPDF" },
      { property: "og:description", content: "PrivPDF builds simple, privacy-first PDF tools for everyday documents." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="About PrivPDF" description="PrivPDF is a privacy-first PDF utility platform: simple tools without unnecessary uploads, sign-ups, watermarks or limits." />;
}
