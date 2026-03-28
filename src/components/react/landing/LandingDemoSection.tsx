import { landingDemoCards } from "../../../data/mockData";

export interface LandingDemoSectionProps extends Readonly<Record<string, never>> {}

export function LandingDemoSection(_: LandingDemoSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--surface_container_low)] px-8 py-24">
      <div className="editorial-shell">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-kicker">Product Walkthrough</span>
            <h2 className="mt-5 max-w-[12ch] text-4xl font-black tracking-[-0.05em] text-[var(--text)] md:text-[4.25rem]">
              Watch the rotator come together in real settings flow.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[var(--text-muted)] md:text-base">
            These are not mockups. They show the actual settings panel flow: enable socials, tune
            the card, preview it live, and copy the browser-source URL into OBS.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          {landingDemoCards.map((card, index) => (
            <article
              key={card.title}
              className={`group relative overflow-hidden bg-[var(--surface_container_lowest)] p-4 shadow-[0_28px_80px_rgba(16,18,18,0.08)] transition-transform duration-300 hover:-translate-y-1 md:p-5 ${
                index === 0 ? "xl:-translate-y-5" : ""
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--text-soft)]">
                    {card.eyebrow}
                  </div>
                  <h3 className="mt-3 max-w-[22ch] text-2xl font-black leading-tight tracking-[-0.04em] text-[var(--text)]">
                    {card.title}
                  </h3>
                </div>

                <div className="hidden bg-[var(--text)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white sm:block">
                  {card.accent}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.25rem] border border-black/6 bg-[#f7f6f3]">
                <img
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  className="aspect-[4/3] w-full object-cover object-top"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 via-black/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="mt-5 flex flex-col gap-4 border-t border-black/6 pt-5 md:flex-row md:items-start md:justify-between">
                <p className="max-w-xl text-sm leading-7 text-[var(--text-muted)]">{card.description}</p>
                <div className="shrink-0 bg-[var(--surface_container_low)] px-4 py-3 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-soft)]">
                    Why it matters
                  </div>
                  <div className="mt-2 font-display text-lg font-black tracking-[-0.04em] text-[var(--text)]">
                    {card.meta}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
