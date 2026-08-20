import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEnquiry } from "./EnquiryProvider";
import { useLeadDialog } from "./LeadDialog";

export function EnquiryTray() {
  const { items, remove, clear, trayOpen, closeTray, openTray } = useEnquiry();
  const { open } = useLeadDialog();

  const sendEnquiry = () => {
    closeTray();
    open({
      source: "product-enquiry",
      title: items.length > 1 ? "Enquire about these gifts" : "Enquire about this gift",
      intro: "Share quantity, occasion and budget — we'll come back with availability.",
      submitLabel: "Send Enquiry",
      products: items,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openTray}
        data-enquiry-fab
        aria-label={`Enquiry list, ${items.length} ${items.length === 1 ? "gift" : "gifts"}`}
        className="fixed bottom-5 right-20 z-40 flex h-12 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        Enquiry
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[0.65rem] text-primary-foreground">
          {items.length}
        </span>
      </button>

      {trayOpen && (
        <div
          className="fixed inset-0 z-[60] flex justify-end bg-[oklch(0.22_0.012_50_/_0.45)]"
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry list"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeTray();
          }}
        >
          <div className="flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <span className="eyebrow text-gold">Your list</span>
                <h2 className="mt-1 font-display text-2xl text-primary">Enquiry</h2>
              </div>
              <button type="button" onClick={closeTray} aria-label="Close enquiry list" className="p-2 text-muted-foreground hover:text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Add gifts as you browse. When more products are added to the catalogue, they can
                  join this same list.
                </p>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-4">
                      <Link
                        to="/products/$product"
                        params={{ product: item.slug }}
                        onClick={closeTray}
                        className="h-20 w-20 shrink-0 overflow-hidden bg-muted"
                      >
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg leading-snug text-foreground">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {item.code}
                        </p>
                        <button
                          type="button"
                          onClick={() => remove(item.slug)}
                          className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground link-underline"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-3 border-t border-border px-6 py-5">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs uppercase tracking-[0.14em] text-muted-foreground link-underline"
                >
                  Clear list
                </button>
              )}
              <button
                type="button"
                disabled={items.length === 0}
                onClick={sendEnquiry}
                className="w-full rounded-sm bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send enquiry{items.length > 0 ? ` · ${items.length}` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
