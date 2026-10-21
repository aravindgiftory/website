import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogueProductCard } from "@/components/site/CatalogueProductCard";
import { CTASection } from "@/components/site/CTASection";
import { BRAND } from "@/data/catalog";
import { breadcrumbScript } from "@/lib/seo";
import { catalogueTitle, pageSrc } from "@/lib/occasion-products";
import { REAL_COLLECTIONS, collectionCover, collectionProducts } from "@/lib/real-collections";

const PAGE_SIZE = 24;

export const Route = createFileRoute("/collections/")({
  validateSearch: (search: Record<string, unknown>): { collection?: string } =>
    typeof search["collection"] === "string" ? { collection: search["collection"] } : {},
  head: () => ({
    meta: [
      { title: "Gift Collections for Weddings, Festivals & Corporate | Aravind Giftory" },
      {
        name: "description",
        content:
          "Browse Aravind Giftory collections — traditional brass, Pichwai, pooja, dry fruit gifts, kitchen storage, tea & coffee, dining, lighting, home decor and corporate gifts.",
      },
      { property: "og:title", content: "Gifting Collections | Aravind Giftory" },
      {
        property: "og:description",
        content: "Explore curated gifting collections for every occasion.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/collections` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/collections` }],
    scripts: [
      breadcrumbScript([
        { name: "Home", path: "/" },
        { name: "Collections", path: "/collections" },
      ]),
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { collection: requested } = Route.useSearch();
  const [active, setActive] = useState<string>(
    REAL_COLLECTIONS.some((item) => item.slug === requested) ? (requested ?? "all") : "all",
  );
  const [visible, setVisible] = useState(PAGE_SIZE);

  const groups = useMemo(
    () =>
      REAL_COLLECTIONS.map((collection) => {
        const items = collectionProducts(collection);
        return { collection, items, cover: collectionCover(collection.slug) };
      }),
    [],
  );
  const filtered = useMemo(
    () =>
      active === "all"
        ? groups.flatMap((group) => group.items)
        : (groups.find((group) => group.collection.slug === active)?.items ?? []),
    [active, groups],
  );

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <SectionHeading
          as="h1"
          eyebrow="Collections"
          title="The Giftory Collections"
          description="Hampers by budget, corporate gift sets, brass and heritage pieces, drinkware and storage. Every gift here is a real product from our catalogues."
        />
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] px-5 sm:px-8">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {groups.map(({ collection, items, cover }) => (
            <li key={collection.slug}>
              <Link
                to="/collections/$category"
                params={{ category: collection.slug }}
                className="group block w-full text-left"
              >
                <span className="block overflow-hidden border border-border bg-white">
                  {cover && (
                    <img
                      src={cover.image}
                      alt={`${collection.name} gifts`}
                      width={cover.width}
                      height={cover.height}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </span>
                <span className="mt-4 block font-display text-xl leading-snug text-primary">
                  {collection.name}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-gold">
                  {items.length} gifts
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">
                  {collection.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="all-gifts" className="mx-auto mt-32 max-w-[1400px] scroll-mt-28 px-5 sm:px-8">
        <SectionHeading eyebrow="All Gifts" title="Browse the full range" />

        <div
          className="mt-10 flex flex-wrap gap-2 border-y border-border py-5"
          role="group"
          aria-label="Filter by collection"
        >
          {[{ slug: "all", name: "All" }, ...REAL_COLLECTIONS].map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={active === item.slug}
              onClick={() => {
                setActive(item.slug);
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                active === item.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/25 text-primary hover:border-primary"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "gift" : "gifts"}
        </p>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.slice(0, visible).map((product) => (
            <CatalogueProductCard
              key={`${product.key}-${product.code}`}
              product={product}
              pageSrc={pageSrc(product)}
              catalogueTitle={catalogueTitle(product.key)}
            />
          ))}
        </div>

        {visible < filtered.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
              className="rounded-sm border border-primary/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
            >
              Show more gifts
            </button>
          </div>
        )}
      </section>

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}
