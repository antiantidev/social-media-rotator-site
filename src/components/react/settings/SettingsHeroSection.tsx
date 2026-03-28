import { settingsHero } from "../../../data/mockData";

export interface SettingsHeroSectionProps extends Readonly<Record<string, never>> {}

export function SettingsHeroSection(_: SettingsHeroSectionProps) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <h1 className="mb-2 font-display text-5xl font-extrabold tracking-[-0.05em] text-[var(--text)]">
          {settingsHero.title}
        </h1>
        <p className="max-w-xl text-lg text-[var(--text-muted)]">{settingsHero.subtitle}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[var(--text-soft)]">
          {settingsHero.banner}
        </p>
      </div>

      <div className="max-w-md text-sm text-[var(--text-muted)] md:text-right">
        <p>{settingsHero.supportCopy}</p>
        <div className="mt-3 flex flex-wrap gap-3 md:justify-end">
          <a href="https://buymeacoffee.com/chokernguyen" className="button-primary px-5 py-3 text-sm font-bold">
            Buy Me a Coffee
          </a>
          <a href="https://paypal.me/chokernguyen" className="button-secondary px-4 py-2 text-sm font-semibold">
            Paypal
          </a>
          <a href="https://ko-fi.com/chokernguyen" className="button-secondary px-4 py-2 text-sm font-semibold">
            ko-fi
          </a>
          <a href="https://zypage.com/chokernguyen" className="button-secondary px-4 py-2 text-sm font-semibold">
            Zypage
          </a>
        </div>
      </div>
    </div>
  );
}
