import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "PrivPDF Tools — Merge, split, compress and organize" },
      { name: "description", content: "Browse the PrivPDF toolset. Local-first PDF utilities without signups, watermarks or limits." },
      { property: "og:title", content: "PrivPDF Tools — Merge, split, compress and organize" },
      { property: "og:description", content: "Browse the PrivPDF toolset. Local-first PDF utilities without signups, watermarks or limits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="PDF Tools" description="All PrivPDF tools in one place. Merge, split, compress and organize PDFs — arriving one by one." />;
}
