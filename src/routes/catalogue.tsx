import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LeadForm } from "@/components/site/LeadForm";
import { edits } from "@/data/catalog";
import catalogueCover from "@/assets/catalogue-cover.jpg";
import catalogueSpread from "@/assets/catalogue-spread.jpg";
import { downloadCatalogue } from "@/lib/catalogue-download";

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
      { property: "og:url", content: "/catalogue" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/catalogue" }],
  }),
  component: CataloguePage,
});

function CataloguePage() {
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
              <button
                type="button"
                onClick={downloadCatalogue}
                className="rounded-sm border border-primary/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
              >
                Preview &amp; Download
              </button>
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

      <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          eyebrow="Inside"
          title="A look through the pages"
          description="Traditional brass, Pichwai-inspired metal, dining, lighting and corporate gifting — page by page."
        />
        <div className="mt-14 overflow-hidden bg-muted">
          <img
            src={catalogueSpread}
            alt="An open spread of the Aravind Giftory catalogue showing gifting products"
            width={1400}
            height={1000}
            loading="lazy"
            className="w-full object-cover"
          />
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {edits.map((edit) => (
            <div key={edit.title}>
              <div className="overflow-hidden bg-muted">
                <img
                  src={edit.image}
                  alt={edit.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-xl text-primary">{edit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{edit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="catalogue-form" className="mx-auto mt-32 max-w-[1400px] scroll-mt-28 px-5 sm:px-8">
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
