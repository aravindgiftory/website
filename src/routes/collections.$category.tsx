import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { CTASection } from "@/components/site/CTASection";
import { getCollection, productsByCollection, type CollectionSlug } from "@/data/catalog";

export const Route = createFileRoute("/collections/$category")({
  loader: ({ params }) => {
    const collection = getCollection(params.category);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Collection unavailable | Aravind Giftory" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.collection.name} | Aravind Giftory`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.collection.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.collection.description },
        { property: "og:url", content: `/collections/${params.category}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/collections/${params.category}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { collection } = Route.useLoaderData();
  const items = productsByCollection(collection.slug as CollectionSlug);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <Link
          to="/collections"
          className="link-underline text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          ← All Collections
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="Collection"
            title={collection.name}
            description={collection.description}
          />
          <div className="overflow-hidden bg-muted">
            <img
              src={collection.image}
              alt={collection.name}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <div className="mt-32">
        <CTASection />
      </div>
    </>
  );
}
