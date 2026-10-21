import { createFileRoute } from "@tanstack/react-router";
import { BRAND, occasions, products } from "@/data/catalog";
import { CATALOGUE_FILES } from "@/data/media";
import { REAL_COLLECTIONS } from "@/lib/real-collections";
import { PRODUCT_PAGES, isSubstantial } from "@/lib/product-pages";

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

/** Only pages meant for search: real products, substantial gift pages, and the main hubs. */
const indexableProducts = products.filter(
  (product) => typeof product.image === "string" && product.image.startsWith("/products/"),
);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          ...STATIC_PATHS,
          ...REAL_COLLECTIONS.map((c) => `/collections/${c.slug}`),
          ...occasions.map((o) => `/occasions/${o.slug}`),
          ...CATALOGUE_FILES.map((c) => `/gifts/${c.slug}`),
          ...PRODUCT_PAGES.filter(isSubstantial).map((p) => `/gift/${p.slug}`),
          ...indexableProducts.map((p) => `/products/${p.slug}`),
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
