import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "giftory-cookie-consent";
const GA_ID = import.meta.env.VITE_GA_ID?.trim();

type Choice = "accepted" | "declined";

function loadAnalytics() {
  if (!GA_ID || document.getElementById("ga-script")) return;
  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const gtag = (...args: unknown[]) => w.dataLayer.push(args);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "accepted") loadAnalytics();
    else if (choice === null) setVisible(true);
  }, []);

  // Without an analytics ID there is nothing to consent to.
  if (!visible || !GA_ID) return null;

  const choose = (choice: Choice) => {
    try {
      window.localStorage.setItem(KEY, choice);
    } catch {
      /* storage unavailable — choice applies to this visit only */
    }
    if (choice === "accepted") loadAnalytics();
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:left-6 sm:right-auto sm:mx-0"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        We use analytics cookies to see which gifts people look at. Nothing is tracked unless you
        accept. See the{" "}
        <Link to="/privacy-policy" className="link-underline text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="rounded-sm bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("declined")}
          className="rounded-sm border border-primary/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
