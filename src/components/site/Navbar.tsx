import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.svg";
import { BRAND, whatsappLink } from "@/data/catalog";
import { useLeadDialog } from "./LeadDialog";

const links = [
  { to: "/collections", label: "Collections" },
  { to: "/occasions", label: "Occasions" },
  { to: "/corporate-gifting", label: "Corporate Gifting" },
  { to: "/about", label: "About" },
  { to: "/catalogue", label: "Catalogue" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useLeadDialog();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-[oklch(0.978_0.012_90_/_0.92)] backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label={`${BRAND.name} — home`}>
          <img src={logo} alt="" width={140} height={71} className="h-10 w-auto" />
          <span className="sr-only">{BRAND.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="link-underline text-[0.8rem] font-medium uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink(`Hi ${BRAND.name}, I'd like to know more about your gifting.`)}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary sm:flex"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() =>
              open({
                source: "bulk-quote",
                title: "Get a Quote",
                intro: "Share your occasion, quantity and budget — we'll come back with options.",
                submitLabel: "Request a Quote",
              })
            }
            className="hidden rounded-sm bg-primary px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90 sm:block"
          >
            Get a Quote
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-primary lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-background px-6 py-10 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                open({
                  source: "bulk-quote",
                  title: "Get a Quote",
                  submitLabel: "Request a Quote",
                });
              }}
              className="w-full rounded-sm bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Get a Quote
            </button>
            <a
              href={whatsappLink(`Hi ${BRAND.name}, I'd like to know more about your gifting.`)}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-sm border border-border px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-foreground"
            >
              Talk to Giftory
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
