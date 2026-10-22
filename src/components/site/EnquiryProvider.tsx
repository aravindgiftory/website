import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { type Product } from "@/data/catalog";
import { loadEnquiryItems, saveEnquiryItems, type EnquiryItem } from "@/lib/enquiry";

interface EnquiryContextValue {
  items: EnquiryItem[];
  add: (product: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  openTray: () => void;
  closeTray: () => void;
  trayOpen: boolean;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>(() => loadEnquiryItems());
  const [trayOpen, setTrayOpen] = useState(false);

  const persist = useCallback((next: EnquiryItem[]) => {
    setItems(next);
    saveEnquiryItems(next);
  }, []);

  const value = useMemo<EnquiryContextValue>(
    () => ({
      items,
      add: (product) => {
        persist(
          items.some((item) => item.slug === product.slug)
            ? items
            : [
                ...items,
                {
                  slug: product.slug,
                  name: product.name,
                  code: product.code,
                  image: product.image,
                },
              ],
        );
        setTrayOpen(true);
      },
      remove: (slug) => persist(items.filter((item) => item.slug !== slug)),
      clear: () => persist([]),
      has: (slug) => items.some((item) => item.slug === slug),
      openTray: () => setTrayOpen(true),
      closeTray: () => setTrayOpen(false),
      trayOpen,
    }),
    [items, persist, trayOpen],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}
