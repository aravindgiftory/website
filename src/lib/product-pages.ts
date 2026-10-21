import productData from "@/data/catalogue-products.json";
import { REAL_COLLECTIONS, collectionProducts, type RealCollection } from "@/lib/real-collections";
import { catalogueTitle } from "@/lib/occasion-products";
import type { CatalogueProduct } from "@/components/site/CatalogueProductCard";
import { BRAND } from "@/data/brand";

export interface ProductPage extends CatalogueProduct {
  slug: string;
  details?: string[];
}

const RAW = productData as Array<CatalogueProduct & { details?: string[] }>;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** One page per product code. A code listed in two catalogues keeps its first listing. */
const byCode = new Map<string, ProductPage>();
for (const product of RAW) {
  if (byCode.has(product.code)) continue;
  byCode.set(product.code, {
    ...product,
    slug: `${slugify(product.code)}-${slugify(product.name)}`.slice(0, 90).replace(/-+$/, ""),
  });
}

export const PRODUCT_PAGES = [...byCode.values()];
const bySlug = new Map(PRODUCT_PAGES.map((product) => [product.slug, product]));

export const getProductPage = (slug: string) => bySlug.get(slug);
export const productPageSlug = (code: string) => byCode.get(code)?.slug;

/** A page earns a place in search results only when it says more than a name and a code. */
export const isSubstantial = (product: ProductPage) => (product.details?.length ?? 0) >= 2;

export const collectionOf = (product: ProductPage): RealCollection | undefined =>
  REAL_COLLECTIONS.find((collection) =>
    collectionProducts(collection).some((item) => item.code === product.code),
  );

export const relatedProducts = (product: ProductPage, count = 8): ProductPage[] => {
  const collection = collectionOf(product);
  const pool = collection ? collectionProducts(collection) : [];
  return pool
    .filter((item) => item.code !== product.code)
    .map((item) => byCode.get(item.code))
    .filter((item): item is ProductPage => Boolean(item))
    .slice(0, count);
};

const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 0))}…`;
};

/** Meta description of about 150 characters: name, contents when known, and the ordering hook. */
export const productDescription = (product: ProductPage) => {
  const items = (product.details ?? []).filter((line) => !/^product type:/i.test(line));
  const hook = `Bulk orders from ${BRAND.minQuantity} pieces. ${BRAND.name}, ${BRAND.city}.`;
  const head = `${product.name} (${product.code}).`;
  const room = 158 - head.length - hook.length - 2;
  const includes =
    items.length > 0 && room > 30
      ? `Includes ${clip(items.slice(0, 3).join(", "), room - 10)}.`
      : "";
  return [head, includes, hook].filter(Boolean).join(" ");
};

/** Page title: name and code when it fits, otherwise just the name. */
export const productTitle = (product: ProductPage) => {
  const full = `${product.name} (${product.code}) | ${BRAND.name}`;
  return full.length <= 65 ? full : clip(`${product.name} | ${BRAND.name}`, 65);
};
