import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "./SectionHeading";
import { useLeadDialog } from "./LeadDialog";
import { BRAND, whatsappLink } from "@/data/catalog";
import { CATALOGUE_FILES, catalogueKey } from "@/data/media";
import pageData from "@/data/catalogue-pages";
import productData from "@/data/catalogue-products";
import { EVENT_PHOTOS, TESTIMONIALS } from "@/data/proof";
import { budgetOptions, occasionOptions, quantityOptions } from "@/lib/leads";

const PAGES = pageData as Record<string, unknown[]>;
const PRODUCTS = productData as Array<{ key: string }>;

const selectClass =
  "w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none";

/**
 * Builds a WhatsApp message from three choices, so a buyer can start a useful conversation in two
 * taps. Nothing is submitted until they press the WhatsApp link.
 */
export function WhatsAppBuilder({
  persona,
  defaultOccasion = "",
}: {
  persona: string;
  defaultOccasion?: string;
}) {
  const [occasion, setOccasion] = useState(defaultOccasion);
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");

  const message = [
    `Hi ${BRAND.name}, I'm ${persona} and I'm looking for gifts.`,
    `Occasion: ${occasion || "—"}`,
    `Quantity: ${quantity || "—"}`,
    `Budget per gift: ${budget || "—"}`,
    `Delivery date: ${date || "—"}`,
  ].join("\n");

  return (
    <div className="border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-2xl text-primary">Enquire on WhatsApp in two taps</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick what you know. Everything is optional, and you can edit the message in WhatsApp.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
          Occasion
          <select
            className={`${selectClass} mt-2 font-normal normal-case tracking-normal`}
            value={occasion}
            onChange={(event) => setOccasion(event.target.value)}
          >
            <option value="">Not sure yet</option>
            {occasionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
          Quantity
          <select
            className={`${selectClass} mt-2 font-normal normal-case tracking-normal`}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          >
            <option value="">Not sure yet</option>
            {quantityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
          Budget per gift
          <select
            className={`${selectClass} mt-2 font-normal normal-case tracking-normal`}
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          >
            <option value="">Not sure yet</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
          Delivery date
          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className={`${selectClass} mt-2 font-normal normal-case tracking-normal`}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block rounded-sm bg-primary px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Open WhatsApp with this message
      </a>
    </div>
  );
}

/** Catalogue downloads relevant to a buyer group, with real covers and real counts. */
export function CatalogueOffers({ slugs }: { slugs: string[] }) {
  const { openCatalogue } = useLeadDialog();
  const files = slugs.flatMap((slug) => {
    const file = CATALOGUE_FILES.find((item) => item.slug === slug);
    return file ? [file] : [];
  });

  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
      <SectionHeading
        eyebrow="Catalogues"
        title="Download the catalogue for your order"
        description="Each catalogue is the full PDF, with a product code and contents for every gift. Leave your details to download."
      />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {files.map((file) => {
          const key = catalogueKey(file);
          const pages = PAGES[key]?.length ?? 0;
          const products = PRODUCTS.filter((product) => product.key === key).length;
          return (
            <li key={file.slug} className="flex flex-col border border-border bg-card">
              <img
                src={file.cover}
                alt={`Cover of the ${file.title}`}
                width={900}
                height={507}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl text-primary">{file.title}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-gold">
                  {pages > 0 ? `${pages} pages` : "PDF catalogue"}
                  {products > 0 ? ` · ${products} products with codes` : ""}
                </p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{file.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openCatalogue(undefined, file.title)}
                    className="rounded-sm bg-primary px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                  >
                    Get the catalogue
                  </button>
                  <Link
                    to="/gifts/$catalogue"
                    params={{ catalogue: file.slug }}
                    className="rounded-sm border border-primary/25 px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-primary"
                  >
                    Browse pages
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Facts a buyer can verify on this site, plus real testimonials and event photos when supplied. */
export function ProofSection() {
  const catalogues = CATALOGUE_FILES.length;
  const products = PRODUCTS.length;
  const facts = [
    { value: String(products), label: "catalogue products, each with a code" },
    { value: String(catalogues), label: "catalogues you can download" },
    { value: String(BRAND.minQuantity), label: "pieces minimum per order" },
    { value: `₹${BRAND.startingPrice}`, label: "starting price per gift" },
  ];
  return (
    <section aria-label="What you can check" className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-4">
        {facts.map((fact) => (
          <li key={fact.label} className="bg-card px-5 py-6 text-center">
            <p className="font-display text-4xl text-primary">{fact.value}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{fact.label}</p>
          </li>
        ))}
      </ul>

      {TESTIMONIALS.length > 0 && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name + item.quote} className="border border-border bg-card p-6">
              <blockquote className="text-sm leading-relaxed text-foreground">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {item.name}, {item.role}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {EVENT_PHOTOS.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENT_PHOTOS.map((photo) => (
            <figure key={photo.src}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <figcaption className="mt-2 text-xs text-muted-foreground">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
