import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/site/LeadForm";
import { BRAND, whatsappLink } from "@/data/catalog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Aravind Giftory | Hyderabad Gifting" },
      {
        name: "description",
        content:
          "Talk to Aravind Giftory about gifts for weddings, celebrations and corporate occasions. Call +91 6309-645424 or send an enquiry.",
      },
      { property: "og:title", content: "Contact Aravind Giftory" },
      {
        property: "og:description",
        content: "Talk to Giftory about your gifting requirement.",
      },
      { property: "og:url", content: `${BRAND.siteUrl}/contact` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${BRAND.siteUrl}/contact` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">Contact</span>
          </div>
          <h1 className="display-lg mt-5 text-primary">Talk to Giftory</h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            Tell us your occasion, quantity and budget — we'll help narrow down the choices.
          </p>

          <dl className="mt-12 space-y-6 border-t border-border pt-8 text-sm">
            <div>
              <dt className="eyebrow">Aravind Giftory</dt>
              <dd className="mt-2 text-foreground">{BRAND.city}</dd>
            </div>
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-2">
                <a href={BRAND.phoneHref} className="link-underline text-foreground">
                  {BRAND.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Instagram</dt>
              <dd className="mt-2">
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-foreground"
                >
                  @{BRAND.instagram}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(`Hi ${BRAND.name}, I'd like help choosing gifts.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm bg-primary px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Message on WhatsApp
            </a>
            <a
              href={BRAND.phoneHref}
              className="rounded-sm border border-primary/25 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary"
            >
              Call {BRAND.phone}
            </a>
          </div>

          {/* Location placeholder — drop an embedded map here when the address is finalised. */}
          <div className="mt-10 flex aspect-[16/10] items-center justify-center border border-dashed border-border bg-card text-center">
            <p className="max-w-xs px-6 text-sm text-muted-foreground">
              Map location coming soon · {BRAND.city}
            </p>
          </div>
        </div>

        <div className="border border-border bg-card p-6 sm:p-10">
          <h2 className="display-md text-primary">Send an Enquiry</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We'll get back to you with suggestions for your occasion.
          </p>
          <div className="mt-8">
            <LeadForm source="contact" submitLabel="Send Enquiry" showLookingFor />
          </div>
        </div>
      </div>
    </section>
  );
}
