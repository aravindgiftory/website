import { BRAND, whatsappLink } from "@/data/catalog";

/**
 * Lead capture contract.
 *
 * Every form produces a `Lead`. `submitLead` emails it via Google Apps Script
 * (Gmail) and opens a pre-filled WhatsApp message at the same time.
 */

export type LeadSource =
  | "catalogue"
  | "corporate"
  | "bulk-quote"
  | "product-enquiry"
  | "contact";

export interface Lead {
  source: LeadSource;
  firstName: string;
  lastName?: string | undefined;
  phone: string;
  email?: string | undefined;
  company?: string | undefined;
  lookingFor?: string | undefined;
  occasion?: string | undefined;
  quantity?: string | undefined;
  budget?: string | undefined;
  eventDate?: string | undefined;
  message?: string | undefined;
  /** Product name/code when the lead came from a single-product enquiry. */
  productName?: string | undefined;
  productCode?: string | undefined;
  /** Multi-product enquiry tray — grows as the catalogue grows. */
  products?: Array<{ slug: string; name: string; code: string }> | undefined;
  consent: boolean;
  submittedAt: string;
  pageUrl: string;
}

export type LeadResult = { ok: true } | { ok: false; error: string };

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
  if (lead.occasion) lines.push(`Occasion: ${lead.occasion}`);
  if (lead.quantity) lines.push(`Quantity: ${lead.quantity}`);
  if (lead.budget) lines.push(`Budget per gift: ${lead.budget}`);
  if (lead.eventDate) lines.push(`Event date: ${lead.eventDate}`);

  const listed =
    lead.products && lead.products.length > 0
      ? lead.products.map((item) => `${item.name} (${item.code})`)
      : lead.productName
        ? [`${lead.productName}${lead.productCode ? ` (${lead.productCode})` : ""}`]
        : [];
  if (listed.length > 0) {
    lines.push("", "Products:");
    listed.forEach((item) => lines.push(`• ${item}`));
  }
  if (lead.message) {
    lines.push("", lead.message);
  }
  return lines.join("\n");
}

export async function submitLead(lead: Lead): Promise<LeadResult> {
  try {
    if (import.meta.env.DEV) console.info("[lead]", lead);

    if (typeof window !== "undefined") {
      window.open(whatsappLink(formatLeadWhatsApp(lead)), "_blank", "noopener,noreferrer");
    }

    const scriptUrl = import.meta.env.VITE_LEADS_SCRIPT_URL?.trim();
    const token = import.meta.env.VITE_LEADS_TOKEN?.trim();
    if (!scriptUrl) {
      if (import.meta.env.DEV) {
        console.warn("[lead] VITE_LEADS_SCRIPT_URL is empty — Gmail was skipped. Put the URL in .env (not .env.example) and restart npm run dev.");
      }
      return { ok: true };
    }

    // Google turns form POSTs into GET after redirect, so send as GET with payload.
    const url = new URL(scriptUrl);
    url.searchParams.set("payload", JSON.stringify({ token, ...lead }));
    fetch(url.toString(), { method: "GET", mode: "no-cors", keepalive: true }).catch(() => undefined);
    if (typeof Image !== "undefined") {
      const beacon = new Image();
      beacon.src = url.toString();
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "We couldn't send your details. Please try again." };
  }
}

/**
 * Optional override. Leave empty — the download helper looks for
 * public/catalogues/aravind-giftory-2026.pdf on its own.
 */
export const CATALOGUE_FILE_URL = "";

export const occasionOptions = [
  "Wedding",
  "Birthday",
  "Baby Shower",
  "Housewarming",
  "Pooja / Festive",
  "Corporate",
  "Other",
];

export const quantityOptions = [
  "Under 25",
  "25–50",
  "50–100",
  "100–250",
  "250–500",
  "500+",
];

export const budgetOptions = [
  "Under ₹100",
  "₹100–₹250",
  "₹250–₹500",
  "₹500–₹1,000",
  "₹1,000+",
];

export const isValidPhone = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 13;
};

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim());
