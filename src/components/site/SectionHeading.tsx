import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  description?: string | undefined;
  align?: "left" | "center" | undefined;
  action?: ReactNode | undefined;
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-6 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && (
          <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
            <span className="rule-gold" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        )}
        <h2 className="display-lg mt-5 text-primary">{title}</h2>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
