import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CatalogueProductCard } from "@/components/site/CatalogueProductCard";
import { FaqSection } from "@/components/site/Faq";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { BRAND, whatsappLink } from "@/data/catalog";
import { occasionFaqs } from "@/data/seo-copy";
import { breadcrumbScript, faqScript } from "@/lib/seo";
import { catalogueTitle, pageSrc } from "@/lib/occasion-products";
import {
  collectionOf,
  getProductPage,
  isSubstantial,
  productDescription,
  productTitle,
  relatedProducts,
} from "@/lib/product-pages";
import { CATALOGUE_FILES } from "@/data/media";

export const Route = createFileRoute("/gift/$slug")({
  loader: ({ params }) => {
    const product = getProductPage(params.slug);
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
    const { product } = loaderData;
    const collection = collectionOf(product);
    const path = `/gift/${params.slug}`;
    const title = productTitle(product);
    const description = productDescription(product);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        // Pages that only carry a name and a code stay out of search results.
        ...(isSubstantial(product) ? [] : [{ name: "robots", content: "noindex, follow" }]),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${BRAND.siteUrl}${path}` },
        { property: "og:type", content: "website" },
        { property: "og:image", content: `${BRAND.siteUrl}${product.image}` },
      ],
      links: [{ rel: "canonical", href: `${BRAND.siteUrl}${path}` }],
      scripts: [
        breadcrumbScript([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          ...(collection
            ? [{ name: collection.name, path: `/collections/${collection.slug}` }]
            : []),
          { name: product.name, path },
        ]),
      ],
    };
  },
  component: GiftPage,
});

function GiftPage() {
  const { product } = Route.useLoaderData();
  const { open } = useLeadDialog();
  const collection = collectionOf(product);
  const related = relatedProducts(product);
  const file = CATALOGUE_FILES.find((item) => item.href.endsWith(`/${product.key}.pdf`));
  const fullPage = pageSrc(product);
  const items = (product.details ?? []).filter((line) => !/^product type:/i.test(line));
  const typeLine = (product.details ?? []).find((line) => /^product type:/i.test(line));
  const enquire = () =>
    open({
      source: "product-enquiry",
      title: "Enquire about this gift",
      intro: `${product.name} (${product.code}). Add your quantity and event date and we'll send pricing.`,
      productName: product.name,
      productCode: product.code,
      submitLabel: "Enquire now",
    });

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Link to="/collections" className="link-underline">
            Collections
          </Link>
          {collection && (
            <>
              {" / "}
              <Link
                to="/collections/$category"
                params={{ category: collection.slug }}
                className="link-underline"
              >
                {collection.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden border border-border bg-white">
            <img
              src={product.image}
              alt={`${product.name} (${product.code})`}
              width={product.w}
              height={product.h}
              className="aspect-square w-full object-contain"
            />
          </div>
          <div>
            <p className="eyebrow text-gold">{product.code}</p>
            <h1 className="display-lg mt-4 text-primary">{product.name}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              From the {catalogueTitle(product.key)}. Orders start at {BRAND.minQuantity} pieces.
              Share your quantity and event date and we'll confirm pricing.
            </p>

            {(typeLine || items.length > 0) && (
              <div className="mt-8">
                <h2 className="font-display text-2xl text-primary">What's included</h2>
                {typeLine && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {typeLine.replace(/^product type:\s*/i, "")}
                  </p>
                )}
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
                  {items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={enquire}
                className="rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
              >
                Enquire now
              </button>
              <a
                href={whatsappLink(
                  `Hi ${BRAND.name}, I'm interested in ${product.name} (${product.code}). Quantity: \nEvent date: `,
                )}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-primary/25 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
              >
                Enquire on WhatsApp
              </a>
            </div>
            {file && (
              <p className="mt-6 text-sm text-muted-foreground">
                See every page of the{" "}
                <Link
                  to="/gifts/$catalogue"
                  params={{ catalogue: file.slug }}
                  className="link-underline text-foreground"
                >
                  {file.title}
                </Link>
                .
              </p>
            )}
          </div>
        </div>

        {fullPage && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-primary">From the catalogue</h2>
            <img
              src={fullPage}
              alt={`${catalogueTitle(product.key)}, page ${product.n}, including ${product.code}`}
              loading="lazy"
              className="mt-6 w-full max-w-3xl border border-border bg-white"
            />
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="More to explore"
            title={collection ? `More from ${collection.name}` : "More gifts"}
          />
          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <CatalogueProductCard
                key={`${item.key}-${item.code}`}
                product={item}
                pageSrc={pageSrc(item)}
                catalogueTitle={catalogueTitle(item.key)}
              />
            ))}
          </div>
        </section>
      )}

      <FaqSection items={occasionFaqs("corporate").slice(1)} />
    </>
  );
}
