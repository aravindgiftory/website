import pageData from "@/data/catalogue-pages";
import productData from "@/data/catalogue-products";
import { CATALOGUE_FILES } from "@/data/media";
import type { CatalogueProduct } from "@/components/site/CatalogueProductCard";

const PAGES = pageData as Record<string, Array<{ n: number; src: string }>>;
const CATALOGUE_PRODUCTS = productData as CatalogueProduct[];

/** Which real catalogue products suit each occasion: catalogue key, optionally limited to code prefixes. */
const OCCASION_SOURCES: Record<string, Array<{ key: string; prefixes?: string[] }>> = {
  wedding: [
    { key: "gift-hampers-5k-plus-2026" },
    { key: "gift-hampers-2k-3k-2026" },
    { key: "luxury-gifting-2026", prefixes: ["DB", "GS"] },
  ],
  birthday: [
    { key: "gift-hampers-1k-2026" },
    { key: "snacks-munchies-hampers-2026" },
    { key: "gift-hampers-2k-3k-2026" },
  ],
  "baby-shower": [{ key: "gift-hampers-2k-3k-2026" }, { key: "gift-hampers-1k-2026" }],
  housewarming: [
    { key: "luxury-gifting-2026", prefixes: ["JR", "BW", "TR", "ST", "FL", "TS", "MG", "LB"] },
  ],
  "pooja-festive": [
    { key: "diwali-hampers" },
    { key: "luxury-gifting-2026", prefixes: ["DY", "PL", "UR", "ID", "DN", "KT"] },
  ],
  corporate: [{ key: "corporate-gifting-2026" }, { key: "diwali-hampers" }],
};

/** Desk, tech and office items read as corporate gifts, so personal occasions skip them. */
const CORPORATE_LOOK =
  /desk|laptop|clock|speaker|earphone|bluetooth|office|stationery|stand|\bled\b|mirror|\bpen\b|diary|notebook|power/i;
const PERSONAL_OCCASIONS = new Set(["wedding", "birthday", "baby-shower"]);

/** Fixed-seed shuffle, so server and browser render the same order. */
export function shuffled<T>(list: T[], seed: number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

export const catalogueTitle = (key: string) =>
  CATALOGUE_FILES.find((file) => file.href.endsWith(`/${key}.pdf`))?.title ?? "Catalogue";

/** The full catalogue page a product appears on. */
export const pageSrc = (product: CatalogueProduct) =>
  PAGES[product.key]?.find((page) => page.n === product.n)?.src;

export function occasionProducts(slug: string): CatalogueProduct[] {
  const seen = new Set<string>();
  return (OCCASION_SOURCES[slug] ?? [])
    .flatMap(({ key, prefixes }) =>
      CATALOGUE_PRODUCTS.filter(
        (product) =>
          product.key === key && (!prefixes || prefixes.includes(product.code.split("-")[1] ?? "")),
      ),
    )
    .filter((product) => {
      if (seen.has(product.code)) return false;
      seen.add(product.code);
      return !(PERSONAL_OCCASIONS.has(slug) && CORPORATE_LOOK.test(product.name));
    });
}

/** Catalogues that feed an occasion, for "browse the full catalogue" links. */
export const occasionCatalogues = (slug: string) =>
  (OCCASION_SOURCES[slug] ?? []).flatMap(({ key }) => {
    const file = CATALOGUE_FILES.find((item) => item.href.endsWith(`/${key}.pdf`));
    return file ? [file] : [];
  });
