import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { occasions, BRAND } from "@/data/catalog";
import pageData from "@/data/catalogue-pages.json";
import productData from "@/data/catalogue-products.json";
import { CATALOGUE_FILES } from "@/data/media";
import {
  CatalogueProductCard,
  type CatalogueProduct,
} from "@/components/site/CatalogueProductCard";

interface CataloguePage {
  n: number;
  src: string;
}

const PAGES = pageData as Record<string, CataloguePage[]>;
const CATALOGUE_PRODUCTS = productData as CatalogueProduct[];

/** Which real catalogue products suit each occasion: catalogue key, optionally limited to code prefixes. */
const OCCASION_SOURCES: Record<string, Array<{ key: string; prefixes?: string[] }>> = {
  wedding: [
    { key: "gift-hampers-5k-plus-2026" },
    { key: "gift-hampers-2k-3k-2026" },
    { key: "luxury-gifting-2026", prefixes: ["DB", "GS"] },
  ],
  birthday: [
    { key: "gift-hampers-1k-2026" },
    { key: "snacks-munchies-hampers-2026" },
    { key: "gift-hampers-2k-3k-2026" },
  ],
  housewarming: [
    { key: "luxury-gifting-2026", prefixes: ["JR", "BW", "TR", "ST", "FL", "TS", "MG", "LB"] },
  ],
  "pooja-festive": [{ key: "luxury-gifting-2026", prefixes: ["DY", "PL", "UR", "ID", "DN", "KT"] }],
  corporate: [{ key: "corporate-gifting-2026" }],
};

/** Desk, tech and office items read as corporate gifts, so personal occasions skip them. */
const CORPORATE_LOOK =
  /desk|laptop|clock|speaker|earphone|bluetooth|office|stationery|stand|\bled\b|mirror|\bpen\b|diary|notebook|power/i;
const PERSONAL_OCCASIONS = new Set(["wedding", "birthday"]);

const PREVIEW_COUNT = 8;

/** Fixed-seed shuffle, so server and browser render the same order. */
function shuffled<T>(list: T[], seed: number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

const catalogueTitle = (key: string) =>
  CATALOGUE_FILES.find((file) => file.href.endsWith(`/${key}.pdf`))?.title ?? "Catalogue";

const pageSrc = (product: CatalogueProduct) =>
  PAGES[product.key]?.find((page) => page.n === product.n)?.src;

function occasionProducts(slug: string): CatalogueProduct[] {
  const seen = new Set<string>();
  return (OCCASION_SOURCES[slug] ?? [])
    .flatMap(({ key, prefixes }) =>
      CATALOGUE_PRODUCTS.filter(
        (product) =>
          product.key === key && (!prefixes || prefixes.includes(product.code.split("-")[1] ?? "")),
      ),
    )
    .filter((product) => {
      if (seen.has(product.code)) return false;
      seen.add(product.code);
      return !(PERSONAL_OCCASIONS.has(slug) && CORPORATE_LOOK.test(product.name));
    });
}

export const Route = createFileRoute("/occasions/")({
  head: () => ({
    meta: [
      { title: "Gifts by Occasion | Aravind Giftory" },
      {
        name: "description",
        content:
          "Wedding, birthday, housewarming, pooja & festive and corporate gifting — curated collections for every occasion.",
      },
      { property: "og:title", content: "Gifts by Occasion | Aravind Giftory" },
      {
        property: "og:description",
        content: "Every occasion deserves a thoughtful gift. Explore gifting by occasion.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/occasions` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/occasions` }],
  }),
  component: OccasionsPage,
});

function OccasionsPage() {
  const groups = useMemo(
    () =>
      occasions
        .filter((occasion) => occasion.slug !== "baby-shower")
        .map((occasion, index) => {
          const all = occasionProducts(occasion.slug);
          return {
            occasion,
            total: all.length,
            preview: shuffled(all, 2026 + index).slice(0, PREVIEW_COUNT),
          };
        }),
    [],
  );

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <SectionHeading
          eyebrow="Occasions"
          title="Every Occasion Deserves a Thoughtful Gift."
          description="Start with the moment you're celebrating. Pick an occasion to see the gifts we've curated for it."
        />
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {groups.map(({ occasion, total }) => (
            <li key={occasion.slug}>
              <a href={`#${occasion.slug}`} className="group block">
                <span className="block overflow-hidden rounded-sm border border-border bg-muted">
                  <img
                    src={occasion.image}
                    alt=""
                    width={600}
                    height={750}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </span>
                <span className="mt-3 block font-display text-lg leading-tight text-primary">
                  {occasion.name}
                </span>
                <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Explore
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-24 space-y-24">
        {groups.map(({ occasion, total, preview }, index) => (
          <section
            key={occasion.slug}
            id={occasion.slug}
            className="mx-auto max-w-[1400px] scroll-mt-28 px-5 sm:px-8"
          >
            <div className="flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow text-gold">
                  {String(index + 1).padStart(2, "0")} — {occasion.name}
                </span>
                <h2 className="display-md mt-4 text-primary">{occasion.tagline}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {occasion.description}
                </p>
              </div>
              <Link
                to="/occasions/$occasion"
                params={{ occasion: occasion.slug }}
                className="link-underline shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
              >
                View all {occasion.name} gifts
              </Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {preview.map((product) => (
                <CatalogueProductCard
                  key={`${product.key}-${product.code}`}
                  product={product}
                  pageSrc={pageSrc(product)}
                  catalogueTitle={catalogueTitle(product.key)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}
