/**
 * Real customer proof, shown only when it exists. Add entries here once a client agrees to be quoted
 * or an event photograph is cleared for use; empty lists render nothing. Never add invented entries.
 */
export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Wedding planner, Hyderabad" */
  role: string;
  /** Optional source link, such as the Google review. */
  sourceUrl?: string;
}

export interface EventPhoto {
  /** Path under /public, e.g. /events/sharma-wedding.jpg */
  src: string;
  alt: string;
  caption: string;
}

export const TESTIMONIALS: Testimonial[] = [];
export const EVENT_PHOTOS: EventPhoto[] = [];
