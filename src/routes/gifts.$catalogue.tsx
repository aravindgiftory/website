import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { BRAND, products } from "@/data/catalog";
import { CATALOGUE_FILES, catalogueKey, type CatalogueFile } from "@/data/media";
import pageData from "@/data/catalogue-pages.json";
import { ProductCard } from "@/components/site/ProductCard";
import { useLeadDialog } from "@/components/site/LeadDialog";

interface CataloguePage {
  n: number;
  src: string;
  w: number;
  h: number;
  codes: string[];
}

const PAGES = pageData as Record<string, CataloguePage[]>;

export const Route = createFileRoute("/gifts/$catalogue")({
  loader: ({ params }) => {
    const file = CATALOGUE_FILES.find((item) => item.slug === params.catalogue);
    if (!file) throw notFound();
    return { file };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Catalogue not found | Aravind Giftory" }] };
    }
    const { file } = loaderData;
    const url = `${BRAND.siteUrl}/gifts/${params.catalogue}`;
    return {
      meta: [
        { title: `${file.title} | Aravind Giftory` },
        {
          name: "description",
          content: `${file.description} Browse every page, from ₹${BRAND.startingPrice} per gift, minimum ${BRAND.minQuantity} pieces.`,
        },
        { property: "og:title", content: `${file.title} | Aravind Giftory` },
        { property: "og:description", content: file.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CatalogueListing,
});

function CatalogueListing() {
  const { file } = Route.useLoaderData();
  const { open, openCatalogue } = useLeadDialog();
  const pages = PAGES[catalogueKey(file)] ?? [];
  const [viewing, setViewing] = useState<number | null>(null);
  const listed = file.productPrefix
    ? products.filter((p) => p.slug.startsWith(file.productPrefix ?? ""))
    : [];

  const enquire = (page: CataloguePage) =>
    open({
      source: "product-enquiry",
      title: "Enquire about this page",
      intro: `Page ${page.n} of the ${file.title}. Add your quantity and event date and we'll send pricing.`,
      productName: `${file.title}, page ${page.n}`,
      productCode: page.codes.join(", ") || undefined,
      submitLabel: "Request pricing",
    });

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Link to="/catalogue" className="link-underline">
            Catalogues
          </Link>{" "}
          / <span className="text-foreground">{file.title}</span>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h1 className="display-lg text-primary">{file.title}</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {file.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-3" aria-label="Pricing and size">
              <li className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                From ₹{BRAND.startingPrice} per gift
              </li>
              <li className="rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary">
                Minimum order {BRAND.minQuantity} pieces
              </li>
              <li className="rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary">
                {pages.length} pages
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openCatalogue(undefined, file.title)}
                className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Download the PDF
                <Download className="h-4 w-4" />
              </button>
              <Link
                to="/contact"
                className="rounded-full border border-primary/25 px-7 py-3.5 text-sm font-semibold text-primary"
              >
                Talk to us
              </Link>
            </div>
          </div>
          {pages[0] && (
            <img
              src={pages[0].src}
              alt={`Cover of the ${file.title}`}
              width={pages[0].w}
              height={pages[0].h}
              className="mx-auto max-h-[28rem] w-auto rounded-sm border border-border bg-card shadow-[var(--shadow-soft)]"
            />
          )}
        </div>
      </section>

      {listed.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8">
          <h2 className="display-md text-primary">{listed.length} products</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {listed.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {listed.length > 0 ? (
        <details className="group mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
          <summary className="flex cursor-pointer list-none items-center justify-between border-y border-border py-5 font-display text-2xl text-primary">
            Browse the original catalogue pages ({pages.length})
            <span className="text-muted-foreground transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="pt-10">
            <>
              <h2 className="display-md text-primary">Catalogue pages</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Every page of the catalogue. Open a page to see it larger or ask for pricing.
              </p>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page, i) => (
                  <li key={page.n} className="flex flex-col border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => setViewing(i)}
                      className="block overflow-hidden bg-muted"
                      aria-label={`View page ${page.n} of ${file.title}`}
                    >
                      <img
                        src={page.src}
                        alt={`${file.title}, page ${page.n}`}
                        width={page.w}
                        height={page.h}
                        loading={i < 3 ? "eager" : "lazy"}
                        className="w-full object-cover"
                      />
                    </button>
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        <span>Page {page.n}</span>
                        {page.codes.length > 0 && <span>{page.codes.length} codes</span>}
                      </div>
                      {page.codes.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5">
                          {page.codes.map((code) => (
                            <li
                              key={code}
                              className="rounded-full border border-gold/50 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.08em] text-gold"
                            >
                              {code}
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        type="button"
                        onClick={() => enquire(page)}
                        className="mt-auto self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary link-underline"
                      >
                        Enquire about this page
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          </div>
        </details>
      ) : (
        <section className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8 lg:pt-28">
          <h2 className="display-md text-primary">Catalogue pages</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Every page of the catalogue. Open a page to see it larger or ask for pricing.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, i) => (
              <li key={page.n} className="flex flex-col border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setViewing(i)}
                  className="block overflow-hidden bg-muted"
                  aria-label={`View page ${page.n} of ${file.title}`}
                >
                  <img
                    src={page.src}
                    alt={`${file.title}, page ${page.n}`}
                    width={page.w}
                    height={page.h}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="w-full object-cover"
                  />
                </button>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <span>Page {page.n}</span>
                    {page.codes.length > 0 && <span>{page.codes.length} codes</span>}
                  </div>
                  {page.codes.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {page.codes.map((code) => (
                        <li
                          key={code}
                          className="rounded-full border border-gold/50 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.08em] text-gold"
                        >
                          {code}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => enquire(page)}
                    className="mt-auto self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary link-underline"
                  >
                    Enquire about this page
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <h2 className="display-md text-primary">More catalogues</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {CATALOGUE_FILES.filter((item) => item.slug !== file.slug).map((item) => (
            <li key={item.slug}>
              <Link
                to="/gifts/$catalogue"
                params={{ catalogue: item.slug }}
                className="block rounded-full border border-primary/25 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {viewing !== null && pages[viewing] && (
        <Lightbox
          file={file}
          pages={pages}
          index={viewing}
          onIndex={setViewing}
          onClose={() => setViewing(null)}
          onEnquire={enquire}
        />
      )}
    </>
  );
}

function Lightbox({
  file,
  pages,
  index,
  onIndex,
  onClose,
  onEnquire,
}: {
  file: CatalogueFile;
  pages: CataloguePage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onEnquire: (page: CataloguePage) => void;
}) {
  const page = pages[index];
  const go = (delta: number) => onIndex((index + delta + pages.length) % pages.length);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onIndex((index - 1 + pages.length) % pages.length);
      if (event.key === "ArrowRight") onIndex((index + 1) % pages.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, pages.length, onIndex, onClose]);

  if (!page) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${file.title}, page ${page.n}`}
      className="fixed inset-0 z-[80] flex flex-col bg-[oklch(0.22_0.012_50_/_0.8)] p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between text-white">
        <p className="text-sm">
          {file.title} · Page {page.n} of {pages.length}
        </p>
        <button type="button" onClick={onClose} aria-label="Close" className="p-2">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous page"
          className="absolute left-0 z-10 rounded-full bg-white/85 p-3 text-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <img
          src={page.src}
          alt={`${file.title}, page ${page.n}`}
          className="max-h-full max-w-full rounded-sm bg-white object-contain"
        />
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next page"
          className="absolute right-0 z-10 rounded-full bg-white/85 p-3 text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex justify-center pt-3">
        <button
          type="button"
          onClick={() => {
            onClose();
            onEnquire(page);
          }}
          className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary"
        >
          Enquire about this page
        </button>
      </div>
    </div>
  );
}
