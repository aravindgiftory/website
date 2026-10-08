import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { BRAND } from "@/data/catalog";
import { useLeadDialog } from "./LeadDialog";

interface Slide {
  id: string;
  /** Catalogue listing page this slide leads to: /gifts/{slug}. */
  slug: string;
  kicker: string;
  title: string;
  text: string;
  catalogue: string;
  /** Light tinted background for the slide. */
  surface: string;
  images: { src: string; alt: string; width: number; height: number; label?: string }[];
}

/** Photos are cropped from the catalogue PDFs; each slide opens its own catalogue form. */
const SLIDES: Slide[] = [
  {
    id: "diwali",
    slug: "festive-cork-gifting",
    kicker: "Diwali 2026",
    title: "Diwali gifting, ready in bulk.",
    text: "Sustainable cork combos for clients, teams and families, packed and delivered from Hyderabad.",
    catalogue: "Festive Cork Gifting Catalogue 2026",
    surface: "bg-[linear-gradient(115deg,oklch(0.96_0.03_85),oklch(0.9_0.07_72))]",
    images: [
      {
        src: "/products/cork-combo-8.jpg",
        alt: "Cork gift combo 8 with a premium cork box, bottle, planter and tissue holder",
        width: 928,
        height: 830,
        label: "Combo 8 · 7 items",
      },
      {
        src: "/products/cork-combo-1.jpg",
        alt: "Cork gift combo 1 with a desk organizer, photo frame, clock and tea light holders",
        width: 1008,
        height: 864,
        label: "Combo 1 · 6 items",
      },
      {
        src: "/products/cork-combo-3.jpg",
        alt: "Cork gift combo 3 with a tray, two jars with cork lids, coasters and a tea light holder",
        width: 1008,
        height: 864,
        label: "Combo 3 · 8 items",
      },
    ],
  },
  {
    id: "gift-sets",
    slug: "gift-sets",
    kicker: "Corporate gift sets",
    title: "Simple. Useful. Significant.",
    text: "Flask, notebook, pen and keychain sets in black, ivory and olive, boxed and ready to give.",
    catalogue: "Gift Sets Catalogue 2026–27",
    surface: "bg-[linear-gradient(115deg,oklch(0.97_0.015_88),oklch(0.92_0.03_80))]",
    images: [
      {
        src: "/site/slide-gift-sets.jpg",
        alt: "Black and ivory boxed gift sets with a flask, pen, keychain and notebook",
        width: 1193,
        height: 965,
      },
    ],
  },
  {
    id: "drinkware",
    slug: "drinkware-barware",
    kicker: "Drinkware & barware",
    title: "Gifts people keep using.",
    text: "Insulated bottles and tumblers in steel, gold and colour, with optional gift boxes.",
    catalogue: "Drinkware & Barware 2026–27",
    surface: "bg-[linear-gradient(115deg,oklch(0.96_0.02_190),oklch(0.92_0.04_175))]",
    images: [
      {
        src: "/site/slide-drinkware.jpg",
        alt: "California and Zenith insulated bottles, some with gift boxes",
        width: 1192,
        height: 1428,
      },
    ],
  },
  {
    id: "fragrance",
    slug: "home-fragrance",
    kicker: "Home fragrance",
    title: "A gift that fills the room.",
    text: "Reed diffusers, candles and fragrance gift sets in lavender, apple cinnamon and lemon grass.",
    catalogue: "Home Fragrance Collection 2026–27",
    surface: "bg-[linear-gradient(115deg,oklch(0.96_0.02_300),oklch(0.92_0.035_320))]",
    images: [
      {
        src: "/site/slide-fragrance.jpg",
        alt: "Lavender reed diffuser gift box with a white ceramic pot and reed sticks",
        width: 1480,
        height: 1033,
      },
    ],
  },
  {
    id: "planters",
    slug: "cork-planters",
    kicker: "Cork planters",
    title: "Greenery that stays on the desk.",
    text: "Forty-three test tube, tabletop and wall planters in natural cork, ready in quantity.",
    catalogue: "Cork Planters Catalogue 2026",
    surface: "bg-[linear-gradient(115deg,oklch(0.96_0.025_130),oklch(0.92_0.05_120))]",
    images: [
      {
        src: "/products/cork-planter-31.jpg",
        alt: "Box print cork planter with a variegated plant",
        width: 560,
        height: 560,
        label: "Box Print Planter",
      },
      {
        src: "/products/cork-planter-24.jpg",
        alt: "Three beaker cork planter with green plants",
        width: 560,
        height: 560,
        label: "3 Beaker Planter",
      },
      {
        src: "/products/cork-planter-12.jpg",
        alt: "House-shaped cork test tube planter",
        width: 560,
        height: 560,
        label: "Casa Planter",
      },
    ],
  },
  {
    id: "corporate-festive",
    slug: "corporate-festive-gifting",
    kicker: "Corporate & festive",
    title: "Candles, diffusers and gift boxes.",
    text: "Scented candles, reed diffusers and boxed sets for Diwali, teams and clients.",
    catalogue: "Corporate & Festive Gifting 2026",
    surface: "bg-[linear-gradient(115deg,oklch(0.97_0.02_20),oklch(0.93_0.04_10))]",
    images: [
      {
        src: "/site/slide-corporate-festive.jpg",
        alt: "Blue Berry Bloom flower bouquet gift sets with reed diffuser and candle",
        width: 1626,
        height: 648,
      },
    ],
  },
];

