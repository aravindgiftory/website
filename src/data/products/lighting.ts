import type { Product } from "../types";
import { photos } from "../media";

export const lightingProducts: Product[] = [
  {
    slug: "golden-crystal-leaf-led-table-lamp",
    name: "Golden Crystal Leaf LED Table Lamp",
    code: "AG-801",
    description:
      "A table lamp with golden stem and crystal leaf detailing, lit by warm LEDs. A statement return gift.",
    collection: "lighting",
    type: "Lighting",
    occasions: ["wedding", "housewarming", "birthday"],
    image: photos.crystalLeafLamp,
    featured: true,
  },
  {
    slug: "crystal-table-lamp",
    name: "Crystal Table Lamp",
    code: "AG-802",
    description: "A crystal table lamp with a soft, warm glow.",
    collection: "lighting",
    type: "Lighting",
    occasions: ["wedding", "housewarming"],
    image: photos.crystalLeafLamp,
  },
  {
    slug: "led-candle-light-lamps",
    name: "LED Candle Light Lamps",
    code: "AG-803",
    description: "Flameless LED candle lamps, safe for large gatherings and easy to pack.",
    collection: "lighting",
    type: "Lighting",
    occasions: ["pooja-festive", "birthday", "wedding"],
    image: photos.crystalBallLight,
  },
  {
    slug: "bajrang-bali-3d-crystal-ball-night-light",
    name: "Bajrang Bali 3D Crystal Ball Night Light",
    code: "AG-804",
    description:
      "A crystal ball night light with a 3D Bajrang Bali engraving and an illuminated base.",
    collection: "lighting",
    type: "Lighting",
    occasions: ["pooja-festive", "housewarming"],
    image: photos.crystalBallLight,
    featured: true,
  },
];
