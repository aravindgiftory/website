import { products } from "@/data/catalog";
import { PRODUCT_PAGES } from "@/lib/product-pages";

export interface SearchItem {
  /** "gift" links to /gift/<slug>, "product" to /products/<slug>. */
  kind: "gift" | "product";
  slug: string;
  name: string;
  code: string;
  image: string;
  /** Extra searchable text, such as a hamper's contents. */
  extra: string;
  nameKey: string;
  codeKey: string;
}

const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "");

const INDEX: SearchItem[] = [
  ...PRODUCT_PAGES.map((product): SearchItem => ({
    kind: "gift",
    slug: product.slug,
    name: product.name,
    code: product.code,
    image: product.image,
    extra: (product.details ?? []).join(" ").toLowerCase(),
    nameKey: product.name.toLowerCase(),
    codeKey: squash(product.code),
  })),
  // Cork planters and combos have real photographs and their own product pages.
  ...products
    .filter(
      (product) => typeof product.image === "string" && product.image.startsWith("/products/"),
    )
    .map((product): SearchItem => ({
      kind: "product",
      slug: product.slug,
      name: product.name,
      code: product.code,
      image: product.image as string,
      extra: [...(product.contents ?? []), product.description].join(" ").toLowerCase(),
      nameKey: product.name.toLowerCase(),
      codeKey: squash(product.code),
    })),
];

/**
 * Finds gifts by name or product code. Codes match however they are typed: "AG-CO-007",
 * "agco007", "ag co 007", or just the number part. Names match when every word appears.
 */
export function searchProducts(query: string, limit = 60): SearchItem[] {
  const text = query.trim().toLowerCase();
  if (text.length < 2) return [];
  const tokens = text.split(/\s+/).filter(Boolean);
  const key = squash(text);

  const scored: Array<{ item: SearchItem; score: number }> = [];
  for (const item of INDEX) {
    let score = 0;
    if (item.codeKey === key) score = 100;
    else if (key.length >= 2 && item.codeKey.startsWith(key)) score = 80;
    else if (key.length >= 3 && item.codeKey.includes(key)) score = 60;

    if (tokens.every((token) => item.nameKey.includes(token))) {
      score = Math.max(score, item.nameKey.startsWith(text) ? 55 : 40);
    } else if (score === 0 && tokens.every((token) => item.extra.includes(token))) {
      score = 15;
    }
    if (score > 0) scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export const SEARCH_TOTAL = INDEX.length;
