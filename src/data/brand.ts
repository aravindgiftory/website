export const BRAND = {
  name: "Aravind Giftory",
  city: "Hyderabad",
  phone: "+91 6309-645424",
  phoneHref: "tel:+916309645424",
  whatsapp: "916309645424",
  instagram: "aravindgiftory",
  instagramUrl: "https://instagram.com/aravindgiftory",
  tagline: "Thoughtful gifts for memorable occasions.",
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
