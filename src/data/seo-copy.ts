import { BRAND } from "./brand";
import type { FaqItem } from "@/components/site/Faq";

/**
 * Buyer-question copy for landing pages. Every statement comes from business data already on the
 * site (minimum order, starting price, catalogue contents, ordering steps). Nothing here promises
 * delivery times, stock or discounts.
 */

const ORDERING: FaqItem = {
  question: "How do I get a quote?",
  answer:
    "Share the occasion, approximate quantity, budget per gift and event date through the enquiry form, or message us on WhatsApp. We confirm pricing for your quantity, then pack and deliver.",
};

const MINIMUM: FaqItem = {
  question: "What is the minimum order and starting price?",
  answer: `Orders start at ${BRAND.minQuantity} pieces, and gifts start from ₹${BRAND.startingPrice} each. Final pricing depends on the gift and your quantity, so send us your requirement and we'll confirm it. Smaller needs are welcome too: message us and we'll tell you what we can do.`,
};

const DELIVERY: FaqItem = {
  question: "Where do you deliver from, and how do I plan timing?",
  answer: `We pack and deliver from ${BRAND.city}. Tell us your event date when you enquire and we'll confirm what is possible for your order.`,
};

const CUSTOMISE: FaqItem = {
  question: "Can the gifts be customised or branded?",
  answer:
    "Many of our corporate gift sets are made for logo branding, and our hampers include a gift message card. Tell us what you have in mind and we'll confirm the options for your quantity.",
};

const BUDGET: FaqItem = {
  question: "What budgets do you cover?",
  answer:
    "Our hamper catalogues are grouped by budget: under ₹1K, ₹2K–₹3K and ₹5K and above. Tell us your budget per gift and we'll suggest options that fit.",
};

const OCCASION_SPECIFIC: Record<string, FaqItem> = {
  wedding: {
    question: "What wedding return gifts do you offer?",
    answer:
      "Gift hampers from our ₹2K–₹3K and ₹5K+ catalogues, plus brass dry fruit boxes and gift sets from the Luxury Gifting collection. Open any product to see its catalogue page, then enquire with your quantity.",
  },
  birthday: {
    question: "What suits birthday return gifts?",
    answer:
      "Snack and munchies hampers and gift hampers, including options under ₹1K, with tea, coffee, dry fruits, mugs and chocolates. Browse the catalogue pages and enquire with your guest count.",
  },
  "baby-shower": {
    question: "What do you offer for baby showers and naming ceremonies?",
    answer:
      "Gift hampers from our under ₹1K and ₹2K–₹3K catalogues, with snacks, dry fruits, tea and coffee, candles and mugs. Share your guest count and budget and we'll shortlist options.",
  },
  housewarming: {
    question: "What traditional gifts do you have for housewarming?",
    answer:
      "Brass bowls, jars, trays and serveware from our Luxury Gifting collection, along with cork planters. They suit griha pravesh and new-home gifting, in quantity.",
  },
  "pooja-festive": {
    question: "What do you have for Diwali and pooja gifting?",
    answer:
      "Brass and crystal diyas, pooja plates and urlis from the Luxury Gifting collection, our Diwali Hampers catalogue and festive cork gift combos.",
  },
  corporate: {
    question: "What corporate gifts do you offer?",
    answer:
      "Welcome kits and gift sets with notebooks, flasks, mugs, power banks, pens and desk accessories, plus festive hampers, in volume for teams, clients and partners.",
  },
};

export const occasionFaqs = (slug: string): FaqItem[] => {
  const specific = OCCASION_SPECIFIC[slug];
  return [...(specific ? [specific] : []), MINIMUM, ORDERING, CUSTOMISE, DELIVERY];
};

export const homeFaqs: FaqItem[] = [
  {
    question: "Do you supply bulk return gifts in Hyderabad?",
    answer: `Yes. ${BRAND.name} is based in ${BRAND.city} and supplies return gifts and hampers in quantity for weddings, baby showers, housewarmings, birthdays, festivals and corporate events, with a minimum order of ${BRAND.minQuantity} pieces.`,
  },
  MINIMUM,
  BUDGET,
  ORDERING,
  CUSTOMISE,
  DELIVERY,
];

export const corporateFaqs: FaqItem[] = [
  OCCASION_SPECIFIC["corporate"] as FaqItem,
  MINIMUM,
  CUSTOMISE,
  BUDGET,
  ORDERING,
  DELIVERY,
];

/** Search-intent titles and descriptions (keyword hypotheses, to be checked in Search Console). */
export const OCCASION_SEO: Record<string, { title: string; description: string }> = {
  wedding: {
    title: "Wedding Return Gifts in Hyderabad",
    description:
      "Wedding return gifts and hampers in bulk from Aravind Giftory, Hyderabad. Browse real catalogue products by budget and enquire with your quantity and date.",
  },
  birthday: {
    title: "Birthday Return Gifts in Hyderabad",
    description:
      "Birthday return gift hampers in bulk, including options under ₹1K. Browse the catalogue and enquire with your guest count.",
  },
  "baby-shower": {
    title: "Baby Shower & Naming Ceremony Return Gifts",
    description:
      "Return gift hampers for baby showers and naming ceremonies from Aravind Giftory, Hyderabad. Choose by budget and request a bulk quote.",
  },
  housewarming: {
    title: "Housewarming & Traditional Gifts in Hyderabad",
    description:
      "Brass bowls, jars, trays and cork planters for housewarming and griha pravesh gifting, in bulk, from Aravind Giftory, Hyderabad.",
  },
  "pooja-festive": {
    title: "Diwali, Pooja & Festive Gifts in Hyderabad",
    description:
      "Brass and crystal diyas, pooja plates, urlis and festive hampers for Diwali and pooja gifting, in bulk, from Aravind Giftory, Hyderabad.",
  },
  corporate: {
    title: "Corporate Gifting in Hyderabad",
    description:
      "Corporate gift sets, welcome kits and festive hampers in bulk for teams, clients and partners, from Aravind Giftory, Hyderabad. Request a corporate quote.",
  },
};
