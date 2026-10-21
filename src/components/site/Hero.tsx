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
  /** Short label for the slide dots and the action bar. */
  kicker: string;
  /** The banner's headline and line of text. They are baked into the image, so they also go in the alt text and a hidden heading. */
  title: string;
  text: string;
  catalogue: string;
  image: { src: string; width: number; height: number };
}

/** Banner artwork with the headline in the picture; each slide opens its own catalogue form. */
const SLIDES: Slide[] = [
  {
    id: "diwali",
    slug: "festive-cork-gifting",
    kicker: "Diwali 2026",
    title: "Diwali gifting, ready in bulk.",
    text: "Sustainable cork gift combos for clients, teams and families, packed and delivered from Hyderabad.",
    catalogue: "Festive Cork Gifting Catalogue 2026",
    image: { src: "/site/hero-diwali.webp", width: 1774, height: 887 },
  },
  {
    id: "gift-sets",
    slug: "gift-sets",
    kicker: "Corporate gift sets",
    title: "Simple. Useful. Significant.",
    text: "Flask, notebook, pen and keychain sets in black, ivory and olive, boxed and ready to give.",
    catalogue: "Gift Sets Catalogue 2026–27",
    image: { src: "/site/hero-gift-sets.webp", width: 1672, height: 941 },
  },
  {
    id: "drinkware",
    slug: "drinkware-barware",
    kicker: "Drinkware & barware",
    title: "Practical gifts. Remembered every day.",
    text: "Insulated bottles, tumblers and gift-box sets for corporate gifting, events and celebrations.",
    catalogue: "Drinkware & Barware 2026–27",
    image: { src: "/site/hero-drinkware.webp", width: 1774, height: 887 },
  },
  {
    id: "planters",
    slug: "cork-planters",
    kicker: "Cork planters",
    title: "Greenery that stays on the desk.",
    text: "Cork planters for desks, walls and thoughtful gifting.",
    catalogue: "Cork Planters Catalogue 2026",
    image: { src: "/site/hero-planters.webp", width: 1672, height: 941 },
  },
  {
    id: "corporate-festive",
    slug: "corporate-festive-gifting",
    kicker: "Corporate & festive",
    title: "Candles, diffusers and gift boxes.",
    text: "Scented candles, reed diffusers and boxed sets for Diwali, teams and clients.",
    catalogue: "Corporate & Festive Gifting 2026",
    image: { src: "/site/hero-corporate-festive.webp", width: 1672, height: 941 },
  },
];

const AUTOPLAY_MS = 6500;

/**
 * Hero carousel of banner artwork, with the catalogue and "View all products" actions for the
 * current slide underneath. Autoplay pauses on keyboard focus and is off under prefers-reduced-motion.
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
  const current = SLIDES[index] ?? SLIDES[0];

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
      <div className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="relative">
          <div ref={emblaRef} className="touch-pan-y overflow-hidden">
            <div className="flex">
              {SLIDES.map((slide, i) => {
                const Heading = i === 0 ? "h1" : "h2";
                return (
                  <div
                    key={slide.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${SLIDES.length}: ${slide.kicker}`}
                    className="min-w-0 flex-[0_0_100%]"
                  >
                    <Heading className="sr-only">{slide.title}</Heading>
                    <Link
                      to="/gifts/$catalogue"
                      params={{ catalogue: slide.slug }}
                      draggable={false}
                      tabIndex={-1}
                      className="block select-none"
                    >
                      <img
                        draggable={false}
                        src={slide.image.src}
                        alt={`${slide.title} ${slide.text}`}
                        width={slide.image.width}
                        height={slide.image.height}
                        loading={i === 0 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : "auto"}
                        className="aspect-[4/3] w-full object-cover object-left sm:aspect-[2/1] sm:object-center"
                      />
                    </Link>
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

        {current && (
          <div
            aria-label={`Actions for ${current.kicker}`}
            role="group"
            className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openCatalogue(undefined, current.catalogue)}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Get the catalogue
                <Download className="h-4 w-4" />
              </button>
              <Link
                to="/gifts/$catalogue"
                params={{ catalogue: current.slug }}
                className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-primary transition-colors hover:text-primary/70"
              >
                View all products
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label="Pricing">
              <li className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                From ₹{BRAND.startingPrice} per gift
              </li>
              <li className="rounded-full border border-primary/25 bg-white/60 px-4 py-2 text-sm font-medium text-primary">
                Minimum order {BRAND.minQuantity} pieces
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
