import type { EditorialEdit } from "./types";
import { photos } from "./media";

export const edits: EditorialEdit[] = [
  {
    title: "Traditional Edit",
    description: "Brass, diya, pooja and Pichwai-inspired gifting.",
    collection: "traditional",
    image: photos.brassDiya,
  },
  {
    title: "Home Edit",
    description: "Decorative and practical home gifting.",
    collection: "home-decor",
    image: photos.occasionHousewarming,
  },
  {
    title: "Table Edit",
    description: "Tea, coffee, dining and serving collections.",
    collection: "dining",
    image: photos.floralDinnerSet,
  },
  {
    title: "Light Edit",
    description: "Decorative lamps and candle lighting.",
    collection: "lighting",
    image: photos.crystalLeafLamp,
  },
  {
    title: "Gift Sets",
    description: "Curated professional and occasion-based gift sets.",
    collection: "corporate-gifts",
    image: photos.occasionCorporate,
  },
];
