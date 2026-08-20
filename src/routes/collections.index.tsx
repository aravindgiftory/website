import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { CTASection } from "@/components/site/CTASection";
import {
  collections,
  occasions,
  products,
  productTypes,
  type CollectionSlug,
  type OccasionSlug,
  type ProductType,
} from "@/data/catalog";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Gifting Collections | Aravind Giftory" },
      {
        name: "description",
        content:
          "Browse Aravind Giftory collections — traditional brass, Pichwai, pooja, dry fruit gifts, kitchen storage, tea & coffee, dining, lighting, home decor and corporate gifts.",
      },
      { property: "og:title", content: "Gifting Collections | Aravind Giftory" },
      {
        property: "og:description",
        content: "Explore curated gifting collections for every occasion.",
      },
      { property: "og:url", content: "/collections" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const [category, setCategory] = useState<CollectionSlug | "all">("all");
  const [occasion, setOccasion] = useState<OccasionSlug | "all">("all");
  const [type, setType] = useState<ProductType | "all">("all");

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "all" || product.collection === category) &&
          (occasion === "all" || product.occasions.includes(occasion)) &&
          (type === "all" || product.type === type),
      ),
    [category, occasion, type],
  );

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <SectionHeading
          eyebrow="Collections"
          title="The Giftory Collections"
          description="Traditional, contemporary and practical gifting — organised so you can find the right fit quickly."
        />
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              to="/collections/$category"
              params={{ category: collection.slug }}
              className="group block"
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={collection.image}
                  alt={collection.name}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
              </div>
              <h2 className="mt-5 font-display text-2xl text-primary">{collection.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading eyebrow="All Gifts" title="Browse the full range" />

        <div className="mt-10 grid gap-4 border-y border-border py-6 sm:grid-cols-3">
          <Filter
            label="Category"
            value={category}
            onChange={(value) => setCategory(value as CollectionSlug | "all")}
            options={collections.map((c) => ({ value: c.slug, label: c.name }))}
          />
          <Filter
            label="Occasion"
            value={occasion}
            onChange={(value) => setOccasion(value as OccasionSlug | "all")}
            options={occasions.map((o) => ({ value: o.slug, label: o.name }))}
          />
          <Filter
            label="Product Type"
            value={type}
            onChange={(value) => setType(value as ProductType | "all")}
            options={productTypes.map((t) => ({ value: t, label: t }))}
          />
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "gift" : "gifts"}
        </p>

        {filtered.length === 0 ? (
          <p className="mt-16 font-display text-2xl text-primary">
            Nothing matches that combination — try widening a filter.
          </p>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="eyebrow mb-2 block" htmlFor={`filter-${label}`}>
        {label}
      </label>
      <select
        id={`filter-${label}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
