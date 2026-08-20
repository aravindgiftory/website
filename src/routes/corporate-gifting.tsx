import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { LeadForm } from "@/components/site/LeadForm";
import { productsByOccasion } from "@/data/catalog";
import occasionCorporate from "@/assets/occasion-corporate.jpg";

export const Route = createFileRoute("/corporate-gifting")({
  head: () => ({
    meta: [
      { title: "Corporate Gifting | Aravind Giftory" },
      {
        name: "description",
        content:
          "Thoughtful corporate gifting for employees, clients, partners and corporate occasions. Request the corporate catalogue from Aravind Giftory, Hyderabad.",
      },
      { property: "og:title", content: "Corporate Gifting | Aravind Giftory" },
      {
        property: "og:description",
        content: "Gifts that represent your brand — curated corporate gifting in volume.",
      },
      { property: "og:url", content: "/corporate-gifting" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/corporate-gifting" }],
  }),
  component: CorporatePage,
});

function CorporatePage() {
  const items = productsByOccasion("corporate");

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
              Thoughtful gifting for employees, clients, partners and corporate occasions.
            </p>
            <a
              href="#corporate-form"
              className="mt-9 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Request Corporate Catalogue
            </a>
          </div>
          <div className="overflow-hidden bg-muted">
            <img
              src={occasionCorporate}
              alt="Executive flask set, desk clock organiser and pen set arranged as corporate gifts"
              width={1200}
              height={1500}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Selected"
          title="Corporate gifting from the catalogue"
          description="Desk pieces, flask sets, pen sets, dry fruit gifting and drinkware — all available in volume."
        />
        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

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
