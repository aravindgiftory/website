/**
 * Conversion tracking on top of the existing Google Analytics 4 setup (VITE_GA_ID, loaded only
 * after cookie consent). Events are sent only while analytics is active, so nothing is recorded
 * or queued before the visitor accepts.
 */

type GtagWindow = Window & { dataLayer?: unknown[]; __giftoryAnalytics?: boolean };

const GA_ID = import.meta.env.VITE_GA_ID?.trim();
const ATTRIBUTION_KEY = "giftory-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export interface Attribution {
  landingPage?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/** Loads GA4. Call only after the visitor accepted analytics cookies. */
export function loadAnalytics() {
  if (!GA_ID || typeof window === "undefined" || document.getElementById("ga-script")) return;
  const w = window as GtagWindow;
  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
  w.dataLayer = w.dataLayer || [];
  const gtag = (...args: unknown[]) => w.dataLayer?.push(args);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
  w.__giftoryAnalytics = true;
}

/** Sends a GA4 event. Does nothing without consent or a measurement ID. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (!w.__giftoryAnalytics || !w.dataLayer) return;
  const clean: Record<string, string | number | boolean> = {
    page_path: window.location.pathname,
    ...params,
  };
  w.dataLayer.push(["event", name, clean]);
}

/**
 * Remembers where this visit started (landing page, referrer, UTM campaign) for the session, so a
 * lead submitted later can be attributed. Stored in sessionStorage, which needs no consent banner
 * because it never leaves the browser until the visitor submits an enquiry.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const query = new URLSearchParams(window.location.search);
    const attribution: Attribution = {
      landingPage: window.location.pathname,
      ...(document.referrer ? { referrer: document.referrer } : {}),
    };
    for (const key of UTM_KEYS) {
      const value = query.get(key);
      if (value) attribution[key] = value.slice(0, 100);
    }
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    /* storage unavailable — leads are simply sent without attribution */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}
