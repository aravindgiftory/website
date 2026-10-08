import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  type ErrorComponentProps,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { LeadDialogProvider } from "@/components/site/LeadDialog";
import { EnquiryProvider } from "@/components/site/EnquiryProvider";
import { EnquiryTray } from "@/components/site/EnquiryTray";
import { CookieBanner } from "@/components/site/CookieBanner";
import { BRAND } from "@/data/catalog";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <span className="eyebrow">Aravind Giftory</span>
        <h1 className="display-lg mt-4 text-primary">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display-md text-primary">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-sm border border-border px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aravind Giftory | Thoughtful Gifts for Every Occasion" },
      {
        name: "description",
        content:
          "Curated return gifts and premium gifting collections for weddings, birthdays, baby showers, housewarmings, festive occasions and corporate events.",
      },
      { property: "og:site_name", content: "Aravind Giftory" },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#5a1a1a" },
      { property: "og:image", content: `${BRAND.siteUrl}/og-image.jpg` },
      { property: "og:image:width", content: "1280" },
      { property: "og:image:height", content: "1280" },
      { property: "og:image:alt", content: "Aravind Giftory curated gift box" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BRAND.siteUrl}/og-image.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      ...[
        "cormorant-garamond-normal-latin",
        "cormorant-garamond-italic-latin",
        "manrope-normal-latin",
      ].map((name) => ({
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: `/fonts/${name}.woff2`,
        crossOrigin: "anonymous" as const,
      })),
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Aravind Giftory",
          description:
            "Curated gifting collections for weddings, celebrations and corporate occasions.",
          address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
          telephone: "+91 6309-645424",
          sameAs: ["https://instagram.com/aravindgiftory"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <EnquiryProvider>
        <LeadDialogProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <Footer />
          <WhatsAppButton />
          <EnquiryTray />
          <CookieBanner />
        </LeadDialogProvider>
      </EnquiryProvider>
    </QueryClientProvider>
  );
}
