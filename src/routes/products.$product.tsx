import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { useEnquiry } from "@/components/site/EnquiryProvider";
import {
  getCollection,
  getProduct,
  getProductImages,
  products,
} from "@/data/catalog";

export const Route = createFileRoute("/products/$product")({
  loader: ({ params }) => {
    const product = getProduct(params.product);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Gift unavailable | Aravind Giftory" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.product.name} | Aravind Giftory`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.product.description },
        { property: "og:url", content: `/products/${params.product}` },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `/products/${params.product}` }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { open, openCatalogue } = useLeadDialog();
  const { add, has } = useEnquiry();
  const [active, setActive] = useState(0);
  const collection = getCollection(product.collection);
  const gallery = getProductImages(product);
  const inList = has(product.slug);

  const related = products
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 lg:pt-40">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <Link to="/collections" className="link-underline">
            Collections
          </Link>
          {collection && (
            <>
              <span className="px-2">/</span>
              <Link
                to="/collections/$category"
                params={{ category: collection.slug }}
                className="link-underline"
              >
                {collection.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <div className="overflow-hidden bg-muted">
              <img
                src={gallery[active]}
                alt={product.name}
                width={1200}
                height={1200}
                className="aspect-square w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-20 w-20 overflow-hidden border ${
                      index === active ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-6">
            <span className="eyebrow text-gold">{product.type}</span>
            <h1 className="display-lg mt-4 text-primary">{product.name}</h1>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Product Code · {product.code}
            </p>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <dl className="mt-10 space-y-4 border-t border-border pt-8 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="eyebrow">Collection</dt>
                <dd className="text-foreground">{collection?.name}</dd>
              </div>
              {product.setInfo && (
                <div className="flex justify-between gap-6">
                  <dt className="eyebrow">Set</dt>
                  <dd className="text-foreground">{product.setInfo}</dd>
                </div>
              )}
              <div className="flex justify-between gap-6">
                <dt className="eyebrow">Occasions</dt>
                <dd className="text-right text-foreground">
                  {product.occasions
                    .map((slug: string) =>
                      slug
                        .split("-")
                        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(" "),
                    )
                    .join(", ")}
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => add(product)}
                className="rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
              >
                {inList ? "Added to Enquiry" : "Add to Enquiry"}
              </button>
              <button
                type="button"
                onClick={() =>
                  open({
                    source: "product-enquiry",
                    title: "Enquire Now",
                    intro: "Tell us your quantity and occasion — we'll come back with details.",
                    submitLabel: "Enquire Now",
                    productName: product.name,
                    productCode: product.code,
                    products: [{ slug: product.slug, name: product.name, code: product.code, image: product.image }],
                  })
                }
                className="rounded-sm border border-primary/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
              >
                Enquire Now
              </button>
              <button
                type="button"
                onClick={() => openCatalogue()}
                className="rounded-sm border border-primary/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
              >
                Download Catalogue
              </button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Also in this collection" title="You may also like" />
          <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
