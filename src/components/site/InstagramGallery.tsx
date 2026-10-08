import { BRAND } from "@/data/catalog";
import occasionWedding from "@/assets/occasion-wedding.jpg";
import occasionPooja from "@/assets/occasion-pooja.jpg";
import occasionHousewarming from "@/assets/occasion-housewarming.jpg";
import occasionBirthday from "@/assets/occasion-birthday.jpg";
import brandStory from "@/assets/brand-story.jpg";
import dryFruit from "@/assets/product-dry-fruit-box.jpg";

const tiles = [
  occasionWedding,
  occasionPooja,
  brandStory,
  occasionHousewarming,
  dryFruit,
  occasionBirthday,
];

export function InstagramGallery() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">Instagram</span>
          </div>
          <h2 className="display-lg mt-5 text-primary">A Little Giftory, Every Day</h2>
          <p className="mt-3 text-sm text-muted-foreground">@{BRAND.instagram}</p>
        </div>
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="link-underline self-start text-xs font-semibold uppercase tracking-[0.16em] text-primary"
        >
          Follow on Instagram
        </a>
      </div>

      <div className="mt-12 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {tiles.map((tile, index) => (
          <a
            key={index}
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden bg-muted"
          >
            <img
              src={tile}
              alt={`${BRAND.name} gifting on Instagram`}
              loading="lazy"
              className={`w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                index % 3 === 0
                  ? "aspect-[3/4]"
                  : index % 3 === 1
                    ? "aspect-square"
                    : "aspect-[4/5]"
              }`}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
