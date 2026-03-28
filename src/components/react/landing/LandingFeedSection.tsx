import { landingHowItWorks } from "../../../data/mockData";

export interface LandingFeedSectionProps extends Readonly<Record<string, never>> {}

export function LandingFeedSection(_: LandingFeedSectionProps) {
  return (
    <section className="bg-[var(--surface_container_low)] px-8 py-24">
      <div className="editorial-shell">
        <div className="mb-20 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-soft)]">
            {landingHowItWorks.eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)]">
            {landingHowItWorks.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {landingHowItWorks.steps.map((step) => (
            <article key={step.number} className="step-card">
              <div className="step-index mb-6">{step.number}</div>
              <h3 className="mb-4 text-xl font-bold text-[var(--text)]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
