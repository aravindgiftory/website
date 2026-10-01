import { CATALOGUE_FILES, type CatalogueFile } from "@/data/media";

export const CATALOGUE_PRINT_PATH = "/catalogue/print";

let lastChosen: CatalogueFile | undefined;

function triggerDownload(file: CatalogueFile) {
  const link = document.createElement("a");
  link.href = file.href;
  link.download = file.fileName;
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Downloads the catalogue with the given title. Without a title, repeats the
 * visitor's last choice, or falls back to the first catalogue.
 */
export function downloadCatalogue(title?: string) {
  if (typeof window === "undefined") return;

  const file =
    CATALOGUE_FILES.find((item) => item.title === title) ?? lastChosen ?? CATALOGUE_FILES[0];
  if (!file) return;

  lastChosen = file;
  triggerDownload(file);
}

export function viewCatalogue() {
  if (typeof window === "undefined") return;
  window.open(CATALOGUE_PRINT_PATH, "_blank", "noopener,noreferrer");
}
