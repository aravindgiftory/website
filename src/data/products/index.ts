import type { Product } from "../types";
import { corporateProducts } from "./corporate";
import { diningProducts } from "./dining";
import { dryFruitProducts } from "./dry-fruit";
import { homeDecorProducts } from "./home-decor";
import { kitchenProducts } from "./kitchen";
import { lightingProducts } from "./lighting";
import { pichwaiProducts } from "./pichwai";
import { poojaProducts } from "./pooja";
import { teaCoffeeProducts } from "./tea-coffee";
import { traditionalProducts } from "./traditional";

export const allProducts: Product[] = [
  ...traditionalProducts,
  ...pichwaiProducts,
  ...poojaProducts,
  ...homeDecorProducts,
  ...dryFruitProducts,
  ...corporateProducts,
  ...kitchenProducts,
  ...teaCoffeeProducts,
  ...diningProducts,
  ...lightingProducts,
];
