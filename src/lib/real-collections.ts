import productData from "@/data/catalogue-products.json";
import type { CatalogueProduct } from "@/components/site/CatalogueProductCard";

const PRODUCTS = productData as CatalogueProduct[];

export interface RealCollection {
  slug: string;
  name: string;
  description: string;
  /** Catalogue file key and, for the Luxury Gifting catalogue, the product-code groups it includes. */
  key: string;
  prefixes?: string[];
}

/**
 * Collections built from real catalogue products only. Hamper catalogues are grouped by budget;
 * the Luxury Gifting catalogue is split by what its product codes stand for.
 */
export const REAL_COLLECTIONS: RealCollection[] = [
  {
    slug: "hampers-under-1k",
    name: "Gift Hampers Under ₹1K",
    description: "Budget-friendly hampers for return gifts and thank-yous.",
    key: "gift-hampers-1k-2026",
  },
  {
    slug: "hampers-2k-3k",
    name: "Gift Hampers ₹2K–₹3K",
    description: "Premium hampers with mugs, gourmet treats and gadgets.",
    key: "gift-hampers-2k-3k-2026",
  },
  {
    slug: "hampers-5k-plus",
    name: "Luxury Hampers ₹5K+",
    description: "Statement hampers for the moments that matter most.",
    key: "gift-hampers-5k-plus-2026",
  },
  {
    slug: "snacks-munchies",
    name: "Snacks & Munchies",
    description: "Gourmet snack hampers made for sharing.",
    key: "snacks-munchies-hampers-2026",
  },
  {
    slug: "corporate-gift-sets",
    name: "Corporate Gift Sets",
    description: "Welcome kits and gift sets for teams, clients and partners.",
    key: "corporate-gifting-2026",
  },
  {
    slug: "brass-diyas-pooja",
    name: "Brass Diyas & Pooja",
    description: "Brass and crystal diyas, pooja plates and urlis.",
    key: "luxury-gifting-2026",
    prefixes: ["DY", "PL", "UR", "ID"],
  },
  {
    slug: "dry-fruit-boxes-serveware",
    name: "Dry Fruit Boxes & Serveware",
    description: "Dry fruit boxes, trays, jars, bowls and gift sets.",
    key: "luxury-gifting-2026",
    prefixes: ["DB", "TR", "JR", "BW", "GS", "DN"],
  },
  {
    slug: "drinkware-tea",
    name: "Drinkware & Tea Sets",
    description: "Flasks, mugs, tumblers and tea sets.",
    key: "luxury-gifting-2026",
    prefixes: ["FL", "MG", "TS"],
  },
  {
    slug: "storage-lunch-boxes",
    name: "Storage & Lunch Boxes",
    description: "Storage jars, canisters, tiffin and lunch boxes.",
    key: "luxury-gifting-2026",
    prefixes: ["ST", "LB", "KT"],
  },
];

export const collectionProducts = (collection: RealCollection): CatalogueProduct[] =>
  PRODUCTS.filter(
    (product) =>
      product.key === collection.key &&
      (!collection.prefixes || collection.prefixes.includes(product.code.split("-")[1] ?? "")),
  );
