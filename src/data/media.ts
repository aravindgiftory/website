/**
 * Media locations (no backend).
 *
 * Product / occasion / site photos
 *   Drop files here, then point `image` at the public URL:
 *     public/products/{slug}.jpg     →  /products/{slug}.jpg
 *     public/occasions/{slug}.jpg    →  /occasions/{slug}.jpg
 *     public/site/{name}.jpg         →  /site/{name}.jpg
 *
 * Designed catalogue PDF
 *   public/catalogues/aravind-giftory-2026.pdf  →  /catalogues/aravind-giftory-2026.pdf
 *   Once that file exists, download uses it automatically.
 *
 * Current JPGs live in src/assets. Real catalogue photos go in
 * public/products/{slug}.jpg (then set image: productPhoto("slug")).
 */

import brassDiya from "@/assets/product-brass-lotus-diya.jpg";
import pichwaiTray from "@/assets/product-pichwai-tray.jpg";
import crystalLeafLamp from "@/assets/product-crystal-leaf-lamp.jpg";
import ceramicTeaSet from "@/assets/product-ceramic-tea-set.jpg";
import floralDinnerSet from "@/assets/product-floral-dinner-set.jpg";
import storageContainers from "@/assets/product-storage-containers.jpg";
import traySet from "@/assets/product-tray-set.jpg";
import dryFruitBox from "@/assets/product-dry-fruit-box.jpg";
import crystalBallLight from "@/assets/product-crystal-ball-light.jpg";
import occasionWedding from "@/assets/occasion-wedding.jpg";
import occasionBirthday from "@/assets/occasion-birthday.jpg";
import occasionBaby from "@/assets/occasion-baby-shower.jpg";
import occasionHousewarming from "@/assets/occasion-housewarming.jpg";
import occasionPooja from "@/assets/occasion-pooja.jpg";
import occasionCorporate from "@/assets/occasion-corporate.jpg";

export const photos = {
  brassDiya,
  pichwaiTray,
  crystalLeafLamp,
  ceramicTeaSet,
  floralDinnerSet,
  storageContainers,
  traySet,
  dryFruitBox,
  crystalBallLight,
  occasionWedding,
  occasionBirthday,
  occasionBaby,
  occasionHousewarming,
  occasionPooja,
  occasionCorporate,
} as const;

/** Public URL after you add public/products/{slug}.jpg */
export const productPhoto = (slug: string) => `/products/${slug}.jpg`;

/** Public URL after you add public/occasions/{slug}.jpg */
export const occasionPhoto = (slug: string) => `/occasions/${slug}.jpg`;

/** Designed PDF — drop the file at this public path. */
export const CATALOGUE_PDF_HREF = "/catalogues/aravind-giftory-2026.pdf";

export interface CatalogueFile {
  /** URL slug of the catalogue's listing page: /gifts/{slug}. */
  slug: string;
  /** Product slug prefix shown as product cards on the listing page, when the catalogue has structured products. */
  productPrefix?: string;
  title: string;
  description: string;
  href: string;
  fileName: string;
  /** First page of the PDF, rendered as a 16:9 JPG. */
  cover: string;
}

/** The catalogues offered on the site. Files live in public/catalogues/. */
export const CATALOGUE_FILES: CatalogueFile[] = [
  {
    slug: "diwali-hampers",
    title: "Diwali Hampers Catalogue 2026",
    description: "Festive hampers and curated Diwali gifting.",
    href: "/catalogues/diwali-hampers-2026.pdf",
    fileName: "Aravind-Giftory-Diwali-Hampers-2026.pdf",
    cover: "/catalogues/diwali-hampers-2026.jpg",
  },
  {
    slug: "electronics-accessories",
    title: "Electronics & Accessories 2026–27",
    description: "Gadgets and accessories for modern gifting.",
    href: "/catalogues/electronics-accessories-2026-27.pdf",
    fileName: "Aravind-Giftory-Electronics-Accessories-2026-27.pdf",
    cover: "/catalogues/electronics-accessories-2026-27.jpg",
  },
  {
    slug: "gift-sets",
    title: "Gift Sets Catalogue 2026–27",
    description: "Ready-to-give gift sets for every occasion.",
    href: "/catalogues/gift-sets.pdf",
    fileName: "Aravind-Giftory-Gift-Sets-2026-27.pdf",
    cover: "/catalogues/gift-sets.jpg",
  },
  {
    slug: "festive-cork-gifting",
    productPrefix: "cork-combo-",
    title: "Festive Cork Gifting Catalogue 2026",
    description: "Sustainable cork gifts for Diwali, corporates, clients and loved ones.",
    href: "/catalogues/festive-cork-gifting-2026.pdf",
    fileName: "Aravind-Giftory-Festive-Cork-Gifting-2026.pdf",
    cover: "/catalogues/festive-cork-gifting-2026.jpg",
  },
  {
    slug: "home-fragrance",
    title: "Home Fragrance Collection 2026–27",
    description: "Reed diffusers, candles, aroma diffusers and fragrance gift sets.",
    href: "/catalogues/home-fragrance-2026-27.pdf",
    fileName: "Aravind-Giftory-Home-Fragrance-2026-27.pdf",
    cover: "/catalogues/home-fragrance-2026-27.jpg",
  },
  {
    slug: "drinkware-barware",
    title: "Drinkware & Barware 2026–27",
    description: "Drinkware and barware for bulk, corporate and festive gifting.",
    href: "/catalogues/drinkware-barware-2026-27.pdf",
    fileName: "Aravind-Giftory-Drinkware-Barware-2026-27.pdf",
    cover: "/catalogues/drinkware-barware-2026-27.jpg",
  },
  {
    slug: "corporate-festive-gifting",
    title: "Corporate & Festive Gifting 2026",
    description:
      "Diwali candles, diffusers, gift sets and boxes for teams, clients and celebrations.",
    href: "/catalogues/corporate-festive-gifting-2026.pdf",
    fileName: "Aravind-Giftory-Corporate-Festive-Gifting-2026.pdf",
    cover: "/catalogues/corporate-festive-gifting-2026.jpg",
  },
  {
    slug: "cork-planters",
    productPrefix: "cork-planter-",
    title: "Cork Planters Catalogue 2026",
    description: "Test tube, tabletop and wall planters in natural cork, 43 designs.",
    href: "/catalogues/cork-planters-2026.pdf",
    fileName: "Aravind-Giftory-Cork-Planters-2026.pdf",
    cover: "/catalogues/cork-planters-2026.jpg",
  },
];

/** Key of each catalogue in src/data/catalogue-pages.json (the PDF's file name). */
export const catalogueKey = (file: CatalogueFile) =>
  file.href.replace("/catalogues/", "").replace(".pdf", "");
