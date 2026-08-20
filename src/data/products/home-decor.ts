import type { Product } from "../types";
import { photos } from "../media";

export const homeDecorProducts: Product[] = [
  {
    slug: "brass-plated-peacock-urli",
    name: "Brass Plated Peacock Urli",
    code: "AG-108",
    description:
      "A brass-plated urli with peacock detailing, for floating flowers and diyas at the entrance of a home.",
    collection: "home-decor",
    type: "Decor",
    occasions: ["housewarming", "wedding", "pooja-festive"],
    image: photos.occasionHousewarming,
  },
  {
    slug: "premium-printed-iron-serving-tray",
    name: "Premium Printed Iron Serving Tray",
    code: "AG-207",
    description: "A printed iron serving tray with a premium finish.",
    collection: "home-decor",
    type: "Trays & Serveware",
    occasions: ["housewarming", "wedding"],
    image: photos.traySet,
  },
  {
    slug: "mandala-printed-metal-candle-container",
    name: "Mandala Printed Metal Candle Container",
    code: "AG-805",
    description: "A metal candle container carrying a mandala print.",
    collection: "home-decor",
    type: "Decor",
    occasions: ["pooja-festive", "housewarming", "birthday"],
    image: photos.crystalBallLight,
  },
];
