import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AUDIENCES } from "@/data/audiences";
import { isDiwaliSeason } from "@/data/festival";
import { Diya } from "./DiwaliTheme";
import { useLeadDialog } from "./LeadDialog";
import { BRAND, whatsappLink } from "@/data/catalog";
import productData from "@/data/catalogue-products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { CatalogueProductCard, type CatalogueProduct } from "./CatalogueProductCard";
import { catalogueTitle, pageSrc } from "@/lib/occasion-products";
import { REAL_COLLECTIONS, collectionCover } from "@/lib/real-collections";

const coverOf = (slug: string) => collectionCover(slug);

/** Rounded-square quick-links to every collection, shown right under the hero. */
export function CategoryStrip() {
  return (
    <section aria-label="Shop by collection" className="mx-auto max-w-[1400px] px-5 pt-10 sm:px-8">
      <ul className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] sm:justify-between sm:gap-4">
        {REAL_COLLECTIONS.map((collection) => {
          const cover = coverOf(collection.slug);
          return (
            <li key={collection.slug} className="w-28 shrink-0 sm:w-32">
              <Link
                to="/collections/$category"
                params={{ category: collection.slug }}
                className="group block text-center"
              >
                <span className="mx-auto block h-24 w-24 overflow-hidden rounded-2xl border border-border bg-white sm:h-28 sm:w-28">
                  {cover && (
                    <img
                      src={cover.image}
                      alt=""
                      width={cover.width}
                      height={cover.height}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </span>
                <span className="mt-3 block text-xs font-medium leading-snug text-foreground group-hover:text-primary">
                  {collection.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Verified facts only: base city, minimum order, starting price and WhatsApp support. */
export function UspStrip() {
  const items = [
    { title: `Packed in ${BRAND.city}`, note: "Curated and delivered from our city" },
    {
      title: `From ₹${BRAND.startingPrice} a gift`,
      note: `Minimum order ${BRAND.minQuantity} pieces`,
    },
    { title: "Hampers by budget", note: "Under ₹1K, ₹2K–₹3K and ₹5K+" },
    { title: "Help on WhatsApp", note: "Tell us occasion, quantity and budget" },
  ];
  return (
    <section
      aria-label="Why buyers choose us"
      className="mx-auto mt-10 max-w-[1400px] px-5 sm:px-8"
    >
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title} className="bg-card px-5 py-5 text-center">
            <p className="font-display text-base leading-tight text-primary sm:text-xl">
              {item.title}
            </p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Horizontal, swipeable row of product cards with previous/next buttons. */
export function ProductCarousel({
  eyebrow,
  title,
  description,
  products,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: CatalogueProduct[];
}) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (direction: 1 | -1) =>
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <div className="flex items-center gap-4">
            <Link
              to="/collections"
              className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              View all
            </Link>
            <div className="hidden gap-2 sm:flex">
              {([-1, 1] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => scroll(direction)}
                  aria-label={direction === 1 ? "Next gifts" : "Previous gifts"}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors hover:border-primary"
                >
                  {direction === 1 ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        }
      />
      <ul
        ref={track}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
      >
        {products.map((product) => (
          <li
            key={`${product.key}-${product.code}`}
            className="w-[16rem] shrink-0 snap-start sm:w-[17.5rem]"
          >
            <CatalogueProductCard
              product={product}
              pageSrc={pageSrc(product)}
              catalogueTitle={catalogueTitle(product.key)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

const BUDGET_TILES = [
  { slug: "hampers-under-1k", label: "Under ₹1K", note: "Budget-friendly hampers" },
  { slug: "hampers-2k-3k", label: "₹2K–₹3K", note: "Premium hampers" },
  { slug: "hampers-5k-plus", label: "₹5K & above", note: "Luxury hampers" },
  { slug: "snacks-munchies", label: "Snacks & Munchies", note: "Gourmet snack hampers" },
];

/** Shop-by-budget tiles, the way buyers usually start a bulk order. */
export function BudgetTiles() {
  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
      <SectionHeading
        eyebrow="Budget"
        title="Shop gifts by budget"
        description="Start with what you plan to spend per gift. Every hamper here is a real catalogue product."
      />
      <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {BUDGET_TILES.map((tile) => {
          const cover = coverOf(tile.slug);
          return (
            <li key={tile.slug}>
              <Link
                to="/collections/$category"
                params={{ category: tile.slug }}
                className="group block overflow-hidden rounded-sm bg-primary text-primary-foreground transition-shadow hover:shadow-[var(--shadow-soft)]"
              >
                {cover && (
                  <img
                    src={cover.image}
                    alt={`${tile.label} gift hampers`}
                    width={cover.width}
                    height={cover.height}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
                <span className="block p-4">
                  <span className="block font-display text-3xl text-gold-soft">{tile.label}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-primary-foreground/80">
                    {tile.note}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SERVICES = [
  {
    to: "/occasions",
    occasion: undefined,
    title: "Bulk return gifts in Hyderabad",
    text: "Return gifts for guests at weddings, baby showers, housewarmings and birthdays, in quantity.",
  },
  {
    to: "/occasions/$occasion",
    occasion: "wedding",
    title: "Wedding return gifts",
    text: "Gift hampers and brass dry fruit boxes for wedding guests, grouped by budget.",
  },
  {
    to: "/corporate-gifting",
    occasion: undefined,
    title: "Corporate gifting",
    text: "Welcome kits, gift sets and festive hampers for teams, clients and partners.",
  },
  {
    to: "/occasions/$occasion",
    occasion: "pooja-festive",
    title: "Diwali and festive gifts",
    text: "Brass and crystal diyas, pooja plates and festive hampers, plus cork gift combos.",
  },
  {
    to: "/occasions/$occasion",
    occasion: "baby-shower",
    title: "Baby shower and naming ceremony",
    text: "Gift hampers under ₹1K and ₹2K–₹3K with snacks, dry fruits, tea and coffee.",
  },
  {
    to: "/occasions/$occasion",
    occasion: "housewarming",
    title: "Housewarming and traditional gifts",
    text: "Brass bowls, jars, trays and cork planters for griha pravesh and new homes.",
  },
] as const;

function ServiceLink({
  service,
  className,
  children,
}: {
  service: (typeof SERVICES)[number];
  className: string;
  children: ReactNode;
}) {
  return service.to === "/occasions/$occasion" ? (
    <Link to="/occasions/$occasion" params={{ occasion: service.occasion }} className={className}>
      {children}
    </Link>
  ) : (
    <Link to={service.to} className={className}>
      {children}
    </Link>
  );
}

/** Plain-language services block: what we supply, where from, and where to start. */
export function ServicesSection() {
  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
      <SectionHeading
        eyebrow={`Gifting in ${BRAND.city}`}
        title={`Gifting services in ${BRAND.city}`}
        description={`${BRAND.name} is based in ${BRAND.city} and supplies return gifts, hampers and corporate gift sets in bulk, from ${BRAND.minQuantity} pieces. Choose the occasion you are planning.`}
      />
      <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <li key={service.title} className="border-t border-border pt-6">
            <h3 className="font-display text-2xl text-primary">
              <ServiceLink service={service} className="hover:underline">
                {service.title}
              </ServiceLink>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.text}</p>
            <ServiceLink
              service={service}
              className="link-underline mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              View gifts
            </ServiceLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Entry points for the four buyer groups, each with its own landing page. */
export function AudienceLinks() {
  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
      <SectionHeading
        eyebrow="Who we help"
        title="Gifting for planners, families and teams"
        description="Pick the page written for the way you buy, with the right catalogues and a quick way to enquire."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((audience) => (
          <li key={audience.slug}>
            <Link
              to="/for/$audience"
              params={{ audience: audience.slug }}
              className="group flex h-full flex-col border border-border bg-card p-6 transition-colors hover:border-gold/60"
            >
              <span className="eyebrow text-gold">For</span>
              <span className="mt-2 font-display text-2xl text-primary">{audience.name}</span>
              <span className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {audience.h1}
              </span>
              <span className="link-underline mt-5 self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                See how we help
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const DIWALI_PRODUCTS = (productData as Array<CatalogueProduct & { key: string }>).filter(
  (product) => product.key === "diwali-hampers",
);

/**
 * The seasonal highlight: every gift set from the Diwali Hampers catalogue as a card, on a deep
 * maroon band with diyas. It disappears by itself after Diwali (see `data/festival.ts`).
 */
export function DiwaliHighlight() {
  const { openCatalogue, open } = useLeadDialog();
  const track = useRef<HTMLUListElement>(null);
  if (!isDiwaliSeason() || DIWALI_PRODUCTS.length === 0) return null;
  const scroll = (direction: 1 | -1) =>
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <section
      aria-labelledby="diwali-heading"
      className="relative z-20 mx-auto mt-8 max-w-[1400px] px-5 sm:px-8"
    >
      <div className="relative overflow-hidden rounded-sm bg-primary px-5 py-12 text-primary-foreground sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-3 border border-gold/50" />
        <div className="pointer-events-none absolute -left-6 bottom-4 hidden opacity-90 sm:block">
          <Diya className="h-24 w-24" />
        </div>
        <div className="pointer-events-none absolute -right-6 bottom-4 hidden opacity-90 sm:block">
          <Diya className="h-24 w-24" />
        </div>

        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3">
            <Diya className="h-8 w-8" />
            <span className="eyebrow text-gold-soft">The festival of lights</span>
            <Diya className="h-8 w-8" />
          </div>
          <h2
            id="diwali-heading"
            className="display-lg mx-auto mt-4 max-w-2xl text-primary-foreground"
          >
            Diwali Hampers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
            {DIWALI_PRODUCTS.length} gift sets in a Happy Diwali box, with dry fruits, lamps,
            speakers, power banks and flasks. Open a set to see everything inside.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openCatalogue(undefined, "Diwali Hampers Catalogue")}
              className="rounded-sm bg-primary-foreground px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Get the Diwali catalogue
            </button>
            <button
              type="button"
              onClick={() =>
                open({
                  source: "bulk-quote",
                  title: "Diwali hampers quote",
                  intro: "Share your quantity and delivery date and we'll confirm pricing.",
                  submitLabel: "Request a Bulk Quote",
                  occasion: "Diwali",
                })
              }
              className="rounded-sm border border-primary-foreground/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:border-gold-soft hover:text-gold-soft"
            >
              Request a Bulk Quote
            </button>
            <a
              href={whatsappLink(
                `Hi ${BRAND.name}, I'd like Diwali hampers. Quantity: \nBudget per gift: \nDelivery date: `,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-primary-foreground/40 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:border-gold-soft hover:text-gold-soft"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="mb-4 hidden justify-end gap-2 sm:flex">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => scroll(direction)}
                aria-label={direction === 1 ? "Next gift sets" : "Previous gift sets"}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground transition-colors hover:border-gold-soft hover:text-gold-soft"
              >
                {direction === 1 ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
          <ul
            ref={track}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
          >
            {DIWALI_PRODUCTS.map((product) => (
              <li key={product.code} className="w-[16rem] shrink-0 snap-start sm:w-[17.5rem]">
                <CatalogueProductCard
                  product={product}
                  pageSrc={pageSrc(product)}
                  catalogueTitle={catalogueTitle(product.key)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
