import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroComposition from "@/assets/hero-composition.jpg";
import brassDiya from "@/assets/product-brass-lotus-diya.jpg";
import crystalBall from "@/assets/product-crystal-ball-light.jpg";
import pichwaiTray from "@/assets/product-pichwai-tray.jpg";
import { BRAND } from "@/data/catalog";
import { useLeadDialog } from "./LeadDialog";

/**
 * Hero "Gift Universe" — a layered CSS-perspective composition. No WebGL:
 * depth comes from transforms, scale, shadow and parallax offsets, so it stays
 * light on mobile. All motion is disabled under prefers-reduced-motion.
 */
export function Hero() {
  const { openCatalogue } = useLeadDialog();
  const [offset, setOffset] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(Math.min(window.scrollY, 600)));
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPointer({
        x: (event.clientX - (rect.left + rect.width / 2)) / rect.width,
        y: (event.clientY - (rect.top + rect.height / 2)) / rect.height,
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const depth = (factor: number) => ({
    transform: `translate3d(${pointer.x * 18 * factor}px, ${offset * 0.06 * factor + pointer.y * 14 * factor}px, 0)`,
  });

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(70%_60%_at_70%_20%,oklch(0.93_0.05_84_/_0.65),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div className="rise-in">
          <div className="flex items-center gap-3">
            <span className="rule-gold" />
            <span className="eyebrow">{BRAND.name}</span>
          </div>
          <h1 className="display-xl mt-7 max-w-xl text-primary">
            Not Just a Return Gift.
            <span className="block italic text-secondary">A Little Memory to Take Home.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
            Curated gifting collections for life's memorable occasions.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/collections"
              className="rounded-sm bg-primary px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore the Collection
            </Link>
            <button
              type="button"
              onClick={() => openCatalogue()}
              className="rounded-sm border border-primary/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary"
            >
              Get the 2026 Catalogue
            </button>
          </div>
          <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Weddings · Birthdays · Baby Showers · Housewarmings · Pooja &amp; Festive · Corporate
          </p>
        </div>

        <div
          ref={sceneRef}
          className="relative [perspective:1400px]"
          aria-hidden="true"
        >
          <div
            className="relative overflow-hidden rounded-sm border border-border shadow-[var(--shadow-lift)]"
            style={{
              transform: `rotateY(${pointer.x * -3}deg) rotateX(${pointer.y * 2}deg) translate3d(0, ${offset * -0.03}px, 0)`,
              transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <img
              src={heroComposition}
              alt="An open burgundy gift box surrounded by a brass lotus diya, ceramic cup, crystal leaf lamp, Pichwai-print container and a dry fruit box"
              width={1280}
              height={1280}
              className="w-full object-cover"
            />
          </div>

          <div
            className="float-slow absolute -left-4 top-8 hidden w-28 overflow-hidden rounded-sm border border-border bg-card shadow-[var(--shadow-soft)] sm:block lg:w-36"
            style={depth(1.4)}
          >
            <img src={brassDiya} alt="" width={1200} height={1200} loading="lazy" className="w-full" />
          </div>
          <div
            className="float-slower absolute -right-3 top-1/3 hidden w-24 overflow-hidden rounded-sm border border-border bg-card shadow-[var(--shadow-soft)] sm:block lg:w-32"
            style={depth(-1.1)}
          >
            <img src={crystalBall} alt="" width={1200} height={1200} loading="lazy" className="w-full" />
          </div>
          <div
            className="float-slow absolute -bottom-6 left-1/4 hidden w-28 overflow-hidden rounded-sm border border-border bg-card shadow-[var(--shadow-soft)] md:block lg:w-36"
            style={depth(0.8)}
          >
            <img src={pichwaiTray} alt="" width={1200} height={1200} loading="lazy" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
