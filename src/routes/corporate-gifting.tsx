import { useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { LeadForm } from "@/components/site/LeadForm";
import { productsByOccasion, BRAND, whatsappLink } from "@/data/catalog";
import type { Product } from "@/data/types";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { CATALOGUE_FILES } from "@/data/media";
import { FaqSection } from "@/components/site/Faq";
import { corporateFaqs } from "@/data/seo-copy";
import { breadcrumbScript, faqScript } from "@/lib/seo";
import pageData from "@/data/catalogue-pages.json";

interface CataloguePage {
  n: number;
  src: string;
  w: number;
  h: number;
  codes: string[];
}

type Entry = { kind: "product"; product: Product } | { kind: "set"; page: CataloguePage };

const GIFT_SETS = CATALOGUE_FILES.find((file) => file.slug === "gift-sets");
const GIFT_SET_PAGES = ((pageData as Record<string, CataloguePage[]>)["gift-sets"] ?? []).slice(1);

/** Fixed-seed shuffle, so server and browser render the same order. */
function shuffled<T>(list: T[]): T[] {
  const out = [...list];
  let seed = 2026;
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

export const Route = createFileRoute("/corporate-gifting")({
  head: () => ({
    meta: [
      { title: "Corporate Gifting in Hyderabad | Aravind Giftory" },
      {
        name: "description",
        content:
          "Corporate gift sets, welcome kits and festive hampers in bulk for teams, clients and partners, from Aravind Giftory, Hyderabad. Browse the catalogue and request a corporate quote.",
      },
      { property: "og:title", content: "Corporate Gifting in Hyderabad | Aravind Giftory" },
      {
        property: "og:description",
        content: "Gifts that represent your brand — curated corporate gifting in volume.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/corporate-gifting` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/corporate-gifting` }],
    scripts: [
      breadcrumbScript([
        { name: "Home", path: "/" },
        { name: "Corporate Gifting", path: "/corporate-gifting" },
      ]),
      faqScript(corporateFaqs),
    ],
  }),
  component: CorporatePage,
});

function CorporatePage() {
  const entries = useMemo(
    () =>
      shuffled<Entry>([
        ...productsByOccasion("corporate").map((product) => ({
          kind: "product" as const,
          product,
        })),
        ...GIFT_SET_PAGES.map((page) => ({ kind: "set" as const, page })),
      ]),
    [],
  );
  const { open } = useLeadDialog();

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Corporate</span>
            </div>
            <h1 className="display-xl mt-6 max-w-lg text-primary">
              Gifts That Represent Your Brand.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Corporate gift sets, welcome kits and festive hampers for employees, clients and
              partners, in bulk from Hyderabad.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#corporate-form"
                className="inline-block rounded-sm bg-primary px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
              >
                Request a Bulk Quote
              </a>
              <a
                href={whatsappLink(
                  `Hi ${BRAND.name}, I'd like corporate gifting options. Occasion: \nQuantity: \nBudget: \nDelivery date: `,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-sm border border-primary/25 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>
          <div className="overflow-hidden bg-muted">
            <img
              src="/site/corporate-hero.jpg"
              alt="Four corporate gift sets with notebooks, flasks, pens and leather accessories"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Selected"
          title="Corporate gifting from the catalogue"
          description="Desk pieces, flask sets, pen sets, dry fruit gifting, drinkware and ready-to-give gift sets, all available in volume."
          action={
            GIFT_SETS && (
              <Link
                to="/gifts/$catalogue"
                params={{ catalogue: GIFT_SETS.slug }}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-primary link-underline"
              >
                View gift sets catalogue
              </Link>
            )
          }
        />
        <div className="mt-14 grid grid-flow-dense gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map((entry) =>
            entry.kind === "product" ? (
              <ProductCard key={entry.product.slug} product={entry.product} />
            ) : (
              <article key={`set-${entry.page.n}`} className="flex flex-col sm:col-span-2">
                <img
                  src={entry.page.src}
                  alt={`${GIFT_SETS?.title ?? "Gift Sets"}, page ${entry.page.n}`}
                  width={entry.page.w}
                  height={entry.page.h}
                  loading="lazy"
                  className="w-full border border-border bg-muted object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    open({
                      source: "product-enquiry",
                      title: "Enquire about this gift set",
                      intro: `Page ${entry.page.n} of the ${GIFT_SETS?.title ?? "Gift Sets"}. Add your quantity and event date and we'll send pricing.`,
                      productName: `${GIFT_SETS?.title ?? "Gift Sets"}, page ${entry.page.n}`,
                      submitLabel: "Request pricing",
                    })
                  }
                  className="mt-3 self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary link-underline"
                >
                  Enquire about this set
                </button>
              </article>
            ),
          )}
        </div>
      </section>

      <FaqSection items={corporateFaqs} />

      <section
        id="corporate-form"
        className="mx-auto mt-32 max-w-[1400px] scroll-mt-28 px-5 sm:px-8"
      >
        <div className="grid gap-12 border border-border bg-card p-6 sm:p-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <span className="eyebrow text-gold">Corporate Enquiry</span>
            <h2 className="display-md mt-4 text-primary">Request a Quote</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Share your occasion, gift count and budget. We'll send the corporate catalogue and a
              shortlist that fits.
            </p>
          </div>
          <LeadForm source="corporate" corporate submitLabel="Request a Quote" />
        </div>
      </section>
    </>
  );
}
