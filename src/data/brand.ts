export const BRAND = {
  name: "Aravind Giftory",
  city: "Hyderabad",
  phone: "+91 6309-645424",
  phoneHref: "tel:+916309645424",
  whatsapp: "916309645424",
  instagram: "aravindgiftory",
  instagramUrl: "https://instagram.com/aravindgiftory",
  siteUrl: (import.meta.env.VITE_SITE_URL ?? "https://aravindgiftory.com").replace(/\/+$/, ""),
  /** Starting price per gift in ₹ and minimum order quantity, shown in the hero. */
  startingPrice: 150,
  minQuantity: 25,
  tagline: "Thoughtful gifts for memorable occasions.",
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
