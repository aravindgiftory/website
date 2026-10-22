export interface EnquiryItem {
  slug: string;
  name: string;
  code: string;
  image: string;
}

export const ENQUIRY_STORAGE_KEY = "ag-enquiry-items";

export function loadEnquiryItems(): EnquiryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ENQUIRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEnquiryItem);
  } catch {
    return [];
  }
}

export function saveEnquiryItems(items: EnquiryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(items));
}

function isEnquiryItem(value: unknown): value is EnquiryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item["slug"] === "string" &&
    typeof item["name"] === "string" &&
    typeof item["code"] === "string" &&
    typeof item["image"] === "string"
  );
}
