import type { ReactNode } from "react";

import type { ReadonlyLink } from "../../../data/mockData";
import { sitePath } from "../../../lib/site.ts";

export interface MonochromeHeaderProps extends Readonly<{
  brand: string;
  eyebrow?: string;
  subtitle?: string;
  navLinks?: readonly ReadonlyLink[];
  actions?: ReactNode;
  brandHref?: string;
}> {}

export function MonochromeHeader({
  brand,
  eyebrow,
  subtitle,
  navLinks = [],
  actions,
  brandHref = sitePath(""),
}: MonochromeHeaderProps) {
  return (
    <header className="glass-nav fixed top-0 z-50 w-full">
      <div className="editorial-shell flex h-20 items-center justify-between gap-4">
        <a href={brandHref} className="leading-none">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <span className="block font-display text-2xl font-black tracking-[-0.04em] text-[var(--text)]">
            {brand}
          </span>
          {subtitle ? (
            <span className="mt-1 block text-sm text-[var(--text-muted)]">{subtitle}</span>
          ) : null}
        </a>

        {navLinks.length > 0 ? (
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "border-b-2 border-[var(--primary)] pb-1 text-sm font-semibold tracking-tight text-[var(--text)]"
                    : "text-sm font-medium tracking-tight text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
