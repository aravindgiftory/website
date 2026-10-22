export type OccasionSlug =
  "wedding" | "birthday" | "baby-shower" | "housewarming" | "pooja-festive" | "corporate";

export type CollectionSlug =
  | "traditional"
  | "pichwai"
  | "pooja"
  | "dry-fruit-gifts"
  | "kitchen-storage"
  | "tea-coffee"
  | "dining"
  | "lighting"
  | "home-decor"
  | "corporate-gifts";

export type ProductType =
  | "Diya & Lamps"
  | "Pooja"
  | "Trays & Serveware"
  | "Storage"
  | "Drinkware"
  | "Dining"
  | "Lighting"
  | "Decor"
  | "Gift Sets";

export type ProductStatus = "active" | "coming-soon" | "hidden";

export interface Product {
  slug: string;
  name: string;
  /** Temporary internal identifier — replace with the final SKU. */
  code: string;
  description: string;
  collection: CollectionSlug;
  type: ProductType;
  occasions: OccasionSlug[];
  setInfo?: string;
  /** What is inside a set or combo, one item per entry. */
  contents?: string[];
  image: string;
  images?: string[];
  featured?: boolean;
  /** Omit or "active" to list. "hidden" is excluded from the site. */
  status?: ProductStatus;
  minQuantity?: number;
  sortOrder?: number;
  relatedSlugs?: string[];
  material?: string;
}

export interface Occasion {
  slug: OccasionSlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface Collection {
  slug: CollectionSlug;
  name: string;
  description: string;
  image: string;
}

export interface EditorialEdit {
  title: string;
  description: string;
  collection: CollectionSlug;
  image: string;
}
