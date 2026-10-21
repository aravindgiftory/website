import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { searchProducts, SEARCH_TOTAL, type SearchItem } from "@/lib/search";

function ResultLink({
  item,
  onNavigate,
  className,
  children,
}: {
  item: SearchItem;
  onNavigate: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return item.kind === "gift" ? (
    <Link to="/gift/$slug" params={{ slug: item.slug }} onClick={onNavigate} className={className}>
      {children}
    </Link>
  ) : (
    <Link
      to="/products/$product"
      params={{ product: item.slug }}
      onClick={onNavigate}
      className={className}
    >
      {children}
    </Link>
  );
}

/** Full-width search under the header: type a product name or code and open it straight away. */
export function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProducts(query, 6), [query]);
  const trimmed = query.trim();

  useEffect(() => {
    input.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    onClose();
    void navigate({ to: "/search", search: { q: trimmed } });
  };

  return (
    <div
      role="search"
      className="absolute inset-x-0 top-full border-b border-border bg-background shadow-[var(--shadow-soft)]"
    >
      <div className="mx-auto max-w-3xl px-5 py-5 sm:px-8">
        <form onSubmit={submit} className="flex items-center gap-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="site-search" className="sr-only">
            Search gifts by name or product code
          </label>
          <input
            ref={input}
            id="site-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by gift name or code, e.g. AG-CO-007"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div aria-live="polite" className="mt-3 border-t border-border pt-3">
          {trimmed.length < 2 ? (
            <p className="text-sm text-muted-foreground">
              Search {SEARCH_TOTAL} gifts by name, product code or what's inside.
            </p>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No gifts match "{trimmed}". Try part of the name or just the number of the code.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border">
                {results.map((item) => (
                  <li key={`${item.kind}-${item.slug}`}>
                    <ResultLink
                      item={item}
                      onNavigate={onClose}
                      className="flex items-center gap-4 py-3 hover:bg-card"
                    >
                      <img
                        src={item.image}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                        className="h-12 w-12 shrink-0 border border-border bg-white object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg text-primary">
                          {item.name}
                        </span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                          {item.code}
                        </span>
                      </span>
                    </ResultLink>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="link-underline mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
              >
                See all results for "{trimmed}"
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
