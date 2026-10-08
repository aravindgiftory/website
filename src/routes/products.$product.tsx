import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Feather, Leaf, Recycle, Droplets, Check, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useLeadDialog } from "@/components/site/LeadDialog";
import { useEnquiry } from "@/components/site/EnquiryProvider";
import {
  getCollection,
  getProduct,
  getProductImages,
  products,
  BRAND,
  whatsappLink,
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
        { property: "og:url", content: `${BRAND.siteUrl}/products/${params.product}` },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `${BRAND.siteUrl}/products/${params.product}` }],
    };
  },
  component: ProductPage,
});

/** Facts from the Cork catalogues, shown only on cork products. */
const CORK_FACTS = [
  { icon: Recycle, title: "Renewable", text: "Bark is harvested without cutting the tree." },
  { icon: Feather, title: "Lightweight", text: "Easy to pack, carry and ship in quantity." },
  { icon: Droplets, title: "Water-resistant", text: "Holds up on desks, shelves and windowsills." },
  { icon: Leaf, title: "Naturally textured", text: "Every piece has its own grain." },
];

const ORDER_STEPS = [
  { title: "Choose", text: "Pick the gifts you like and add them to your enquiry." },
  { title: "Enquire", text: "Share your quantity and event date." },
  { title: "Receive", text: "We confirm pricing for your quantity, then pack and deliver." },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { open } = useLeadDialog();
  const { add, has } = useEnquiry();
  const [active, setActive] = useState(0);
  const collection = getCollection(product.collection);
  const gallery = getProductImages(product);
  const inList = has(product.slug);
  const isCork = product.material === "Cork";
  const minimum = product.minQuantity ?? BRAND.minQuantity;

  // Prefer siblings from the same catalogue (e.g. cork-planter-*), then the same collection.
  const family = product.slug.replace(/\d+$/, "");
  const siblings = products.filter((p) => p.slug !== product.slug && p.slug.startsWith(family));
  const related = (
    siblings.length >= 4
      ? siblings
      : [
          ...siblings,
          ...products.filter(
            (p) =>
              p.collection === product.collection &&
              p.slug !== product.slug &&
              !siblings.includes(p),
          ),
        ]
  ).slice(0, 4);

  const enquireNow = () =>
    open({
      source: "product-enquiry",
      title: "Get pricing",
      intro:
        "Tell us your quantity and event date. We'll come back with pricing for your quantity.",
      submitLabel: "Request pricing",
      productName: product.name,
      productCode: product.code,
      products: [
        { slug: product.slug, name: product.name, code: product.code, image: product.image },
      ],
    });

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-32 sm:px-8 lg:pt-40">
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
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

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="grid gap-4 lg:grid-cols-[5rem_1fr]">
            {gallery.length > 1 && (
              <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === active}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
                      index === active ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div
              className={`order-1 overflow-hidden rounded-md bg-[oklch(0.94_0.025_88)] ${
                gallery.length > 1 ? "lg:order-2" : "lg:col-span-2"
              }`}
            >
              <img
                src={gallery[active]}
                alt={product.name}
                width={1200}
                height={1200}
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/25 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
                {product.type}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {product.code}
              </span>
            </div>
            <h1 className="display-lg mt-4 text-primary">{product.name}</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-foreground" aria-label="Key facts">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-gold" /> Minimum order {minimum} pieces
              </li>
              {product.material && (
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-gold" /> Made in {product.material.toLowerCase()}
                </li>
              )}
              {product.setInfo && (
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-gold" /> {product.setInfo}
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-gold" /> Pricing shared for your quantity
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={enquireNow}
                className="rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Get pricing
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => add(product)}
                  className="rounded-full border border-primary/25 px-4 py-3.5 text-sm font-medium text-primary transition-colors hover:border-primary"
                >
                  {inList ? "Added to enquiry" : "Add to enquiry"}
                </button>
                <a
                  href={whatsappLink(
                    `Hi ${BRAND.name}, I'd like pricing for ${product.name} (${product.code}).`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-primary/25 px-4 py-3.5 text-sm font-medium text-primary transition-colors hover:border-primary"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-8 divide-y divide-border border-y border-border text-sm">
              {product.contents && product.contents.length > 0 && (
                <details open className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
                    What's inside
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <ul className="mt-3 space-y-1.5 text-muted-foreground">
                    {product.contents.map((item: string) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <details className="group py-4" open={!product.contents?.length}>
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
                  Details
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <dl className="mt-3 space-y-2 text-muted-foreground">
                  <div className="flex justify-between gap-6">
                    <dt>Product code</dt>
                    <dd className="text-foreground">{product.code}</dd>
                  </div>
                  {product.setInfo && (
                    <div className="flex justify-between gap-6">
                      <dt>Size / set</dt>
                      <dd className="text-right text-foreground">{product.setInfo}</dd>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between gap-6">
                      <dt>Material</dt>
                      <dd className="text-foreground">{product.material}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-6">
                    <dt>Minimum order</dt>
                    <dd className="text-foreground">{minimum} pieces</dd>
                  </div>
                </dl>
              </details>
            </div>
          </div>
        </div>
      </section>

      {isCork && (
        <section className="mx-auto mt-24 max-w-[1400px] px-3 sm:px-6">
          <div className="rounded-md bg-primary px-6 py-14 text-primary-foreground sm:px-14">
            <h2 className="display-md max-w-xl italic">Why cork makes a good gift.</h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {CORK_FACTS.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <Icon className="h-6 w-6 text-[oklch(0.86_0.09_85)]" aria-hidden="true" />
                  <p className="mt-4 font-display text-xl">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-primary-foreground/80">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        <h2 className="display-md text-primary">How ordering works</h2>
        <ol className="mt-8 grid gap-6 border-y border-border py-8 sm:grid-cols-3">
          {ORDER_STEPS.map((step, i) => (
            <li key={step.title}>
              <p className="font-display text-2xl italic text-primary">
                {i + 1}. {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Also available" title="You may also like" />
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
