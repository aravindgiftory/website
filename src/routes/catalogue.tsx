import { BRAND } from "@/data/catalog";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LeadForm } from "@/components/site/LeadForm";
import { CATALOGUE_FILES } from "@/data/media";
import catalogueCover from "@/assets/catalogue-cover.jpg";
import { useLeadDialog } from "@/components/site/LeadDialog";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "The 2026 Giftory Collection Catalogue | Aravind Giftory" },
      {
        name: "description",
        content:
          "Preview and request the Aravind Giftory 2026 catalogue — curated gifting for celebrations, occasions and corporate moments.",
      },
      { property: "og:title", content: "The 2026 Giftory Collection | Aravind Giftory" },
      {
        property: "og:description",
        content: "Explore our curated gifting collection and request the 2026 catalogue.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/catalogue` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/catalogue` }],
  }),
  component: CataloguePage,
});

function CataloguePage() {
  const { openCatalogue } = useLeadDialog();
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Catalogue</span>
            </div>
            <h1 className="display-xl mt-6 max-w-lg text-primary">The 2026 Giftory Collection</h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Explore our curated gifting collection for celebrations, occasions and corporate
              moments.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalogue-form"
                className="inline-block rounded-sm bg-primary px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
              >
                Get the Catalogue
              </a>
              <a
                href="#catalogues"
                className="rounded-sm border border-primary/25 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
              >
                View Catalogues
              </a>
            </div>
          </div>
          <div className="overflow-hidden bg-muted">
            <img
              src={catalogueCover}
              alt="The Aravind Giftory 2026 catalogue, open on a warm ivory surface"
              width={1200}
              height={1400}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="catalogues" className="mx-auto mt-32 max-w-[1400px] scroll-mt-28 px-5 sm:px-8">
        <SectionHeading
          eyebrow="Catalogues"
          title="Choose your catalogue"
          description="Browse our latest catalogues and download the one that suits your gifting."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATALOGUE_FILES.map((file) => (
            <div
              key={file.href}
              className="group flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-gold/60"
            >
              <Link
                to="/gifts/$catalogue"
                params={{ catalogue: file.slug }}
                className="block w-full overflow-hidden bg-muted"
                aria-label={`View products in ${file.title}`}
              >
                <img
                  src={file.cover}
                  alt={`Cover of the ${file.title}`}
                  width={900}
                  height={507}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-xl text-primary">{file.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{file.description}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openCatalogue(undefined, file.title)}
                    className="rounded-sm bg-primary px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Download
                  </button>
                  <Link
                    to="/gifts/$catalogue"
                    params={{ catalogue: file.slug }}
                    className="rounded-sm border border-primary/25 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
                  >
                    View products
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <span className="mt-8 inline-flex items-center rounded-full border border-gold/50 bg-gold/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold">
          More catalogues coming soon
        </span>
      </section>

      <section
        id="catalogue-form"
        className="mx-auto mt-32 max-w-[1400px] scroll-mt-28 px-5 sm:px-8"
      >
        <div className="grid gap-12 border border-border bg-card p-6 sm:p-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <span className="eyebrow text-gold">Get the Complete Catalogue</span>
            <h2 className="display-md mt-4 text-primary">
              Tell us a little about your requirement.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We'll send you the catalogue and, if you'd like, help you shortlist gifts for your
              occasion.
            </p>
          </div>
          <CatalogueFormBlock />
        </div>
      </section>
    </>
  );
}

function CatalogueFormBlock() {
  return <LeadForm source="catalogue" showLookingFor submitLabel="Get My Catalogue" />;
}
