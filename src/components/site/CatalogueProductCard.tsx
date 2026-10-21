import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLeadDialog } from "./LeadDialog";

export interface CatalogueProduct {
  code: string;
  name: string;
  /** Catalogue file key (see catalogue-pages.json). */
  key: string;
  /** Page of that catalogue the product appears on. */
  n: number;
  /** Cropped product photo. */
  image: string;
  w: number;
  h: number;
}

/** A single catalogue product: photo, code, Enquire now and View details (full catalogue page). */
export function CatalogueProductCard({
  product,
  pageSrc,
  catalogueTitle,
}: {
  product: CatalogueProduct;
  pageSrc: string | undefined;
  catalogueTitle: string;
}) {
  const { open } = useLeadDialog();
  const [viewing, setViewing] = useState(false);

  useEffect(() => {
    if (!viewing) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setViewing(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  return (
    <article className="flex flex-col border border-border bg-card">
      <div className="aspect-square overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name || `${catalogueTitle}, product ${product.code}`}
          width={product.w}
          height={product.h}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h3 className="font-display text-lg leading-snug text-primary">{product.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            {product.code}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              open({
                source: "product-enquiry",
                title: "Enquire about this gift",
                intro: `${product.name} (${product.code}) from the ${catalogueTitle}. Add your quantity and event date and we'll send pricing.`,
                productName: product.name || `${catalogueTitle}, ${product.code}`,
                productCode: product.code,
                submitLabel: "Enquire now",
              })
            }
            className="rounded-sm bg-primary px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enquire now
          </button>
          {pageSrc && (
            <button
              type="button"
              onClick={() => setViewing(true)}
              className="rounded-sm border border-primary/25 px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary"
            >
              View details
            </button>
          )}
        </div>
      </div>

      {viewing && pageSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name || product.code} in the ${catalogueTitle}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewing(false)}
        >
          <button
            type="button"
            onClick={() => setViewing(false)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-primary"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={pageSrc}
            alt={`${catalogueTitle}, page ${product.n}, including ${product.code}`}
            className="max-h-full max-w-full bg-white object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
}
