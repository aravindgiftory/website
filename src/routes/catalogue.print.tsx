import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BRAND,
  collections,
  products,
  productsByCollection,
} from "@/data/catalog";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/catalogue/print")({
  head: () => ({
    meta: [
      { title: "Aravind Giftory 2026 Catalogue" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Printable Aravind Giftory catalogue — generated from the live product list.",
      },
    ],
  }),
  component: CataloguePrintPage,
});

function CataloguePrintPage() {
  useEffect(() => {
    document.body.setAttribute("data-print-catalogue", "true");
    const shouldPrint = new URLSearchParams(window.location.search).get("print") === "1";
    const timer = shouldPrint ? window.setTimeout(() => window.print(), 500) : undefined;
    return () => {
      document.body.removeAttribute("data-print-catalogue");
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 print:max-w-none print:px-0 print:py-0">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="text-sm text-muted-foreground">
          This catalogue updates automatically when new products are added.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
          >
            Download / Print PDF
          </button>
          <Link
            to="/catalogue"
            className="rounded-sm border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground"
          >
            Back
          </Link>
        </div>
      </div>

      <header className="border-b border-border pb-8">
        <img src={logo} alt={BRAND.name} className="h-24 w-auto" />
        <p className="eyebrow mt-6 text-gold">The 2026 Collection</p>
        <h1 className="display-lg mt-3 text-primary">{BRAND.name}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {BRAND.tagline} {BRAND.city} · {BRAND.phone}
        </p>
      </header>

      {collections.map((collection) => {
        const items = productsByCollection(collection.slug);
        if (items.length === 0) return null;
        return (
          <section key={collection.slug} className="mt-12 break-inside-avoid">
            <h2 className="font-display text-3xl text-primary">{collection.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
              {items.map((product) => (
                <article key={product.slug} className="break-inside-avoid border border-border bg-card p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {product.code} · {product.type}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-foreground">{product.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-16 text-center text-xs text-muted-foreground">
        {products.length} gifts · {BRAND.name}, {BRAND.city} · {BRAND.instagramUrl}
      </p>
    </div>
  );
}
