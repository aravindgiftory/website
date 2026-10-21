import { BRAND } from "@/data/catalog";
import type { FaqItem } from "@/components/site/Faq";

/**
 * Local development and any build made with VITE_NOINDEX=true (staging, previews) must not be
 * indexed. Production builds leave both unset and stay indexable.
 */
export const NOINDEX = import.meta.env.DEV || import.meta.env.VITE_NOINDEX === "true";

export const absoluteUrl = (path: string) => `${BRAND.siteUrl}${path}`;

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList structured data, as a head `scripts` entry. */
export function breadcrumbScript(crumbs: Crumb[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    }),
  };
}

/** FAQPage structured data, as a head `scripts` entry. Mirrors the visible questions exactly. */
export const faqScript = (items: FaqItem[]) => ({
  type: "application/ld+json",
  children: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }),
});
