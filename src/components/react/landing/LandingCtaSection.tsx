import { landingCta } from "../../../data/mockData";
import { sitePath } from "../../../lib/site.ts";

export interface LandingCtaSectionProps extends Readonly<Record<string, never>> {}

export function LandingCtaSection(_: LandingCtaSectionProps) {
  return (
    <section className="px-8 py-32">
      <div className="editorial-shell text-center">
        <h2 className="text-[3rem] font-black tracking-tighter text-[var(--text)]">
          {landingCta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--text-muted)]">
          {landingCta.subtitle}
        </p>
        <div className="mt-12 inline-flex flex-col gap-4 sm:flex-row">
          <a href={sitePath("settings/")} className="button-primary px-12 py-5 text-lg font-bold">
            {landingCta.primaryCta}
          </a>
          <a href={sitePath("overlay/")} className="button-secondary px-12 py-5 text-lg font-bold">
            {landingCta.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
