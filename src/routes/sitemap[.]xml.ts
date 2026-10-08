import { createFileRoute } from "@tanstack/react-router";
import { BRAND, collections, occasions, products } from "@/data/catalog";
import { CATALOGUE_FILES } from "@/data/media";

const STATIC_PATHS = [
  "/",
  "/collections",
  "/occasions",
  "/corporate-gifting",
  "/about",
  "/catalogue",
  "/contact",
  "/privacy-policy",
  "/terms",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          ...STATIC_PATHS,
          ...collections.map((c) => `/collections/${c.slug}`),
          ...occasions.map((o) => `/occasions/${o.slug}`),
          ...CATALOGUE_FILES.map((c) => `/gifts/${c.slug}`),
          ...products.map((p) => `/products/${p.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map((p) => `  <url><loc>${BRAND.siteUrl}${p}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
