import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const SITEMAP_URL = "https://privpdf.lovable.app/sitemap.xml";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          `Sitemap: ${SITEMAP_URL}`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
