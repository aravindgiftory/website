import { Link } from "@tanstack/react-router";
import { type Product } from "@/data/catalog";
import { useLeadDialog } from "./LeadDialog";
import { useEnquiry } from "./EnquiryProvider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean | undefined }) {
  const { open } = useLeadDialog();
  const { add, has } = useEnquiry();
  const inList = has(product.slug);

  return (
    <article className="group flex flex-col">
      <Link
        to="/products/$product"
        params={{ product: product.slug }}
        className="block overflow-hidden bg-muted"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          width={1200}
          height={1200}
          loading={priority ? "eager" : "lazy"}
          className="aspect-square w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-xl leading-snug text-foreground">
          <Link
            to="/products/$product"
            params={{ product: product.slug }}
            className="link-underline"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {product.code}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
          <button
            type="button"
            onClick={() => add(product)}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-primary link-underline"
          >
            {inList ? "Added to Enquiry" : "Add to Enquiry"}
          </button>
          <button
            type="button"
            onClick={() =>
              open({
                source: "product-enquiry",
                title: "Enquire About This Gift",
                submitLabel: "Send Enquiry",
                productName: product.name,
                productCode: product.code,
                products: [{ slug: product.slug, name: product.name, code: product.code, image: product.image }],
              })
            }
            className="text-xs uppercase tracking-[0.16em] text-muted-foreground link-underline"
          >
            Enquire now
          </button>
        </div>
      </div>
    </article>
  );
}
