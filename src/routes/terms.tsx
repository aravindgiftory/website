import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/data/catalog";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Aravind Giftory" },
      {
        name: "description",
        content:
          "Terms for using the Aravind Giftory website, catalogue requests and gifting enquiries.",
      },
      { property: "og:title", content: "Terms & Conditions | Aravind Giftory" },
      { property: "og:description", content: "Terms for using this website and our enquiry forms." },
      { property: "og:url", content: "/terms" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-36 sm:px-8 lg:pt-44">
      <span className="eyebrow">Legal</span>
      <h1 className="display-lg mt-4 text-primary">Terms &amp; Conditions</h1>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          This website presents the {BRAND.name} gifting catalogue for reference. It is an enquiry
          and catalogue platform — orders are not placed or paid for on this website.
        </p>
        <p>
          Product images, names and codes are shown for identification. Availability, finishes and
          set contents may vary; details are confirmed at the time of quoting.
        </p>
        <p>
          Quantities, pricing and timelines are shared directly against each enquiry. Any order is
          governed by the quotation issued by {BRAND.name}.
        </p>
      </div>
    </section>
  );
}
