import type { ReadonlyLink } from "../../../data/mockData";

export interface MonochromeFooterProps extends Readonly<{
  brand: string;
  tagline?: string;
  subline?: string;
  links: readonly ReadonlyLink[];
  copyright: string;
  variant?: "landing" | "settings";
}> {}

function splitSupportLinks(links: readonly ReadonlyLink[]) {
  const supportLabels = new Set(["Buy Me a Coffee", "PayPal", "Ko-fi", "Zypage"]);
  return {
    featured: links.find((link) => link.label === "Buy Me a Coffee") ?? null,
    support: links.filter((link) => supportLabels.has(link.label)),
    regular: links.filter((link) => !supportLabels.has(link.label)),
  };
}

export function MonochromeFooter({
  brand,
  tagline,
  subline,
  links,
  copyright,
  variant = "landing",
}: MonochromeFooterProps) {
  const { featured, support, regular } = splitSupportLinks(links);
  return (
    <footer
      className={`w-full py-12 ${
        variant === "settings"
          ? "bg-[var(--surface_container_lowest)]"
          : "bg-[var(--surface_container_low)]"
      }`}
    >
      <div className="editorial-shell grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div className="space-y-5">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-display text-lg font-black tracking-[-0.04em] text-[var(--text)]">
              {brand}
            </div>
            {tagline ? (
              <div className="text-xs uppercase tracking-wide text-[var(--text-soft)]">{tagline}</div>
            ) : null}
            {subline ? <div className="text-xs text-[var(--text-soft)]">{subline}</div> : null}
          </div>

          {featured ? (
            <div className="surface-card flex flex-col gap-4 p-5">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-soft)]">
                  Support The Project
                </div>
                <div className="font-display text-2xl font-black tracking-[-0.04em] text-[var(--text)]">
                  Keep Social Media Rotator Free
                </div>
                <p className="text-sm leading-6 text-[var(--text-muted)]">
                  Support maintenance, new overlay presets, and future upgrades for streamers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a href={featured.href} className="button-primary px-5 py-3 text-sm font-bold">
                  Buy Me a Coffee
                </a>
                {support
                  .filter((link) => link.label !== "Buy Me a Coffee")
                  .map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="ghost-button px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text)]"
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-6 md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-8 md:justify-end">
            {regular.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-xs uppercase tracking-wide text-[var(--text-soft)] transition-opacity hover:text-[var(--text)] ${
                  variant === "settings" ? "underline underline-offset-4" : "opacity-80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-xs uppercase tracking-wide text-[var(--text-soft)] opacity-80">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
