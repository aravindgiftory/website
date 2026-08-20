import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { CTASection } from "@/components/site/CTASection";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { getOccasion, productsByOccasion, type OccasionSlug } from "@/data/catalog";

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
    const title = `${loaderData.occasion.name} Gifts | Aravind Giftory`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.occasion.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.occasion.description },
        { property: "og:url", content: `/occasions/${params.occasion}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/occasions/${params.occasion}` }],
    };
  },
  component: OccasionPage,
});

function OccasionPage() {
  const { occasion } = Route.useLoaderData();
  const { open } = useLeadDialog();
  const items = productsByOccasion(occasion.slug as OccasionSlug);

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
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading eyebrow="Suggested" title={`Gifts for ${occasion.name}`} />
        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}
