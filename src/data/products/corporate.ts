import type { Product } from "../types";
import { photos } from "../media";

export const corporateProducts: Product[] = [
  {
    slug: "personalized-doctor-gift-set",
    name: "Personalized Doctor Gift Set",
    code: "AG-401",
    description: "A professional gift set curated for doctors, with personalisation options.",
    collection: "corporate-gifts",
    type: "Gift Sets",
    occasions: ["corporate"],
    image: photos.occasionCorporate,
  },
  {
    slug: "executive-flask-gift-set",
    name: "Executive Flask Gift Set",
    code: "AG-402",
    description: "A flask presented as an executive gift set — a dependable corporate choice.",
    collection: "corporate-gifts",
    type: "Gift Sets",
    occasions: ["corporate"],
    image: photos.occasionCorporate,
    featured: true,
  },
  {
    slug: "premium-desk-clock-organizer",
    name: "Premium Desk Clock Organizer",
    code: "AG-403",
    description: "A desk clock and organiser in one piece, for office and client gifting.",
    collection: "corporate-gifts",
    type: "Gift Sets",
    occasions: ["corporate"],
    image: photos.occasionCorporate,
  },
  {
    slug: "doctor-signature-pen-keychain-set",
    name: "Doctor Signature Pen & Keychain Set",
    code: "AG-404",
    description: "A signature pen and keychain presented together in a gift box.",
    collection: "corporate-gifts",
    type: "Gift Sets",
    occasions: ["corporate"],
    setInfo: "Pen with keychain",
    image: photos.occasionCorporate,
  },
];
