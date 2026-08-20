import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/data/catalog";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Aravind Giftory" },
      {
        name: "description",
        content:
          "How Aravind Giftory collects, uses and stores the details you share through enquiry and catalogue forms.",
      },
      { property: "og:title", content: "Privacy Policy | Aravind Giftory" },
      { property: "og:description", content: "How we handle the details you share with us." },
      { property: "og:url", content: "/privacy-policy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-36 sm:px-8 lg:pt-44">
      <span className="eyebrow">Legal</span>
      <h1 className="display-lg mt-4 text-primary">Privacy Policy</h1>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          When you submit an enquiry, catalogue request or quote request on this website, we collect
          the details you provide — such as your name, mobile number, email address, occasion,
          quantity, budget and message.
        </p>
        <p>
          We use these details only to respond to your gifting requirement, share the catalogue, and
          follow up about a quote or order. We do not sell your details.
        </p>
        <p>
          If you'd like your details removed from our records, contact us at {BRAND.phone} or through
          Instagram at @{BRAND.instagram} and we'll take care of it.
        </p>
      </div>
    </section>
  );
}
