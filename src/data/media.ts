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
