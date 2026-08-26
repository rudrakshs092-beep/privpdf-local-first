import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "PrivPDF — Simple PDF tools" },
      {
        name: "description",
        content: "Simple PDF tools for everyday files, available directly in your browser.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <Navigate to="/" hash="tools" replace />;
}
