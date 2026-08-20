import { CATALOGUE_PDF_HREF } from "@/data/media";
import { CATALOGUE_FILE_URL } from "@/lib/leads";

export const CATALOGUE_PRINT_PATH = "/catalogue/print";

async function pdfExists(href: string) {
  try {
    const response = await fetch(href, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

function triggerDownload(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = "Aravind-Giftory-2026-Catalogue.pdf";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Uses a designed PDF from public/catalogues when that file is present.
 * Otherwise opens the live printable catalogue (always in sync with products).
 */
export async function downloadCatalogue() {
  if (typeof window === "undefined") return;

  const candidates = [CATALOGUE_FILE_URL, CATALOGUE_PDF_HREF].filter(
    (href): href is string => Boolean(href) && href !== "#",
  );

  for (const href of candidates) {
    if (await pdfExists(href)) {
      triggerDownload(href);
      return;
    }
  }

  window.open(`${CATALOGUE_PRINT_PATH}?print=1`, "_blank", "noopener,noreferrer");
}

export function viewCatalogue() {
  if (typeof window === "undefined") return;
  window.open(CATALOGUE_PRINT_PATH, "_blank", "noopener,noreferrer");
}
