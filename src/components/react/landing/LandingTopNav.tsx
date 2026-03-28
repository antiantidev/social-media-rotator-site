import { landingNavLinks } from "../../../data/mockData";
import { sitePath } from "../../../lib/site.ts";

export interface LandingTopNavProps extends Readonly<Record<string, never>> {}

export function LandingTopNav(_: LandingTopNavProps) {
  return (
    <nav className="glass-nav fixed top-0 z-50 w-full">
      <div className="editorial-shell flex h-20 items-center justify-between">
        <div className="text-2xl font-black tracking-tighter text-[var(--text)]">
          Social Media Rotator
        </div>

        <div className="hidden items-center gap-10 md:flex">
          {landingNavLinks.map((link) => (
              <a
                key={link.label}
                href={sitePath(link.href.replace(/^\//, ""))}
                className={
                  link.active
                    ? "border-b-2 border-[var(--primary)] pb-1 text-sm font-bold tracking-tight text-[var(--text)]"
                    : "text-sm font-medium tracking-tight text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                }
              >
                {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-sm font-medium tracking-tight text-[var(--text-muted)] transition-colors active:scale-95 hover:text-[var(--text)]">
            Login
          </button>
          <button className="button-primary px-6 py-2.5 text-sm font-medium">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
