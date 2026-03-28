import type { ReadonlyLink } from "../../../data/mockData";
import { sitePath } from "../../../lib/site.ts";

export interface SettingsTopBarProps extends Readonly<{
  navLinks: readonly ReadonlyLink[];
}> {}

export function SettingsTopBar({ navLinks }: SettingsTopBarProps) {
  return (
    <header className="glass-nav fixed top-0 z-50 w-full">
      <div className="editorial-shell flex h-20 items-center justify-between">
        <div className="font-display text-2xl font-black tracking-tighter text-[var(--text)]">
          Social Media Rotator
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={sitePath(link.href.replace(/^\//, ""))}
              className={
                link.active
                  ? "pb-1 font-display text-sm font-bold tracking-tight text-[var(--text)]"
                  : "pb-1 font-display text-sm font-bold tracking-tight text-[var(--text-muted)] transition-colors duration-300 hover:text-[var(--text)]"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" className="material-symbols-outlined text-[var(--text-muted)] transition-colors hover:text-[var(--text)]" aria-label="Notifications">
            notifications
          </button>
          <button type="button" className="material-symbols-outlined text-[var(--text-muted)] transition-colors hover:text-[var(--text)]" aria-label="Settings">
            settings
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-[var(--bg-panel-soft)]">
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuR6tQ86ae1ZlAQ2UFF8cjw1u8tE0ZyaOg4LQKcVDpqctl60Jju6CGk30C_m0o2fQjycGzfsYNwqHG4MKhTNfZnUmV2Pn4GicQYz9bJw7L05hcMkyjagIWHtVeSBYGonQ1rl-3wyZsPw7CHcDTV3AXWz4-cGeDzujMUkLjqtcm4Am_ohn_dJpLFo1W24ZLYnVBu73D5Qi84uCbegOznuo_sL65EzojLlx5_E0zZtqiVEQ6UFQDUh5pdoAUPjqW-LBlW_pIDN_r7Ew"
              alt="professional headshot of a creative director with neutral lighting and minimalist grey background"
            />
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-[var(--surface_container_low)]" />
    </header>
  );
}
