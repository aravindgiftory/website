import { SectionHeading } from "./SectionHeading";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Native, no-JavaScript accordion, so answers are in the HTML for search engines and readers. */
export function FaqSection({
  items,
  title = "Questions buyers ask us",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section className="mx-auto mt-32 max-w-[1400px] px-5 sm:px-8">
      <SectionHeading eyebrow="FAQ" title={title} />
      <div className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
        {items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl text-primary">
              {item.question}
              <span
                aria-hidden="true"
                className="text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
