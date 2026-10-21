import { BRAND } from "@/data/catalog";
import productData from "@/data/catalogue-products.json";

interface CatalogueProduct {
  code: string;
  name: string;
  key: string;
  image: string;
  w: number;
  h: number;
}

const PRODUCTS = productData as CatalogueProduct[];

/** Real catalogue photography: how many tiles to take from each catalogue. */
const PICKS: Array<[key: string, count: number]> = [
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

const tiles = shuffled(
  PICKS.flatMap(([key, count], index) =>
    shuffled(
      PRODUCTS.filter((product) => product.key === key),
      31 + index,
    ).slice(0, count),
  ),
  11,
);

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">Instagram</span>
          </div>
          <h2 className="display-lg mt-5 text-primary">A Little Giftory, Every Day</h2>
          <p className="mt-3 text-sm text-muted-foreground">@{BRAND.instagram}</p>
        </div>
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="link-underline self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary"
        >
          Follow on Instagram
        </a>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <a
            key={`${tile.key}-${tile.code}`}
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden border border-border bg-white"
          >
            <img
              src={tile.image}
              alt={`${tile.name}, ${tile.code}`}
              width={tile.w}
              height={tile.h}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
