import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { type LeadSource } from "@/lib/leads";
import { downloadCatalogue } from "@/lib/catalogue-download";

interface OpenOptions {
  source: LeadSource;
  title?: string | undefined;
  intro?: string | undefined;
  submitLabel?: string | undefined;
  quantity?: string | undefined;
  occasion?: string | undefined;
  productName?: string | undefined;
  productCode?: string | undefined;
  products?: Array<{ slug: string; name: string; code: string }> | undefined;
  corporate?: boolean | undefined;
  /** Catalogue flow shows the download success state. */
  catalogue?: boolean | undefined;
}

interface LeadDialogContextValue {
  open: (options: OpenOptions) => void;
  openCatalogue: (quantity?: string | undefined) => void;
}

const LeadDialogContext = createContext<LeadDialogContextValue | null>(null);

export function useLeadDialog() {
  const ctx = useContext(LeadDialogContext);
  if (!ctx) throw new Error("useLeadDialog must be used inside LeadDialogProvider");
  return ctx;
}

export function LeadDialogProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<OpenOptions | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const close = useCallback(() => {
    setOptions(null);
    setDownloaded(false);
  }, []);

  useEffect(() => {
    if (!options) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options, close]);

  const value = useMemo<LeadDialogContextValue>(
    () => ({
      open: (next) => {
        setDownloaded(false);
        setOptions(next);
      },
      openCatalogue: (quantity) => {
        setDownloaded(false);
        setOptions({
          source: "catalogue",
          title: "Get the 2026 Catalogue",
          intro: "Tell us a little about your requirement and we'll send you the catalogue.",
          submitLabel: "Get My Catalogue",
          quantity,
          catalogue: true,
        });
      },
    }),
    [],
  );

  return (
    <LeadDialogContext.Provider value={value}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-[oklch(0.22_0.012_50_/_0.55)] p-4 py-10 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label={options.title ?? "Enquiry form"}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="rise-in relative w-full max-w-2xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-10">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-sm p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            {downloaded ? (
              <div className="py-4 text-center">
                <span className="eyebrow text-gold">Your catalogue is ready</span>
                <h2 className="display-md mt-4 text-primary">
                  Thank you. We've received your gifting requirements.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  An Aravind Giftory representative may contact you shortly.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={downloadCatalogue}
                    className="w-full rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                  >
                    Download 2026 Catalogue
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="w-full rounded-sm border border-border px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="eyebrow text-gold">Aravind Giftory</span>
                <h2 className="display-md mt-3 text-primary">
                  {options.title ?? "Tell us about your gifting"}
                </h2>
                {options.intro && (
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {options.intro}
                  </p>
                )}
                {(options.products?.length || options.productName) && (
                  <p className="mt-3 text-sm text-foreground">
                    Enquiry for{" "}
                    <span className="font-semibold">
                      {options.products && options.products.length > 0
                        ? options.products.map((item) => item.name).join(", ")
                        : options.productName}
                    </span>
                    {options.products?.length === 1 && options.products[0]
                      ? ` · ${options.products[0].code}`
                      : !options.products?.length && options.productCode
                        ? ` · ${options.productCode}`
                        : ""}
                  </p>
                )}
                <div className="mt-8">
                  <LeadForm
                    source={options.source}
                    submitLabel={options.submitLabel ?? "Send Enquiry"}
                    corporate={options.corporate}
                    showLookingFor={options.catalogue}
                    defaultQuantity={options.quantity}
                    defaultOccasion={options.occasion}
                    productName={options.productName}
                    productCode={options.productCode}
                    products={options.products}
                    onSuccess={() => {
                      if (options.catalogue) setDownloaded(true);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </LeadDialogContext.Provider>
  );
}
