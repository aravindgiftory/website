import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogueProductCard } from "@/components/site/CatalogueProductCard";
import { ProductCard } from "@/components/site/ProductCard";
import { BRAND, getProduct, whatsappLink } from "@/data/catalog";
import { catalogueTitle, pageSrc } from "@/lib/occasion-products";
import { getProductPage } from "@/lib/product-pages";
import { searchProducts } from "@/lib/search";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search["q"] === "string" ? { q: search["q"].slice(0, 80) } : {},
  head: () => ({
    meta: [
      { title: "Search gifts | Aravind Giftory" },
      // Search results are not pages worth indexing.
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/search` }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const results = searchProducts(q);

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
      <SectionHeading
        as="h1"
        eyebrow="Search"
        title={q.trim() ? `Results for “${q.trim()}”` : "Search our gifts"}
        description="Search by gift name, product code (such as AG-CO-007) or something inside, like “coffee”."
      />
      <form role="search" action="/search" method="get" className="mt-8 flex max-w-xl gap-3">
        <label htmlFor="search-page-input" className="sr-only">
          Search gifts by name or product code
        </label>
        <input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Gift name or code"
          className="min-w-0 flex-1 rounded-sm border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
        >
          Search
        </button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {q.trim().length < 2
          ? "Type at least two characters."
          : `${results.length} ${results.length === 1 ? "gift" : "gifts"} found`}
      </p>

      {q.trim().length >= 2 && results.length === 0 && (
        <div className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
          <p>
            Nothing matches that. Try a shorter word, or just the number part of a code. You can
            also{" "}
            <Link to="/collections" className="link-underline text-foreground">
              browse the collections
            </Link>{" "}
            or{" "}
            <a
              href={whatsappLink(`Hi ${BRAND.name}, I'm looking for: ${q.trim()}`)}
              target="_blank"
              rel="noreferrer"
              className="link-underline text-foreground"
            >
              ask us on WhatsApp
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((item) => {
          if (item.kind === "gift") {
            const product = getProductPage(item.slug);
            return product ? (
              <CatalogueProductCard
                key={`gift-${item.slug}`}
                product={product}
                pageSrc={pageSrc(product)}
                catalogueTitle={catalogueTitle(product.key)}
              />
            ) : null;
          }
          const product = getProduct(item.slug);
          return product ? <ProductCard key={`product-${item.slug}`} product={product} /> : null;
        })}
      </div>
    </section>
  );
}
