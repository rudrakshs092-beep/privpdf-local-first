import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — PrivPDF" },
      {
        name: "description",
        content:
          "How PrivPDF's local-first approach is designed to keep your documents under your control.",
      },
      { property: "og:title", content: "Privacy — PrivPDF" },
      {
        property: "og:description",
        content:
          "How PrivPDF's local-first approach is designed to keep your documents under your control.",
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
      badge="Privacy"
      title="Your files stay on your device"
      description="PrivPDF processes supported PDF tasks directly in your browser. A full privacy policy will be published here."
      sections={[
        {
          title: "Local-first",
          description: "The tools are designed to process supported files in your browser.",
        },
        {
          title: "No server upload",
          description:
            "PrivPDF does not need to upload your working files to a server for these tasks.",
        },
        {
          title: "Your control",
          description: "Choose a tool, select a file from your device and save the result locally.",
        },
      ]}
      secondaryLabel="View PDF tools"
      secondaryTo="/"
      secondaryHash="tools"
    />
  );
}
