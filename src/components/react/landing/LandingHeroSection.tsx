import { landingHero } from "../../../data/mockData";
import { sitePath } from "../../../lib/site.ts";

export interface LandingHeroSectionProps extends Readonly<Record<string, never>> {}

export function LandingHeroSection(_: LandingHeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-8 pb-24 pt-28 lg:pb-28">
      <div className="editorial-shell grid grid-cols-1 items-end gap-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6 lg:pt-10">
          <div className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-[var(--text-soft)]">
            {landingHero.eyebrow}
          </div>

          <h1 className="mb-5 max-w-[8.5ch] text-[3.6rem] font-extrabold leading-[0.84] tracking-[-0.03em] md:text-[5.4rem]">
            {landingHero.titleLead} <br />
            {landingHero.titleHighlight}
          </h1>

          <p className="mb-5 max-w-xl text-[1.15rem] leading-7 text-[var(--on_surface_variant)]">
            {landingHero.subtitle}
          </p>
          <p className="hero-lead mb-12 max-w-xl">{landingHero.body}</p>

          <div className="flex flex-wrap items-center gap-4">
            <a href={sitePath("settings/")} className="button-primary px-10 py-4 text-base font-semibold">
              {landingHero.primaryCta}
            </a>
            <a href={sitePath("overlay/")} className="button-secondary px-10 py-4 text-base font-semibold sm:translate-y-2">
              {landingHero.secondaryCta}
            </a>
            <a href={sitePath("settings/")} className="button-tertiary px-2 py-4 text-sm font-bold uppercase tracking-[0.18em]">
              Configure Now
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {landingHero.metrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
              </div>
            ))}
          </div>

        </div>

        <div className="relative lg:col-span-6 lg:-translate-y-4">
          <div className="absolute -right-16 -top-12 z-0 h-72 w-72 rounded-full bg-[var(--surface_container_high)] opacity-60 blur-3xl" />
          <div className="surface-shell relative z-10 p-4">
            <div className="status-pill absolute -left-2 top-5 z-20 bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <span>Browser Source Ready</span>
            </div>
            <img
              src={landingHero.imageUrl}
              alt={landingHero.imageAlt}
              className="aspect-[4/5] w-full object-cover grayscale"
            />

            <div className="absolute bottom-8 -left-10 max-w-[14rem] bg-[var(--primary)] p-5 text-white shadow-2xl">
              <p className="font-display text-xl font-bold uppercase tracking-widest">
                {landingHero.badgeTitle}
              </p>
              <p className="mt-1 text-xs uppercase tracking-tighter text-gray-400">
                {landingHero.badgeSubtitle}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