const AUTOPLAY_MS = 6500;

/**
 * Hero carousel — festive offer slides on light, tinted backgrounds. Autoplay
 * pauses on hover/focus and is off under prefers-reduced-motion.
 */
export function Hero() {
  const { openCatalogue } = useLeadDialog();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => embla.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [embla, paused, index]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured gifting collections"
      className="mx-auto max-w-[1400px] px-3 pt-24 sm:px-6 sm:pt-28"
      onFocus={(event) => {
        // Only keyboard focus pauses; a mouse click on an arrow must not stop autoplay.
        if (event.target.matches(":focus-visible")) setPaused(true);
      }}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-md border border-border shadow-[var(--shadow-soft)]">
        <div ref={emblaRef} className="touch-pan-y overflow-hidden">
          <div className="flex">
            {SLIDES.map((slide, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${SLIDES.length}`}
                  className={`min-w-0 flex-[0_0_100%] ${slide.surface}`}
                >
                  <div className="grid min-h-[34rem] items-center gap-8 px-6 py-12 sm:px-20 lg:min-h-[32rem] lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:py-14">
                    <div>
                      <p className="inline-flex rounded-full border border-primary/20 bg-white/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                        {slide.kicker}
                      </p>
                      <Heading className="display-xl mt-5 max-w-xl text-primary">
                        {slide.title}
                      </Heading>
                      <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground/80">
                        {slide.text}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-3" aria-label="Pricing">
                        <li className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                          From ₹{BRAND.startingPrice} per gift
                        </li>
                        <li className="rounded-full border border-primary/25 bg-white/60 px-5 py-2.5 text-sm font-medium text-primary">
                          Minimum order {BRAND.minQuantity} pieces
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          onClick={() => openCatalogue(undefined, slide.catalogue)}
                          className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          Get the catalogue
                          <Download className="h-4 w-4" />
                        </button>
                        <Link
                          to="/gifts/$catalogue"
                          params={{ catalogue: slide.slug }}
                          className="flex items-center gap-2 px-3 py-3.5 text-sm font-medium text-primary transition-colors hover:text-primary/70"
                        >
                          View all products
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <Link
                      to="/gifts/$catalogue"
                      params={{ catalogue: slide.slug }}
                      aria-hidden="true"
                      tabIndex={-1}
                      draggable={false}
                      className="block select-none"
                    >
                      <Visual slide={slide} priority={i === 0} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/85 text-primary shadow-[var(--shadow-soft)] transition-colors hover:bg-white sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/85 text-primary shadow-[var(--shadow-soft)] transition-colors hover:bg-white sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}: ${slide.kicker}`}
              aria-current={i === index}
              className="group flex h-6 min-w-6 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-primary" : "w-2 bg-primary/30 group-hover:bg-primary/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visual({ slide, priority }: { slide: Slide; priority: boolean }) {
  if (slide.images.length > 1) {
    const layout = [
      "left-[2%] top-[2%] w-[46%] -rotate-3",
      "right-[0%] top-[0%] w-[50%] rotate-2",
      "left-[24%] bottom-[0%] w-[52%] -rotate-1",
    ];
    return (
      <div className="relative mx-auto aspect-[1/0.92] w-full max-w-xl">
        {slide.images.map((image, i) => (
          <figure
            key={image.src}
            className={`absolute rounded-sm bg-white p-1.5 pb-0 shadow-[0_18px_34px_oklch(0.3_0.06_30_/_0.25)] ${layout[i] ?? ""}`}
            style={{ zIndex: i + 1 }}
          >
            <img
              draggable={false}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading={priority ? "eager" : "lazy"}
              className="aspect-[4/3] w-full object-cover"
            />
            {image.label && (
              <figcaption className="py-1.5 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
                {image.label}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  }

  const image = slide.images[0];
  if (!image) return null;
  return (
    <div className="mx-auto w-full max-w-lg">
      <img
        draggable={false}
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="max-h-[26rem] w-full rounded-sm border-[6px] border-white bg-white object-contain shadow-[0_18px_34px_oklch(0.3_0.06_30_/_0.2)]"
      />
    </div>
  );
}
