import type { Collection } from "./types";
import { photos } from "./media";

export const collections: Collection[] = [
  {
    slug: "traditional",
    name: "Traditional Collection",
    description: "Brass diyas, urlis and heritage forms, made for gifting.",
    image: photos.brassDiya,
  },
  {
    slug: "pichwai",
    name: "Pichwai Collection",
    description: "Pichwai-inspired trays, jars and containers in printed metal.",
    image: photos.pichwaiTray,
  },
  {
    slug: "pooja",
    name: "Pooja Collection",
    description: "Thalis, diyas and pooja essentials for festive gifting.",
    image: photos.occasionPooja,
  },
  {
    slug: "dry-fruit-gifts",
    name: "Dry Fruit Gifts",
    description: "Metal boxes, baskets and jars for dry fruit gifting.",
    image: photos.dryFruitBox,
  },
  {
    slug: "kitchen-storage",
    name: "Kitchen & Storage",
    description: "Airtight containers, spice sets and everyday kitchen gifting.",
    image: photos.storageContainers,
  },
  {
    slug: "tea-coffee",
    name: "Tea & Coffee",
    description: "Ceramic tea sets, mugs and espresso cups.",
    image: photos.ceramicTeaSet,
  },
  {
    slug: "dining",
    name: "Dining",
    description: "Dinner sets, serving bowls and plated tray sets.",
    image: photos.floralDinnerSet,
  },
  {
    slug: "lighting",
    name: "Lighting",
    description: "Decorative table lamps, LED candles and night lights.",
    image: photos.crystalLeafLamp,
  },
  {
    slug: "home-decor",
    name: "Home Decor",
    description: "Urlis, candle containers and printed serving pieces.",
    image: photos.occasionHousewarming,
  },
  {
    slug: "corporate-gifts",
    name: "Corporate Gifts",
    description: "Desk, flask and pen sets for professional gifting.",
    image: photos.occasionCorporate,
  },
];
