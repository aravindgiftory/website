import { useMemo } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogueProductCard } from "@/components/site/CatalogueProductCard";
import { FaqSection } from "@/components/site/Faq";
import { CatalogueOffers, ProofSection, WhatsAppBuilder } from "@/components/site/LeadTools";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { BRAND, whatsappLink } from "@/data/catalog";
import { AUDIENCES, getAudience } from "@/data/audiences";
import { breadcrumbScript, faqScript } from "@/lib/seo";
import { catalogueTitle, pageSrc, shuffled } from "@/lib/occasion-products";
import { REAL_COLLECTIONS, collectionCover, collectionProducts } from "@/lib/real-collections";

export const Route = createFileRoute("/for/$audience")({
  loader: ({ params }) => {
    const audience = getAudience(params.audience);
    if (!audience) throw notFound();
    return { audience };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Page unavailable | Aravind Giftory" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { audience } = loaderData;
    const path = `/for/${params.audience}`;
    const title = `${audience.title} | Aravind Giftory`;
    const first = REAL_COLLECTIONS.find((item) => item.slug === audience.collections[0]);
    return {
      meta: [
        { title },
        { name: "description", content: audience.description },
        { property: "og:title", content: title },
        { property: "og:description", content: audience.description },
        { property: "og:url", content: `${BRAND.siteUrl}${path}` },
        { property: "og:type", content: "website" },
        ...(first
          ? [
              {
                property: "og:image",
                content: `${BRAND.siteUrl}${collectionCover(first.slug).image}`,
              },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `${BRAND.siteUrl}${path}` }],
      scripts: [
        breadcrumbScript([
          { name: "Home", path: "/" },
          { name: audience.name, path },
        ]),
        faqScript(audience.faqs),
      ],
    };
  },
  component: AudiencePage,
});

function AudiencePage() {
  const { audience } = Route.useLoaderData();
  const { open } = useLeadDialog();

  const collections = audience.collections.flatMap((slug) => {
    const collection = REAL_COLLECTIONS.find((item) => item.slug === slug);
    return collection ? [collection] : [];
  });
  const starters = useMemo(
    () =>
      collections.flatMap((collection, index) =>
        shuffled(collectionProducts(collection), 11 + index).slice(0, 2),
      ),
    [collections],
  );
  const others = AUDIENCES.filter((item) => item.slug !== audience.slug);

  const quote = () =>
    open({
      source: "bulk-quote",
      title: `Quote for ${audience.name.toLowerCase()}`,
      intro: "Share what you know and we'll suggest a shortlist.",
      submitLabel: "Request a Bulk Quote",
      occasion: audience.occasion,
      corporate: audience.corporate,
    });

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Link to="/" className="link-underline">
            Home
          </Link>{" "}
          / <span className="text-foreground">{audience.name}</span>
        </nav>
        <div className="mt-8 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">For {audience.name.toLowerCase()}</span>
          </div>
          <h1 className="display-xl mt-6 text-primary">{audience.h1}</h1>
          {audience.intro.map((paragraph) => (
            <p key={paragraph} className="mt-5 text-base leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={quote}
              className="rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Request a Bulk Quote
            </button>
            <a
              href={whatsappLink(
                `Hi ${BRAND.name}, I'm ${audience.persona} and I'm looking for gifts. Occasion: ${audience.occasion}\nQuantity: \nBudget per gift: \nDelivery date: `,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-primary/25 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading eyebrow="What matters" title="Built around how you buy" />
        <ul className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {audience.needs.map((need, index) => (
            <li key={need.title} className="border-t border-border pt-6">
              <span className="eyebrow text-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-2xl text-primary">{need.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{need.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Start here"
          title="Gifts to shortlist first"
          description="Real products from our catalogues. Open a gift for its full contents."
        />
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {starters.map((product) => (
            <CatalogueProductCard
              key={`${product.key}-${product.code}`}
              product={product}
              pageSrc={pageSrc(product)}
              catalogueTitle={catalogueTitle(product.key)}
            />
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-3">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link
                to="/collections/$category"
                params={{ category: collection.slug }}
                className="block rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary"
              >
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CatalogueOffers slugs={audience.catalogues} />

      <section className="mx-auto mt-24 grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Ordering" title="What to send us" />
          <ul className="mt-8 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
            {audience.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Orders start at {BRAND.minQuantity} pieces, from ₹{BRAND.startingPrice} per gift, packed
            and delivered from {BRAND.city}. We confirm pricing for your quantity before you commit.
          </p>
        </div>
        <WhatsAppBuilder persona={audience.persona} defaultOccasion={audience.occasion} />
      </section>

      <ProofSection />

      <FaqSection items={audience.faqs} />

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <h2 className="font-display text-2xl text-primary">Planning for someone else?</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                to="/for/$audience"
                params={{ audience: item.slug }}
                className="block rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
