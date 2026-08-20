/**
 * Catalogue barrel — pages import from here.
 *
 * Add a new gift: append it in src/data/products/{collection}.ts
 * Add a real photo: public/products/{slug}.jpg then set image: productPhoto("slug")
 * Add the designed PDF: public/catalogues/aravind-giftory-2026.pdf
 */

export type {
  Collection,
  CollectionSlug,
  EditorialEdit,
  Occasion,
  OccasionSlug,
  Product,
  ProductStatus,
  ProductType,
} from "./types";
export { BRAND, whatsappLink } from "./brand";
export { CATALOGUE_PDF_HREF, occasionPhoto, photos, productPhoto } from "./media";
export { collections } from "./collections";
export { occasions } from "./occasions";
export { edits } from "./edits";
export { allProducts } from "./products";

import type { CollectionSlug, OccasionSlug, Product, ProductType } from "./types";
import { collections } from "./collections";
import { occasions } from "./occasions";
import { allProducts } from "./products";

const bySort = (a: Product, b: Product) =>
  (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || a.name.localeCompare(b.name);

export const isListedProduct = (product: Product) => product.status !== "hidden";

export const products = allProducts.filter(isListedProduct).slice().sort(bySort);

export const productTypes: ProductType[] = [
  "Diya & Lamps",
  "Pooja",
  "Trays & Serveware",
  "Storage",
  "Drinkware",
  "Dining",
  "Lighting",
  "Decor",
  "Gift Sets",
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getOccasion = (slug: string) => occasions.find((o) => o.slug === slug);
export const productsByCollection = (slug: CollectionSlug) =>
  products.filter((p) => p.collection === slug);
export const productsByOccasion = (slug: OccasionSlug) =>
  products.filter((p) => p.occasions.includes(slug));
export const featuredProducts = products.filter((p) => p.featured);
export const getProductImages = (product: Product) =>
  product.images && product.images.length > 0 ? product.images : [product.image];
