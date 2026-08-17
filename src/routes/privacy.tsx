import { createFileRoute } from "@tanstack/react-router";

import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — PrivPDF" },
      { name: "description", content: "How PrivPDF's local-first approach is designed to keep your documents under your control." },
      { property: "og:title", content: "Privacy — PrivPDF" },
      { property: "og:description", content: "How PrivPDF's local-first approach is designed to keep your documents under your control." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <PagePlaceholder title="Privacy" description="PrivPDF is designed around a local-first approach. A full privacy policy will be published here." />;
}
