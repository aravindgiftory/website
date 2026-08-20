import { BRAND, whatsappLink } from "@/data/catalog";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(`Hi ${BRAND.name}, I'd like help choosing gifts.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Talk to Giftory on WhatsApp"
      data-whatsapp-fab
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-primary shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2.5c-5.25 0-9.5 4.25-9.5 9.5 0 1.67.44 3.3 1.28 4.74L2.5 21.5l4.9-1.28a9.46 9.46 0 0 0 4.64 1.2h.01c5.24 0 9.5-4.26 9.5-9.5s-4.26-9.42-9.51-9.42zm0 17.4h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.9.76.77-2.83-.19-.29a7.88 7.88 0 0 1-1.21-4.2c0-4.36 3.55-7.9 7.91-7.9 2.11 0 4.09.82 5.58 2.31a7.84 7.84 0 0 1 2.31 5.59c0 4.36-3.55 7.83-7.95 7.83z" />
      </svg>
    </a>
  );
}
