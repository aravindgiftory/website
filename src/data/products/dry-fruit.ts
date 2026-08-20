import type { Product } from "../types";
import { photos } from "../media";

export const dryFruitProducts: Product[] = [
  {
    slug: "dry-fruit-box",
    name: "Dry Fruit Box",
    code: "AG-301",
    description: "A compartmented dry fruit box, ready for festive and wedding gifting.",
    collection: "dry-fruit-gifts",
    type: "Gift Sets",
    occasions: ["pooja-festive", "wedding", "corporate"],
    image: photos.dryFruitBox,
    featured: true,
  },
  {
    slug: "metal-dry-fruit-boxes",
    name: "Metal Dry Fruit Boxes",
    code: "AG-302",
    description: "Metal dry fruit boxes with decorative lids, available across sizes.",
    collection: "dry-fruit-gifts",
    type: "Gift Sets",
    occasions: ["pooja-festive", "corporate"],
    image: photos.dryFruitBox,
  },
  {
    slug: "golden-basket-jars",
    name: "Golden Basket & Jars",
    code: "AG-303",
    description: "A golden basket presented with matching jars for dry fruit or sweets.",
    collection: "dry-fruit-gifts",
    type: "Gift Sets",
    occasions: ["pooja-festive", "wedding"],
    setInfo: "Basket with jars",
    image: photos.dryFruitBox,
  },
];
