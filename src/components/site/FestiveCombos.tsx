import { Link } from "@tanstack/react-router";
import { products } from "@/data/catalog";
import { CATALOGUE_FILES } from "@/data/media";
import { BRAND } from "@/data/brand";
import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./SectionHeading";

const combos = products.filter((product) => product.slug.startsWith("cork-combo-"));

/** Shop-by-catalogue tiles, then the Diwali cork combos from the catalogue PDF. */
export function FestiveCombos() {
  return (
    <>
      <section
        aria-label="Shop by catalogue"
        className="mx-auto max-w-[1400px] px-5 pt-14 sm:px-8 lg:pt-20"
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATALOGUE_FILES.map((file) => (
            <li key={file.href}>
              <Link
                to="/gifts/$catalogue"
                params={{ catalogue: file.slug }}
                className="group block w-full text-left"
              >
                <span className="block overflow-hidden rounded-sm border border-border bg-muted">
                  <img
                    src={file.cover}
                    alt=""
                    width={900}
                    height={507}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </span>
                <span className="mt-3 block text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
                  {file.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="diwali-combos"
        className="mx-auto max-w-[1400px] scroll-mt-28 px-5 pt-20 sm:px-8 lg:pt-28"
      >
        <SectionHeading
          eyebrow="Diwali 2026"
          title="Sustainable cork gift combos"
          description={`Eight ready combos from our Festive Cork Gifting Catalogue. From ₹${BRAND.startingPrice} per gift, minimum ${BRAND.minQuantity} pieces.`}
        />
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {combos.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i < 4} />
          ))}
        </div>
      </section>
    </>
  );
}
