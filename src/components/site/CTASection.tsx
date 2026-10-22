import { Link } from "@tanstack/react-router";
import { useLeadDialog } from "./LeadDialog";

export function CTASection({
  eyebrow = "Catalogue",
  title = "Get the 2026 Catalogue",
  description = "Explore our curated gifting collection for celebrations, occasions and corporate moments.",
}: {
  eyebrow?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
}) {
  const { openCatalogue } = useLeadDialog();

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-24 sm:px-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow text-gold-soft">{eyebrow}</span>
          </div>
          <h2 className="display-lg mt-5 max-w-xl text-primary-foreground">{title}</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/75">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <button
            type="button"
            onClick={() => openCatalogue()}
            className="rounded-sm bg-gold-soft px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get the Catalogue
          </button>
          <Link
            to="/contact"
            className="rounded-sm border border-primary-foreground/35 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:border-gold-soft hover:text-gold-soft"
          >
            Talk to Giftory
          </Link>
        </div>
      </div>
    </section>
  );
}
