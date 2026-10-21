# SEO and lead generation: what was checked and changed

Stack: TanStack Start (React 19, Vite, Nitro) with server-side rendering, Tailwind. Enquiries go to a
Google Apps Script (`scripts/lead-mail.gs`) and open a pre-filled WhatsApp message. Analytics is GA4
(`VITE_GA_ID`), loaded only after cookie consent. No GTM exists.

## Verified before changing

| Finding                                                                                           | Evidence                       | Status                                                                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| Pages are server-rendered (title, canonical, one h1, JSON-LD in the HTML)                         | `curl` of the production build | Already fine                                                                              |
| `/collections`, `/occasions` and every `/collections/<slug>` page had **no h1**                   | HTML check                     | Fixed                                                                                     |
| Local/staging builds were indexable                                                               | no robots meta anywhere        | Fixed (see below)                                                                         |
| Only an Organization schema existed; no BreadcrumbList                                            | HTML check                     | Fixed                                                                                     |
| Wedding and Birthday were **disabled "Coming Soon"** occasion options in every form               | `src/lib/leads.ts`             | Fixed                                                                                     |
| "More catalogues coming soon" chip and a "Map location coming soon" box were visible placeholders | `catalogue.tsx`, `contact.tsx` | Removed                                                                                   |
| Forms required a consent tick-box, last name, "looking for" and quantity                          | `LeadForm.tsx`                 | Simplified                                                                                |
| A missing `VITE_LEADS_SCRIPT_URL` made every form report success while only WhatsApp opened       | `submitLead`                   | Fixed: the success message now says so honestly                                           |
| Delivery to Apps Script was blind (`no-cors`), so failures were silent                            | `submitLead`                   | Now reads the script's `{ok}` reply; falls back to a blind send reported as "unconfirmed" |
| Occasion detail pages listed placeholder (stock) products                                         | `occasions.$occasion.tsx`      | Now show real catalogue products                                                          |
| A few images lack width/height attributes (collection tiles, edits, about)                        | source scan                    | Open: they use CSS aspect ratios, so layout shift is low                                  |

## Changes by file

- `src/lib/seo.ts` (new): `NOINDEX` guard, `breadcrumbScript`, `faqScript`.
- `src/routes/__root.tsx`: robots meta (`noindex, nofollow` in dev or when `VITE_NOINDEX=true`, otherwise
  `index, follow`), richer Organization data (`@id`, `url`, `logo`), phone/WhatsApp click tracking,
  campaign capture.
- `src/lib/analytics.ts` (new): consent-gated GA4 events, UTM and landing-page capture.
- `src/components/site/CookieBanner.tsx`: uses the shared analytics loader.
- `src/lib/leads.ts`: verified delivery, attribution on every lead, `generate_lead` event, Wedding and
  Birthday enabled.
- `src/components/site/LeadForm.tsx`: single name field, only name and phone required, no consent tick
  box (a privacy notice instead), product/collection message prefilled, accessible errors and busy state,
  honest success message. The honeypot stays hidden and off-screen.
- `src/lib/catalogue-download.ts`: `file_download` event.
- `scripts/lead-mail.gs`: emails landing page, campaign and referrer. **Redeploy the Apps Script.**
- `src/lib/occasion-products.ts` (new): shared real-product selection for occasion pages.
- `src/components/site/Faq.tsx` and `src/data/seo-copy.ts` (new): visible FAQs with matching FAQPage data;
  every answer uses data already on the site (minimum 25 pieces, from ₹150, budget tiers, catalogue
  contents). No delivery times, stock or discounts are promised.
- `src/routes/index.tsx`, `corporate-gifting.tsx`, `occasions.index.tsx`, `occasions.$occasion.tsx`,
  `collections.index.tsx`, `collections.$category.tsx`, `products.$product.tsx`, `gifts.$catalogue.tsx`:
  search-intent titles and descriptions, BreadcrumbList, FAQs, h1 where missing, and Request a Bulk Quote
  plus Enquire on WhatsApp on the corporate page.
- `.env.example`, `src/vite-env.d.ts`: `VITE_NOINDEX`.

## Deliberately not done

- **Product schema.** The site has no prices, stock or reviews, so Product rich results would not be
  eligible. Add it only when real prices exist.
- **LocalBusiness schema, address and map.** Only the city and phone are verified. Add a street address
  and map once confirmed.
- **Customer reviews, event photos and testimonials.** None are supplied. The "Celebrations" stories on
  the home page are illustrative copy, not client testimonials; replace them with real ones.
- **New landing pages.** Existing occasion pages already target wedding, baby shower, housewarming, festive
  and corporate intent with distinct products and FAQs. Add a page only with distinct content.
- **404 pages** return status 404 but still carry the default robots tag.

## Steps that need your accounts

1. Set `VITE_SITE_URL` (production domain), `VITE_LEADS_SCRIPT_URL` and `VITE_GA_ID` in the production
   build. Set `VITE_NOINDEX=true` on every staging or preview build.
