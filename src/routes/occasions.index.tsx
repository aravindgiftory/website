import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { occasions, BRAND } from "@/data/catalog";

export const Route = createFileRoute("/occasions/")({
  head: () => ({
    meta: [
      { title: "Gifts by Occasion | Aravind Giftory" },
      {
        name: "description",
        content:
          "Wedding, birthday, baby shower, housewarming, pooja & festive and corporate gifting — curated collections for every occasion.",
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
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <SectionHeading
          eyebrow="Occasions"
          title="Every Occasion Deserves a Thoughtful Gift."
          description="Start with the moment you're celebrating — we'll help with the rest."
        />
      </section>

      <div className="mt-20 space-y-24">
        {occasions.map((occasion, index) => (
          <section key={occasion.slug} className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div
              className={`grid gap-10 lg:grid-cols-2 lg:items-center ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={occasion.image}
                  alt={`${occasion.name} gifting`}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div>
                <span className="eyebrow text-gold">
                  {String(index + 1).padStart(2, "0")} — {occasion.name}
                </span>
                <h2 className="display-md mt-4 text-primary">{occasion.tagline}</h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                  {occasion.description}
                </p>
                <Link
                  to="/occasions/$occasion"
                  params={{ occasion: occasion.slug }}
                  className="link-underline mt-8 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                >
                  Find Gifts for This Occasion
                </Link>
              </div>
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
