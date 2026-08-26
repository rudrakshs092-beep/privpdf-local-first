import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PrivPDF" },
      {
        name: "description",
        content: "PrivPDF builds simple, privacy-first PDF tools for everyday documents.",
      },
      { property: "og:title", content: "About — PrivPDF" },
      {
        property: "og:description",
        content: "PrivPDF builds simple, privacy-first PDF tools for everyday documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PagePlaceholder
      badge="About PrivPDF"
      title="About PrivPDF"
      description="PrivPDF keeps everyday PDF tasks simple, with tools that work directly in your browser."
      sections={[
        {
          title: "Why PrivPDF?",
          description:
            "Get common PDF tasks done without unnecessary account setup or extra steps.",
        },
        {
          title: "Simple by design",
          description:
            "Choose a tool, select your file, set the options you need and download the result.",
        },
        {
          title: "Browser-based processing",
          description: "Supported PDF tasks are processed directly in your browser on your device.",
        },
      ]}
      secondaryLabel="How It Works"
    />
  );
}
