import { landingFeatureCards } from "../../../data/mockData";

export interface LandingFeaturesSectionProps extends Readonly<Record<string, never>> {}

export function LandingFeaturesSection(_: LandingFeaturesSectionProps) {
  return (
    <section className="bg-[var(--surface)] px-8 py-24">
      <div className="editorial-shell">
        <div className="mb-20 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-soft)]">
            Powerful Features
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--text)]">
            Everything You Need
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {landingFeatureCards.map((card) => (
            <article key={card.title} className="feature-card p-12 transition-colors hover:bg-[var(--surface_container_low)]">
              <div className="mb-8 flex h-12 w-12 items-center justify-center bg-[var(--primary)] text-white">
                <span className="material-symbols-outlined text-xl">{card.icon}</span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-[var(--text)]">{card.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
