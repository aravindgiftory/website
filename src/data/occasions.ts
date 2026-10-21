import type { Occasion } from "./types";
import { occasionPhoto } from "./media";

export const occasions: Occasion[] = [
  {
    slug: "wedding",
    name: "Wedding",
    tagline: "Thoughtful gifts for the people who celebrated your special day.",
    description:
      "Return gifts and welcome gifts for weddings, receptions and pre-wedding functions — traditional brass, decorative trays and curated sets that guests keep at home.",
    image: occasionPhoto("wedding"),
  },
  {
    slug: "birthday",
    name: "Birthday",
    tagline: "A little something to make the day memorable.",
    description:
      "Practical, everyday-beautiful gifting for birthdays of every age — drinkware, small decor and lighting that works for large guest lists.",
    image: occasionPhoto("birthday"),
  },
  {
    slug: "baby-shower",
    name: "Baby Shower",
    tagline: "Tiny beginnings deserve thoughtful gifts.",
    description:
      "Soft, gentle gifting for baby showers, naming ceremonies and first celebrations — ceramic sets, storage and keepsake pieces.",
    image: occasionPhoto("baby-shower"),
  },
  {
    slug: "housewarming",
    name: "Housewarming",
    tagline: "A warm gift for a new beginning.",
    description:
      "Gifts for griha pravesh and new homes — urlis, storage, serveware and decor that settle straight into a new kitchen or living room.",
    image: occasionPhoto("housewarming"),
  },
  {
    slug: "pooja-festive",
    name: "Pooja & Festive",
    tagline: "Traditional gifting with a contemporary touch.",
    description:
      "Diyas, pooja thalis, Pichwai-inspired pieces and dry fruit gifting for Diwali, festivals and pooja occasions.",
    image: occasionPhoto("pooja-festive"),
  },
  {
    slug: "corporate",
    name: "Corporate",
    tagline: "Thoughtful gifts for teams, clients and partners.",
    description:
      "Considered gifting for employees, clients and partners — desk pieces, flask sets, pen sets and festive hampers, in volume.",
    image: occasionPhoto("corporate"),
  },
];