2. Redeploy the Apps Script web app (access: Anyone) so it returns JSON and emails the new fields.
3. Google Search Console: verify the domain, submit `/sitemap.xml`, inspect the home, corporate and
   occasion URLs, then watch queries for the keyword hypotheses (bulk return gifts, wedding return gifts,
   corporate gifting Hyderabad). Rankings are not claimed; check the data after a few weeks.
4. Google Analytics: mark `generate_lead` as a key event; also useful are `whatsapp_click`, `phone_click`
   and `file_download`. `generate_lead` carries `lead_source`, `occasion`, `quantity`, `budget`,
   `qualified`, `landing_page` and `campaign`.
5. Google Business Profile: claim and verify it; keep the name, phone and city identical to the site;
   add real photos and ask satisfied clients for reviews.
6. After deployment, run the Rich Results Test on `/`, `/corporate-gifting` and `/occasions/wedding`.

## Round 2: geographic relevance, product and category pages, technical audit

### Changes

- **Home page**: a plain-language "Gifting services in Hyderabad" section links to bulk return gifts, wedding,
  corporate, Diwali and festive, baby shower and naming ceremony, and housewarming pages. It states only
  verified facts (Hyderabad base, 25-piece minimum).
- **Individual product pages (new)**: `/gift/<code>-<name>` for each of the 259 catalogue products, with name,
  code, "what's included" (extracted from the catalogue PDFs where it exists), the full catalogue page,
  Enquire now and WhatsApp buttons, related products, breadcrumbs and an internal link from every product
  card. Pages with fewer than two content lines (all Luxury Gifting items and 38 corporate sets) are
  `noindex, follow` and left out of the sitemap, so thin pages do not dilute the site.
- **Category pages**: `/collections/<slug>` now serve the nine real collections (hampers by budget, snacks,
  corporate gift sets, brass diyas, dry fruit boxes and serveware, drinkware, storage) with an intro, product
  grid, FAQs, breadcrumbs and links to the other collections. The ten retired placeholder collection URLs return a
  permanent 301 redirect to `/collections`.
- **Placeholder products** (`/products/<slug>` without a real photograph) are `noindex, follow` and no longer in
  the sitemap. Real cork planters and combos stay indexable.
- **Sitemap**: 226 URLs, all canonical on the production domain.

### Verified on the production build (not on the live site)

All 226 sitemap URLs return 200, have the production canonical, one h1, a unique title (≤70 characters) and
unique description (≤200), valid JSON-LD and image alt text, and none carries `noindex`. Retired collection URLs
301, unknown URLs 404, `/catalogue/print` is noindex and disallowed in robots.txt.

### Not verifiable from here

Google indexing itself. Nothing has been deployed or pushed, so the live site and Search Console were not
checked. After deploying: submit the sitemap, inspect a few `/gift/…` URLs, and watch Coverage for "Crawled -
currently not indexed". The 137 indexable product pages are the most likely to be slow to index.

## Round 3: buyer landing pages, offers, WhatsApp and proof

- **Four landing pages** under `/for/`: `wedding-planners`, `families`, `hr-teams`, `corporate-buyers`. Each has its
  own h1, intro, "what matters" points, starter gifts from real collections, relevant catalogue downloads, a
  checklist of what to send, a WhatsApp message builder, FAQs and breadcrumb/FAQ schema. Copy lives in
  `src/data/audiences.ts` and uses only facts already on the site (25-piece minimum, from ₹150, budget tiers,
  brand-ready corporate sets, gift message card, Hyderabad packing and delivery). They are linked from the
  home page, the footer and the sitemap.
- **Catalogue offers**: cards with the real cover, page count and product count; Get the catalogue opens the
  existing lead-gated download, Browse pages opens the full catalogue. No discounts or free gifts are claimed.
- **Easier WhatsApp**: a two-tap message builder (occasion, quantity, budget, date), a labelled floating
  "WhatsApp us" button, and a message that carries the page the buyer was on. Clicks are tracked as
  `whatsapp_click`.
- **Proof**: verifiable counts (259 coded products, 14 catalogues, 25-piece minimum, from ₹150) plus
  testimonial and event-photo slots in `src/data/proof.ts` that stay hidden until real entries are added.
  The home page section previously titled "Celebrations We've Been Part Of" is now "Gift ideas for every
  celebration", because its text is illustrative and must not read as client history.

To add real proof, append entries to `TESTIMONIALS` and `EVENT_PHOTOS` in `src/data/proof.ts` (photos go in
`public/events/`). Only add quotes and photos the client has agreed to share.

## Diwali season

- The new Diwali Hampers catalogue replaces the earlier Diwali PDF: 11 gift sets (DW 001 to DW 013, with no DW 005 or DW 008
  in the catalogue), each with a card, product page, search entry and a "Diwali Hampers" collection.
  Product names were written from each page's item list because the catalogue pages carry no titles; the item lists are
  transcribed from the pages.
- The home page shows a Diwali Hampers highlight band, fairy lights, diyas and a light firecracker and ember animation until
  `DIWALI_ACTIVE_UNTIL` in `src/data/festival.ts` (12 November 2026), then removes them by itself. Change that date each year.
  The animation pauses off-screen and in hidden tabs and is off for visitors who prefer reduced motion.
