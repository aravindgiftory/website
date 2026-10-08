import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { FestiveCombos } from "@/components/site/FestiveCombos";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { CTASection } from "@/components/site/CTASection";
import { InstagramGallery } from "@/components/site/InstagramGallery";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { edits, featuredProducts, occasions, BRAND } from "@/data/catalog";
import brandStory from "@/assets/brand-story.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aravind Giftory | Thoughtful Gifts for Every Occasion" },
      {
        name: "description",
        content:
          "Discover curated return gifts, premium gifting collections and thoughtful gifts for weddings, birthdays, baby showers, housewarmings, festive occasions and corporate events.",
      },
      { property: "og:title", content: "Aravind Giftory | Thoughtful Gifts for Every Occasion" },
      {
        property: "og:description",
        content:
          "Curated gifting collections for weddings, birthdays, baby showers, housewarmings, celebrations and corporate occasions.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/` }],
  }),
  component: Home,
});

const bulkTiers = ["25+", "50+", "100+", "250+", "500+"];

const whyBlocks = [
  {
    title: "Curated, Not Crowded",
    body: "We bring together gifting ideas across traditional, contemporary and practical collections.",
  },
  {
    title: "Made for Celebrations",
    body: "Collections designed around memorable occasions.",
  },
  {
    title: "Small or Bulk, We Help",
    body: "Whether you're gifting a small gathering or planning a larger celebration.",
  },
  {
    title: "Personal Guidance",
    body: "Tell us your occasion, quantity and budget and we'll help narrow down the choices.",
  },
];

const steps = [
  { number: "01", label: "Tell us about your occasion" },
  { number: "02", label: "Explore our collection" },
  { number: "03", label: "Choose your favourites" },
  { number: "04", label: "We'll help with quantity & pricing" },
  { number: "05", label: "Celebrate" },
];

const orderSteps = [
  { title: "Choose", text: "Pick gifts from the catalogue." },
  { title: "Enquire", text: "Share your quantity and event date." },
  { title: "Receive", text: "We pack and deliver, with pricing for your quantity." },
];

const storyCategories = ["Wedding", "Baby Shower", "Housewarming", "Birthday", "Corporate"];

