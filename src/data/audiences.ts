import type { FaqItem } from "@/components/site/Faq";
import { BRAND } from "./brand";

/**
 * Landing-page copy for the four buyer groups. Every statement comes from information already on
 * the site: the 25-piece minimum, the ₹150 starting price, the budget tiers of the hamper
 * catalogues, brand-ready corporate sets, gift message cards and Hyderabad packing and delivery.
 * No turnaround times, discounts, invoicing terms or past clients are claimed.
 */

export interface Audience {
  slug: string;
  /** Short label for navigation and links. */
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  needs: Array<{ title: string; text: string }>;
  /** Slugs of collections in `real-collections.ts`. */
  collections: string[];
  /** Slugs of catalogues in `media.ts` offered to this group. */
  catalogues: string[];
  /** What the buyer should send us to get a precise quote. */
  checklist: string[];
  /** How the buyer introduces themselves in a WhatsApp message, e.g. "a wedding planner". */
  persona: string;
  /** Used to pre-fill the occasion field and the WhatsApp message. */
  occasion: string;
  corporate: boolean;
  faqs: FaqItem[];
}

const MIN = `${BRAND.minQuantity} pieces`;

export const AUDIENCES: Audience[] = [
  {
    slug: "wedding-planners",
    name: "Wedding planners",
    title: "Wedding Return Gifts for Planners in Hyderabad",
    description:
      "Bulk wedding return gifts for planners in Hyderabad: hampers from ₹2K to ₹5K+, brass dry fruit boxes and gift sets, with contents listed for every product.",
    h1: "Return gifts for the weddings you plan",
    intro: [
      "A wedding usually means several guest lists, several budgets and one delivery date. This page is for planners who need to shortlist return gifts quickly, show families real products with real contents, and place one clear order.",
      `${BRAND.name} supplies gift hampers by budget and brass dry fruit boxes from ${BRAND.city}. Orders start at ${MIN}, and every hamper page lists what is packed inside, so your clients know exactly what their guests receive.`,
    ],
    needs: [
      {
        title: "Gifts grouped by budget",
        text: "Our hamper catalogues are split into ₹2K–₹3K and ₹5K and above, so you can match a gift to each function's budget.",
      },
      {
        title: "Contents you can show a family",
        text: "Each hamper page lists every item inside, from tea and coffee to dry fruits and candles, so there are no surprises.",
      },
      {
        title: "Traditional options too",
        text: "Brass dry fruit boxes and gift sets from the Luxury Gifting collection suit pooja, mehendi and sangeet moments.",
      },
    ],
    collections: [
      "hampers-2k-3k",
      "hampers-5k-plus",
      "dry-fruit-boxes-serveware",
      "hampers-under-1k",
    ],
    catalogues: ["gift-hampers-2k-3k", "gift-hampers-5k-plus", "luxury-gifting"],
    checklist: [
      "Number of guests for each function",
      "Budget per gift",
      "Delivery date and venue city",
      "Any colour or style preference",
    ],
    persona: "a wedding planner",
    occasion: "Wedding",
    corporate: false,
    faqs: [
      {
        question: "Can I plan different gifts for different functions?",
        answer:
          "Yes. Tell us each function, the guest count and the budget per gift, and we'll suggest options for each one so you can present a single shortlist to the family.",
      },
      {
        question: "How do I show gift options to my client?",
        answer:
          "Share the product page links or download the hamper catalogues. Every product page shows the photo, code and full contents, and View details opens the original catalogue page.",
      },
      {
        question: "What should I send to get a quote?",
        answer: `Send the guest count per function, your budget per gift, the delivery date and the city. Orders start at ${MIN}.`,
      },
    ],
  },
  {
    slug: "families",
    name: "Families",
    title: "Return Gifts for Family Functions in Hyderabad",
    description:
      "Return gifts for baby showers, naming ceremonies, housewarmings, birthdays and family weddings in Hyderabad. Hampers from under ₹1K, with contents listed.",
    h1: "Return gifts for your family's celebrations",
    intro: [
      "Hosting a function is busy enough. Start with your budget per guest, look through hampers with every item listed, and tell us the date. We'll take it from there.",
      `Whether it is a baby shower, a naming ceremony, a housewarming or a birthday, orders start at ${MIN} and gifts start from ₹${BRAND.startingPrice} each. Hampers are packed and delivered from ${BRAND.city}.`,
    ],
    needs: [
      {
        title: "Start from your budget",
        text: "Browse hampers under ₹1K, ₹2K–₹3K and ₹5K and above, and open any one to see exactly what is inside.",
      },
      {
        title: "Gifts guests actually use",
        text: "Tea, coffee, snacks, dry fruits, candles and mugs, plus brass bowls and trays for traditional functions.",
      },
      {
        title: "A message card with the gift",
        text: "Our hampers include a gift message card, so your thank-you travels with the gift.",
      },
    ],
    collections: [
      "hampers-under-1k",
      "hampers-2k-3k",
      "brass-diyas-pooja",
      "dry-fruit-boxes-serveware",
    ],
    catalogues: [
      "gift-hampers-1k",
      "gift-hampers-2k-3k",
      "luxury-gifting",
      "snacks-munchies-hampers",
    ],
    checklist: [
      "The occasion and the date",
      "Number of guests",
      "Budget per gift",
      "Anything you'd like on the message card",
    ],
    persona: "planning a family function",
    occasion: "Baby Shower",
    corporate: false,
    faqs: [
      {
        question: "Which gifts suit a baby shower or naming ceremony?",
        answer:
          "Our under ₹1K and ₹2K–₹3K hampers, with snacks, dry fruits, tea and coffee, candles and mugs, are popular choices to shortlist. Open a hamper to see the full contents.",
      },
      {
        question: "Is there a minimum number of gifts?",
        answer: `Orders start at ${MIN}. If you need fewer, message us and we'll tell you what is possible.`,
      },
      {
        question: "Can I add a personal note?",
        answer:
          "Our hampers include a gift message card. Tell us what you'd like it to say when you enquire.",
      },
    ],
  },
  {
    slug: "hr-teams",
    name: "HR teams",
    title: "Employee Gifts & Welcome Kits for HR, Hyderabad",
    description:
      "Welcome kits and festive hampers for employees in Hyderabad. Browse corporate gift sets with contents listed, and request a bulk quote from 25 pieces.",
    h1: "Employee gifts and welcome kits, ordered in one go",
    intro: [
      "New joiners, festivals and team milestones all come with a gifting list. This page helps HR teams pick a gift set, check exactly what it contains, and send one enquiry with headcount and budget.",
      `Corporate gift sets in our catalogue include notebooks, flasks, mugs, power banks and pens, and many are designed for logo branding. Orders start at ${MIN}, packed and delivered from ${BRAND.city}.`,
    ],
    needs: [
      {
        title: "Welcome kits for new joiners",
        text: "Ready-to-give sets such as 4-in-1 to 8-in-1 kits, each listing its contents so you can compare quickly.",
      },
      {
        title: "Festive gifting for the whole team",
        text: "Hampers by budget and Diwali gift options, so one order covers the whole headcount.",
      },
      {
        title: "Branding where it matters",
        text: "Many corporate sets are made for logo branding. Tell us your requirement and we'll confirm the options for your quantity.",
      },
    ],
    collections: ["corporate-gift-sets", "hampers-2k-3k", "snacks-munchies", "hampers-under-1k"],
    catalogues: ["corporate-gifting", "corporate-festive-gifting", "snacks-munchies-hampers"],
    checklist: [
      "Headcount and number of locations",
      "Budget per employee",
      "Whether you need logo branding",
      "Delivery date",
    ],
    persona: "from an HR team",
    occasion: "Corporate",
    corporate: true,
    faqs: [
      {
        question: "Can gifts be branded with our company logo?",
        answer:
          "Many corporate gift sets are designed for logo branding. Tell us which set you like and your quantity, and we'll confirm what is possible.",
      },
      {
        question: "How do we choose between sets?",
        answer:
          "Open any set to see its contents, then compare against your budget per employee. Message us your headcount and budget for a shortlist.",
      },
      {
        question: "What do you need to quote for a team order?",
        answer: `Headcount, budget per employee, branding needs and the delivery date. Orders start at ${MIN}.`,
      },
    ],
  },
  {
    slug: "corporate-buyers",
    name: "Corporate buyers",
    title: "Corporate Client Gifts in Bulk, Hyderabad",
    description:
      "Client and partner gifting for procurement teams in Hyderabad: corporate gift sets, premium hampers and drinkware in bulk, with contents and codes for every item.",
    h1: "Corporate gifts for clients and partners",
    intro: [
      "Procurement and client-facing teams need gifts that look considered, fit a budget band and can be reordered by code. Every product here has a code, a photo and a contents list, so you can compare and re-specify with confidence.",
      `Choose from corporate gift sets, premium hampers and drinkware, in bulk from ${MIN}. Packed and delivered from ${BRAND.city}.`,
    ],
    needs: [
      {
        title: "Every item has a code",
        text: "Quote by product code, share it with colleagues and reorder the same set later without re-describing it.",
      },
      {
        title: "Budget bands for every audience",
        text: "Hampers at ₹2K–₹3K and ₹5K and above for clients and partners, with corporate sets for wider teams.",
      },
      {
        title: "Practical, usable gifts",
        text: "Flasks, notebooks, mugs and power banks that stay on a desk, alongside gourmet hampers.",
      },
    ],
    collections: ["corporate-gift-sets", "hampers-5k-plus", "hampers-2k-3k", "drinkware-tea"],
    catalogues: [
      "corporate-gifting",
      "corporate-festive-gifting",
      "electronics-accessories",
      "drinkware-barware",
    ],
    checklist: [
      "Product codes or the set you prefer",
      "Quantity and budget per gift",
      "Branding requirements",
      "Delivery date and address city",
    ],
    persona: "a corporate buyer",
    occasion: "Corporate",
    corporate: true,
    faqs: [
      {
        question: "Can we order by product code?",
        answer:
          "Yes. Every catalogue product has a code, shown on its page. Send us the codes and your quantity and we'll confirm pricing.",
      },
      {
        question: "Do you offer different budget levels?",
        answer:
          "Our hamper catalogues are grouped under ₹1K, ₹2K–₹3K and ₹5K and above, and corporate sets cover a range of price points. Share your budget per gift for a shortlist.",
      },
      {
        question: "Where do you deliver from?",
        answer: `We pack and deliver from ${BRAND.city}. Tell us your delivery date and city and we'll confirm what is possible.`,
      },
    ],
  },
];

export const getAudience = (slug: string) => AUDIENCES.find((item) => item.slug === slug);
