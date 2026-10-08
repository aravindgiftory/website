import { BRAND, whatsappLink } from "@/data/catalog";
import { CATALOGUE_FILES } from "@/data/media";

/**
 * Lead capture contract.
 *
 * Every form produces a `Lead`. `submitLead` emails it via Google Apps Script
 * (Gmail) and opens a pre-filled WhatsApp message at the same time.
 */

export type LeadSource = "catalogue" | "corporate" | "bulk-quote" | "product-enquiry" | "contact";

export interface Lead {
  source: LeadSource;
  firstName: string;
  lastName?: string | undefined;
  phone: string;
  email?: string | undefined;
  company?: string | undefined;
  lookingFor?: string | undefined;
  /** Which catalogue the visitor asked for (catalogue form only). */
  catalogueChoice?: string | undefined;
  occasion?: string | undefined;
  quantity?: string | undefined;
  budget?: string | undefined;
  eventDate?: string | undefined;
  message?: string | undefined;
  /** Product name/code when the lead came from a single-product enquiry. */
  productName?: string | undefined;
  productCode?: string | undefined;
  /** Multi-product enquiry tray — grows as the catalogue grows. */
  products?: Array<{ slug: string; name: string; code: string; image?: string }> | undefined;
  consent: boolean;
  /** Honeypot — must stay empty; filled only by bots. */
  website?: string | undefined;
  submittedAt: string;
  pageUrl: string;
  /** Site origin, so the email script can build product links from slugs. */
  siteUrl?: string | undefined;
}

export type LeadResult = { ok: true } | { ok: false; error: string };

/** Public link to a product page, for WhatsApp and email. Empty when there is no slug. */
export const productUrl = (slug: string | undefined) =>
  slug ? `${BRAND.siteUrl}/products/${slug}` : "";

export function formatLeadWhatsApp(lead: Lead) {
  const lines = [
    `Hi ${BRAND.name}, I'd like help with gifting.`,
    "",
    `Source: ${lead.source}`,
    `Name: ${[lead.firstName, lead.lastName].filter(Boolean).join(" ")}`,
    `Phone: ${lead.phone}`,
  ];
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.company) lines.push(`Company: ${lead.company}`);
  if (lead.lookingFor) lines.push(`Looking for: ${lead.lookingFor}`);
  if (lead.catalogueChoice) lines.push(`Catalogue: ${lead.catalogueChoice}`);
  if (lead.occasion) lines.push(`Occasion: ${lead.occasion}`);
  if (lead.quantity) lines.push(`Quantity: ${lead.quantity}`);
  if (lead.budget) lines.push(`Budget per gift: ${lead.budget}`);
  if (lead.eventDate) lines.push(`Event date: ${lead.eventDate}`);

  const listed =
    lead.products && lead.products.length > 0
      ? lead.products.map((item) => ({
          label: `${item.name} (${item.code})`,
          link: productUrl(item.slug) || lead.pageUrl,
        }))
      : lead.productName
        ? [
            {
              label: `${lead.productName}${lead.productCode ? ` (${lead.productCode})` : ""}`,
              link: lead.pageUrl,
            },
          ]
        : [];
  if (listed.length > 0) {
    lines.push("", "Products:");
    listed.forEach((item) => {
      lines.push(`• ${item.label}`);
      if (item.link) lines.push(`  ${item.link}`);
    });
  } else if (lead.pageUrl) {
    lines.push("", `Page: ${lead.pageUrl}`);
  }
  if (lead.message) {
    lines.push("", lead.message);
  }
  return lines.join("\n");
}