function Home() {
  const { open, openCatalogue } = useLeadDialog();

  return (
    <>
      <Hero />
      <FestiveCombos />

      <section aria-label="How ordering works" className="mx-auto max-w-[1400px] px-5 pt-4 sm:px-8">
        <ol className="grid gap-6 border-y border-border py-8 sm:grid-cols-3">
          {orderSteps.map((step, i) => (
            <li key={step.title}>
              <p className="font-display text-2xl italic text-primary">
                {i + 1}. {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 02 — Choose the Moment */}
      <section className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 lg:pt-24">
        <SectionHeading
          eyebrow="Occasions"
          title="Choose the Moment"
          description="Every celebration has its own tone. Start with the occasion and we'll help narrow the rest."
          action={
            <Link
              to="/occasions"
              className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              All Occasions
            </Link>
          }
        />
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <Link
              key={occasion.slug}
              to="/occasions/$occasion"
              params={{ occasion: occasion.slug }}
              className="group block"
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={occasion.image}
                  alt={`${occasion.name} gifting by Aravind Giftory`}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl text-primary">{occasion.name}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {occasion.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 03 — The 2026 Collection */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Collection"
          title="The 2026 Collection"
          description="A curated selection of traditional, contemporary and practical gifting ideas."
          action={
            <Link
              to="/collections"
              className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              Explore Collections
            </Link>
          }
        />

        <div className="mt-14 space-y-4">
          {edits.map((edit, index) => (
            <Link
              key={edit.title}
              to="/collections/$category"
              params={{ category: edit.collection }}
              className="group grid items-center gap-6 border-t border-border py-6 md:grid-cols-[7rem_1fr_auto] md:gap-10"
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={edit.image}
                  alt={edit.title}
                  loading="lazy"
                  className="aspect-square w-28 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div>
                <div className="flex items-baseline gap-4">
                  <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-3xl text-primary md:text-4xl">{edit.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{edit.description}</p>
              </div>
              <span className="link-underline self-center text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                View
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 04 — Featured products */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Selected Pieces"
          title="From the Catalogue"
          description="A handful of pieces our clients return to. Every gift is available in quantity."
        />
        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* 05 — Bulk gifting */}
      <section className="mt-32 border-y border-border bg-[oklch(0.951_0.018_86)]">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Bulk Gifting</span>
            </div>
            <h2 className="display-lg mt-5 max-w-md text-primary">Planning a Celebration?</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Tell us how many guests you're gifting. We'll help you find the right collection.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {bulkTiers.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() =>
                    open({
                      source: "bulk-quote",
                      title: "Get a Bulk Quote",
                      intro: "We'll suggest collections that suit your quantity and budget.",
                      submitLabel: "Get a Bulk Quote",
                      quantity:
                        tier === "25+"
                          ? "25–50"
                          : tier === "50+"
                            ? "50–100"
                            : tier === "100+"
                              ? "100–250"
                              : tier === "250+"
                                ? "250–500"
                                : "500+",
                    })
                  }
                  className="lift surface-card px-4 py-7 text-center font-display text-2xl text-primary"
                >
                  {tier}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                open({
                  source: "bulk-quote",
                  title: "Get a Bulk Quote",
                  submitLabel: "Get a Bulk Quote",
                })
              }
              className="mt-6 w-full rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground sm:w-auto"
            >
              Get a Bulk Quote
            </button>
          </div>
        </div>
      </section>

      {/* 06 — Why Giftory */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading eyebrow="Why Giftory?" title="Gifting, handled with care." />
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {whyBlocks.map((block, index) => (
            <div key={block.title} className="border-t border-border pt-6">
              <span className="eyebrow text-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-3xl text-primary">{block.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 07 — How it works */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading eyebrow="How It Works" title="Five simple steps." />
        <ol className="mt-14 grid gap-y-8 md:grid-cols-5 md:gap-x-6">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-border pt-6">
              <span className="font-display text-5xl text-gold">{step.number}</span>
              <p className="mt-4 text-sm leading-relaxed text-foreground">{step.label}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 08 — Brand story */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden bg-muted">
            <img
              src={brandStory}
              alt="Gifts being curated and packed at the Aravind Giftory workshop in Hyderabad"
              width={1400}
              height={1200}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">From Hyderabad</span>
            </div>
            <h2 className="display-lg mt-5 text-primary">
              Thoughtful gifting, curated for every occasion.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Aravind Giftory brings together traditional Indian craft, contemporary gifting and
              practical everyday pieces — curated and packed in Hyderabad for celebrations of every
              size.
            </p>
            <Link
              to="/about"
              className="link-underline mt-8 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              About Giftory
            </Link>
          </div>
        </div>
      </section>

      {/* 09 — Customer stories (placeholder, CMS-ready) */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Stories"
          title="Celebrations We've Been Part Of"
          description="This space is reserved for real celebrations and client stories, added as they're shared with us."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {storyCategories.map((category) => (
            <div
              key={category}
              className="flex aspect-[4/5] flex-col justify-between border border-dashed border-border bg-card p-6"
            >
              <span className="eyebrow text-gold">{category}</span>
              <p className="text-sm leading-relaxed text-muted-foreground">Story coming soon.</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 — Instagram */}
      <div className="mt-32">
        <InstagramGallery />
      </div>

      <div className="mt-32">
        <CTASection />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-20 text-center sm:px-8">
        <p className="font-display text-3xl text-primary">Still deciding?</p>
        <button
          type="button"
          onClick={() => openCatalogue()}
          className="link-underline mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
        >
          Get the 2026 Catalogue
        </button>
      </div>
    </>
  );
}
