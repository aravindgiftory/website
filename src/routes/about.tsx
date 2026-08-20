import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { BRAND } from "@/data/catalog";
import brandStory from "@/assets/brand-story.jpg";
import occasionPooja from "@/assets/occasion-pooja.jpg";
import occasionHousewarming from "@/assets/occasion-housewarming.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aravind Giftory | Curated Gifting from Hyderabad" },
      {
        name: "description",
        content:
          "Aravind Giftory curates traditional, contemporary and practical gifting for weddings, celebrations and corporate occasions, from Hyderabad.",
      },
      { property: "og:title", content: "About Aravind Giftory" },
      {
        property: "og:description",
        content: "Thoughtful gifting, curated for every occasion — from Hyderabad.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-8 lg:pt-44">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">{BRAND.name}</span>
          </div>
          <h1 className="display-xl mt-6 text-primary">
            Thoughtful Gifting, Curated for Every Occasion.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground">
            Aravind Giftory is a curated gifting business based in {BRAND.city}. Our collections
            bring together traditional Indian pieces, contemporary decor and practical everyday
            gifts — chosen so that a return gift is something guests actually keep and use.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1400px] px-5 sm:px-8">
        <div className="overflow-hidden bg-muted">
          <img
            src={brandStory}
            alt="Gifts being curated and packed at the Aravind Giftory workshop in Hyderabad"
            width={1400}
            height={1200}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="What we do" title="Gifting across occasions" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Our catalogue spans weddings, birthdays, baby showers, housewarmings, pooja and
              festive occasions, general celebrations, corporate gifting and return gifts. Within
              those, collections range from brass diyas, pooja thalis and Pichwai-inspired metal
              pieces to ceramic tea sets, dinner sets, storage, lighting and curated gift sets.
            </p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Our workshop is in {BRAND.city}, where gifts are curated, packed and prepared for
              celebrations of every size.
            </p>
            <Link
              to="/collections"
              className="link-underline mt-8 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary"
            >
              Explore Collection
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src={occasionPooja}
              alt="Brass pooja thali and diya from the traditional collection"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <img
              src={occasionHousewarming}
              alt="Urli and storage jars from the home collection"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover sm:mt-12"
            />
          </div>
        </div>
      </section>

      <div className="mt-32">
        <CTASection
          eyebrow="Contact"
          title="Tell us about your occasion."
          description="Share your requirement and we'll help narrow down the choices."
        />
      </div>
    </>
  );
}
