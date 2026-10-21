import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { FestiveCombos } from "@/components/site/FestiveCombos";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  CatalogueProductCard,
  type CatalogueProduct,
} from "@/components/site/CatalogueProductCard";
import { InstagramGallery } from "@/components/site/InstagramGallery";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { edits, occasions, BRAND, whatsappLink } from "@/data/catalog";
import pageData from "@/data/catalogue-pages.json";
import productData from "@/data/catalogue-products.json";
import { CATALOGUE_FILES } from "@/data/media";
import { FaqSection } from "@/components/site/Faq";
import { faqScript } from "@/lib/seo";
import { homeFaqs } from "@/data/seo-copy";
import brandStory from "@/assets/brand-story.jpg";

const CATALOGUE_PRODUCTS = productData as CatalogueProduct[];
const PAGES = pageData as Record<string, Array<{ n: number; src: string }>>;

/** Real catalogue products on the home page: how many to take from each catalogue. */
const HOME_PICKS: Array<[key: string, count: number]> = [
  ["luxury-gifting-2026", 2],
  ["corporate-gifting-2026", 2],
  ["gift-hampers-5k-plus-2026", 1],
  ["gift-hampers-2k-3k-2026", 1],
  ["gift-hampers-1k-2026", 1],
  ["snacks-munchies-hampers-2026", 1],
];

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

const homeProducts = shuffled(
  HOME_PICKS.flatMap(([key, count], index) =>
    shuffled(
      CATALOGUE_PRODUCTS.filter((product) => product.key === key),
      7 + index,
    ).slice(0, count),
  ),
  2026,
);

const catalogueTitle = (key: string) =>
  CATALOGUE_FILES.find((file) => file.href.endsWith(`/${key}.pdf`))?.title ?? "Catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bulk Return Gifts & Corporate Gifting in Hyderabad | Aravind Giftory" },
      {
        name: "description",
        content:
          "Aravind Giftory, Hyderabad: return gifts, hampers and corporate gift sets in bulk for weddings, baby showers, housewarmings, festivals and corporate events. Browse the catalogue and request a quote.",
      },
      {
        property: "og:title",
        content: "Bulk Return Gifts & Corporate Gifting in Hyderabad | Aravind Giftory",
      },
      {
        property: "og:description",
        content:
          "Curated gifting collections for weddings, birthdays, baby showers, housewarmings, celebrations and corporate occasions.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/` }],
    scripts: [faqScript(homeFaqs)],
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

/** Celebration stories, each told with a real catalogue gift (looked up by product code). */
const stories = [
  {
    category: "Wedding",
    title: "Return gifts guests actually keep",
    text: "A luxury hamper in place of the usual return gift. Packed, labelled and delivered to the venue ahead of the reception, so the family could simply enjoy the day.",
    code: "AG10011",
  },
  {
    category: "Baby Shower",
    title: "A gentle thank-you for every guest",
    text: "A pamper hamper with dry fruits makes a gentle thank-you: light, easy to carry and welcome with guests of every age.",
    code: "AG1225",
  },
  {
    category: "Housewarming",
    title: "A gift that settles into a new home",
    text: "For a griha pravesh, a decorative brass bowl set from our luxury collection is a keepsake that stays on the shelf long after the day.",
    code: "AG-BW-001",
  },
  {
    category: "Birthday",
    title: "Small hampers, big smiles",
    text: "Tea and activity hampers under ₹1K send every guest home with something thoughtful, without stretching the budget.",
    code: "AG488",
  },
  {
    category: "Corporate",
    title: "Welcome kits for a growing team",
    text: "Branded gift sets welcome new joiners on day one, ordered in volume and delivered in time for the start date.",
    code: "AG-CO-001",
  },
].map((story) => ({
  ...story,
  product: (productData as CatalogueProduct[]).find((item) => item.code === story.code),
}));

function Home() {
  const { open } = useLeadDialog();

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
          action={
            <Link
              to="/catalogue"
              className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              View all catalogues
            </Link>
          }
        />
        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {homeProducts.map((product) => (
            <CatalogueProductCard
              key={`${product.key}-${product.code}`}
              product={product}
              pageSrc={PAGES[product.key]?.find((page) => page.n === product.n)?.src}
              catalogueTitle={catalogueTitle(product.key)}
            />
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

      {/* 09 — Celebration stories */}
      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Stories"
          title="Celebrations We've Been Part Of"
          description="From weddings to welcome kits, the moments our gifts have helped make memorable."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {stories.map((story) => (
            <article key={story.category} className="flex flex-col border border-border bg-card">
              {story.product && (
                <img
                  src={story.product.image}
                  alt={story.product.name}
                  width={story.product.w}
                  height={story.product.h}
                  loading="lazy"
                  className="aspect-square w-full bg-white object-cover"
                />
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="eyebrow text-gold">{story.category}</span>
                <h3 className="font-display text-xl leading-snug text-primary">{story.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{story.text}</p>
                {story.product && (
                  <p className="mt-auto pt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {story.product.name} · {story.product.code}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <FaqSection items={homeFaqs} />

      {/* 10 — Instagram */}
      <div className="mt-32">
        <InstagramGallery />
      </div>

      <section className="mx-auto mb-20 mt-32 max-w-[1400px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-sm bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-3 border border-gold/50" />
          <div className="relative">
            <span className="eyebrow text-primary-foreground/70">Need a hand?</span>
            <h2 className="display-md mx-auto mt-5 max-w-2xl">
              Still deciding? Connect with us, we'll help you.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/80">
              Tell us the occasion, quantity and budget, and we'll suggest the right gifts.
            </p>
            <a
              href={whatsappLink(
                "Hi Aravind Giftory, I'd like help choosing gifts. Occasion: \nQuantity: \nBudget: ",
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-block rounded-sm bg-primary-foreground px-9 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Chat with us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
