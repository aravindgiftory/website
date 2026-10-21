import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogueProductCard } from "@/components/site/CatalogueProductCard";
import { FaqSection } from "@/components/site/Faq";
import { CTASection } from "@/components/site/CTASection";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { getOccasion, BRAND, whatsappLink } from "@/data/catalog";
import { OCCASION_SEO, occasionFaqs } from "@/data/seo-copy";
import { breadcrumbScript, faqScript } from "@/lib/seo";
import {
  catalogueTitle,
  occasionCatalogues,
  occasionProducts,
  pageSrc,
} from "@/lib/occasion-products";

export const Route = createFileRoute("/occasions/$occasion")({
  loader: ({ params }) => {
    const occasion = getOccasion(params.occasion);
    if (!occasion) throw notFound();
    return { occasion };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Occasion unavailable | Aravind Giftory" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { occasion } = loaderData;
    const seo = OCCASION_SEO[occasion.slug];
    const title = `${seo?.title ?? `Gifts for ${occasion.name}`} | Aravind Giftory`;
    const description = seo?.description ?? occasion.description;
    const path = `/occasions/${params.occasion}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${BRAND.siteUrl}${path}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `${BRAND.siteUrl}${path}` }],
      scripts: [
        breadcrumbScript([
          { name: "Home", path: "/" },
          { name: "Occasions", path: "/occasions" },
          { name: occasion.name, path },
        ]),
        faqScript(occasionFaqs(occasion.slug)),
      ],
    };
  },
  component: OccasionPage,
});

function OccasionPage() {
  const { occasion } = Route.useLoaderData();
  const { open } = useLeadDialog();
  const items = occasionProducts(occasion.slug);
  const catalogues = occasionCatalogues(occasion.slug);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <Link
          to="/occasions"
          className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          ← All Occasions
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">{occasion.name}</span>
            </div>
            <h1 className="display-lg mt-5 max-w-xl text-primary">{occasion.tagline}</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {occasion.description}
            </p>
            <button
              type="button"
              onClick={() =>
                open({
                  source: "bulk-quote",
                  title: `${occasion.name} Gifting`,
                  intro: "Share your quantity and budget and we'll suggest a shortlist.",
                  submitLabel: "Get a Quote",
                  occasion:
                    occasion.slug === "pooja-festive"
                      ? "Pooja / Festive"
                      : occasion.slug === "baby-shower"
                        ? "Baby Shower"
                        : occasion.name,
                })
              }
              className="mt-8 rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Find Gifts for This Occasion
            </button>
          </div>
          <div className="overflow-hidden bg-muted">
            <img
              src={occasion.image}
              alt={`${occasion.name} gifting`}
              width={900}
              height={1125}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="From our catalogues"
          title={`Gifts for ${occasion.name}`}
          description="Real products from the Aravind Giftory catalogues. Open View details to see the full catalogue page, or enquire with your quantity and date."
        />
        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <CatalogueProductCard
              key={`${product.key}-${product.code}`}
              product={product}
              pageSrc={pageSrc(product)}
              catalogueTitle={catalogueTitle(product.key)}
            />
          ))}
        </div>
        {catalogues.length > 0 && (
          <p className="mt-12 text-sm text-muted-foreground">
            Browse every page of the full catalogue:{" "}
            {catalogues.map((file, index) => (
              <span key={file.slug}>
                {index > 0 && " · "}
                <Link
                  to="/gifts/$catalogue"
                  params={{ catalogue: file.slug }}
                  className="link-underline text-foreground"
                >
                  {file.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          Prefer to talk it through?{" "}
          <a
            href={whatsappLink(
              `Hi ${BRAND.name}, I'm looking for ${occasion.name} gifts. Quantity: \nBudget: \nEvent date: `,
            )}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-foreground"
          >
            Enquire on WhatsApp
          </a>
          .
        </p>
      </section>

      <FaqSection items={occasionFaqs(occasion.slug)} />

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}
