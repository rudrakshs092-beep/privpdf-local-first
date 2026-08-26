import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — PrivPDF" },
      {
        name: "description",
        content: "Three simple steps: choose a tool, process your PDF and download the result.",
      },
      { property: "og:title", content: "How It Works — PrivPDF" },
      {
        property: "og:description",
        content: "Three simple steps: choose a tool, process your PDF and download the result.",
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
      badge="How it works"
      title="How PrivPDF works"
      description="Choose a tool, process your PDF and download the result in three simple steps."
      sections={[
        { title: "Choose a tool", description: "Pick the PDF task you need to get done." },
        { title: "Choose your file", description: "Select your PDF from your device." },
        {
          title: "Download your result",
          description: "Finish the task and save the result to your device.",
        },
      ]}
      secondaryLabel="View PDF tools"
      secondaryTo="/"
      secondaryHash="tools"
    />
  );
}
