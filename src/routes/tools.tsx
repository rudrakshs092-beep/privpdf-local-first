import { createFileRoute } from "@tanstack/react-router";

import { ToolGrid } from "@/components/home/ToolGrid";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "PrivPDF Tools — Local-first PDF tools" },
      {
        name: "description",
        content:
          "Browse the PrivPDF toolset. Local-first PDF utilities without signups, watermarks or limits.",
      },
      { property: "og:title", content: "PrivPDF Tools — Local-first PDF tools" },
      {
        property: "og:description",
        content:
          "Browse the PrivPDF toolset. Local-first PDF utilities without signups, watermarks or limits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <ToolGrid />;
}
