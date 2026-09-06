import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { tools } from "@/lib/site";

const BASE_URL = "https://privpdf.lovable.app";

interface SitemapEntry {
  path: string;
  priority?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/tools", priority: "0.9", changefreq: "weekly" },
          { path: "/about", priority: "0.6", changefreq: "monthly" },
          { path: "/how-it-works", priority: "0.7", changefreq: "monthly" },
          { path: "/privacy", priority: "0.6", changefreq: "monthly" },
          { path: "/faq", priority: "0.7", changefreq: "monthly" },
          { path: "/terms", priority: "0.5", changefreq: "yearly" },
          { path: "/security", priority: "0.6", changefreq: "monthly" },
        ];

        const toolEntries: SitemapEntry[] = tools.map((tool) => ({
          path: tool.to,
          priority: "0.8",
          changefreq: "weekly",
        }));

        const entries = [...staticEntries, ...toolEntries];

        const urls = entries.map((entry) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${entry.path}</loc>`,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
