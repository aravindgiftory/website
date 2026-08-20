import type { Product } from "../types";
import { photos } from "../media";

export const poojaProducts: Product[] = [
  {
    slug: "premium-pooja-thali",
    name: "Premium Pooja Thali",
    code: "AG-109",
    description: "A premium pooja thali with detailed metalwork, presented gift-ready.",
    collection: "pooja",
    type: "Pooja",
    occasions: ["pooja-festive", "wedding", "housewarming"],
    image: photos.occasionPooja,
  },
  {
    slug: "antique-brass-pooja-thali",
    name: "Antique Brass Pooja Thali",
    code: "AG-110",
    description: "An antique-finish brass pooja thali with traditional borders.",
    collection: "pooja",
    type: "Pooja",
    occasions: ["pooja-festive", "housewarming"],
    image: photos.occasionPooja,
  },
];
