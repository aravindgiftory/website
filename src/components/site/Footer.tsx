import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import { BRAND } from "@/data/catalog";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/collections", label: "Collections" },
      { to: "/occasions", label: "Occasions" },
      { to: "/corporate-gifting", label: "Corporate Gifting" },
    ],
  },
  {
    title: "Giftory",
    links: [
      { to: "/catalogue", label: "Catalogue" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-[oklch(0.951_0.018_86)]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={logo} alt={BRAND.name} width={180} height={92} className="h-14 w-auto" />
            <p className="mt-6 max-w-xs font-display text-2xl leading-snug text-primary">
              {BRAND.tagline}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="eyebrow">{column.title}</h3>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="link-underline text-sm text-foreground/80 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow">Contact</h3>
            <ul className="mt-6 space-y-3 text-sm text-foreground/80">
              <li>{BRAND.city}</li>
              <li>
                <a href={BRAND.phoneHref} className="link-underline hover:text-primary">
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline hover:text-primary"
                >
                  @{BRAND.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="link-underline hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="link-underline hover:text-primary">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
