import { useMemo, useState } from "react";
import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogueProductCard } from "@/components/site/CatalogueProductCard";
import { FaqSection } from "@/components/site/Faq";
import { CTASection } from "@/components/site/CTASection";
import { BRAND } from "@/data/catalog";
import { COLLECTION_SEO, occasionFaqs } from "@/data/seo-copy";
import { breadcrumbScript, faqScript } from "@/lib/seo";
import { catalogueTitle, pageSrc } from "@/lib/occasion-products";
import { REAL_COLLECTIONS, collectionCover, collectionProducts } from "@/lib/real-collections";

/** Collection pages from the earlier placeholder catalogue. They permanently redirect. */
const RETIRED = new Set([
  "traditional",
  "pichwai",
  "pooja",
  "dry-fruit-gifts",
  "kitchen-storage",
  "tea-coffee",
  "dining",
  "lighting",
  "home-decor",
  "corporate-gifts",
]);

const PAGE_SIZE = 24;

export const Route = createFileRoute("/collections/$category")({
  loader: ({ params }) => {
    const collection = REAL_COLLECTIONS.find((item) => item.slug === params.category);
    if (!collection) {
      if (RETIRED.has(params.category)) {
        throw redirect({ to: "/collections", statusCode: 301 });
      }
      throw notFound();
    }
    return { collection };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Collection unavailable | Aravind Giftory" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { collection } = loaderData;
    const seo = COLLECTION_SEO[collection.slug];
    const title = `${seo?.title ?? collection.name} | Aravind Giftory`;
    const description = seo?.description ?? collection.description;
    const path = `/collections/${params.category}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${BRAND.siteUrl}${path}` },
        { property: "og:type", content: "website" },
        {
          property: "og:image",
          content: `${BRAND.siteUrl}${collectionCover(collection.slug).image}`,
        },
      ],
      links: [{ rel: "canonical", href: `${BRAND.siteUrl}${path}` }],
      scripts: [
        breadcrumbScript([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: collection.name, path },
        ]),
        faqScript(occasionFaqs("")),
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { collection } = Route.useLoaderData();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const items = useMemo(() => collectionProducts(collection), [collection]);
  const seo = COLLECTION_SEO[collection.slug];
  const cover = collectionCover(collection.slug);
  const others = REAL_COLLECTIONS.filter((item) => item.slug !== collection.slug);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Link to="/collections" className="link-underline">
            Collections
          </Link>{" "}
          / <span className="text-foreground">{collection.name}</span>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            as="h1"
            eyebrow="Collection"
            title={collection.name}
            description={seo?.intro ?? collection.description}
          />
          <div className="overflow-hidden border border-border bg-white">
            <img
              src={cover.image}
              alt={`${collection.name} from Aravind Giftory`}
              width={cover.width}
              height={cover.height}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {items.length} gifts
        </p>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, visible).map((product) => (
            <CatalogueProductCard
              key={`${product.key}-${product.code}`}
              product={product}
              pageSrc={pageSrc(product)}
              catalogueTitle={catalogueTitle(product.key)}
            />
          ))}
        </div>
        {visible < items.length && (
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

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <h2 className="font-display text-2xl text-primary">Other collections</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                to="/collections/$category"
                params={{ category: item.slug }}
                className="block rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FaqSection items={occasionFaqs("").slice(0, 4)} />

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}