export async function submitLead(lead: Lead): Promise<LeadResult> {
  try {
    if (lead.website) return { ok: true }; // honeypot tripped — silently drop
    if (import.meta.env.DEV) console.info("[lead]", lead);

    if (typeof window !== "undefined") {
      window.open(whatsappLink(formatLeadWhatsApp(lead)), "_blank", "noopener,noreferrer");
    }

    const scriptUrl = import.meta.env.VITE_LEADS_SCRIPT_URL?.trim();
    if (!scriptUrl) {
      if (import.meta.env.DEV) {
        console.warn(
          "[lead] VITE_LEADS_SCRIPT_URL is empty — Gmail was skipped. Put the URL in .env (not .env.example) and restart npm run dev.",
        );
      }
      return { ok: true };
    }

    const payload = await attachThumbnails({ ...lead, siteUrl: BRAND.siteUrl });
    const json = JSON.stringify(payload);
    const encoded = encodeURIComponent(json);
    // Apps Script GET URLs truncate around 8KB. Prefer GET (POST bodies are often dropped on Google's redirect).
    if (encoded.length < 6200) {
      const url = new URL(scriptUrl);
      url.searchParams.set("payload", json);
      fetch(url.toString(), { method: "GET", mode: "no-cors", keepalive: true }).catch(
        () => undefined,
      );
    } else {
      fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: json,
        keepalive: true,
      }).catch(() => undefined);
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "We couldn't send your details. Please try again." };
  }
}

const GET_PAYLOAD_MAX = 6200;

async function attachThumbnails(payload: Lead) {
  if (typeof window === "undefined") return payload;

  const listed = payload.products?.length
    ? payload.products
    : payload.productName
      ? [{ slug: "", name: payload.productName, code: payload.productCode || "", image: undefined }]
      : [];
  if (!listed.length) return payload;

  const thumbs = await Promise.all(listed.map((item) => makeThumb(item.image, 40, 0.32)));
  let products = listed.map((item, index) => ({
    slug: item.slug,
    name: item.name,
    code: item.code,
    thumb: thumbs[index] || "",
  }));

  let next: Lead = { ...payload, products };
  // Drop trailing thumbs until the GET URL will fit.
  while (
    encodeURIComponent(JSON.stringify(next)).length >= GET_PAYLOAD_MAX &&
    products.some((item) => item.thumb)
  ) {
    let index = -1;
    for (let i = products.length - 1; i >= 0; i--) {
      if (products[i]?.thumb) {
        index = i;
        break;
      }
    }
    products = products.map((item, i) => (i === index ? { ...item, thumb: "" } : item));
    next = { ...payload, products };
  }

  if (import.meta.env.DEV) {
    products.forEach((item) => {
      if (!item.thumb) console.warn("[lead] no photo attached for", item.code || item.name);
    });
  }
  return next;
}

async function makeThumb(src: string | undefined, size: number, quality: number) {
  if (!src) return "";
  try {
    const url =
      src.startsWith("http") || src.startsWith("data:")
        ? src
        : new URL(src, window.location.origin).href;
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const scale = Math.max(size / image.width, size / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return "";
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

export type SelectOption = string | { label: string; comingSoon?: boolean };

export const optionLabel = (option: SelectOption) =>
  typeof option === "string" ? option : option.label;

export const isComingSoon = (option: SelectOption) =>
  typeof option !== "string" && Boolean(option.comingSoon);

/** Returns the value only when it matches an active (not "Coming Soon") option. */
export const selectableValue = (options: SelectOption[], value: string | undefined) =>
  value && options.some((option) => optionLabel(option) === value && !isComingSoon(option))
    ? value
    : "";

export const catalogueOptions: SelectOption[] = CATALOGUE_FILES.map((file) => file.title);

export const catalogueComingSoonNote = "More catalogues coming soon";

export const occasionOptions: SelectOption[] = [
  "Diwali",
  { label: "Wedding", comingSoon: true },
  { label: "Birthday", comingSoon: true },
  "Baby Shower",
  "Housewarming",
  "Pooja / Festive",
  "Corporate",
  "Other",
];

export const quantityOptions = ["Under 25", "25–50", "50–100", "100–250", "250–500", "500+"];

export const budgetOptions = ["Under ₹100", "₹100–₹250", "₹250–₹500", "₹500–₹1,000", "₹1,000+"];

export const isValidPhone = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 13;
};

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim());
