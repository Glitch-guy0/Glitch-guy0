import { siteContent } from '@/content';

/**
 * Services section — Server Component (AD-5).
 * Three packaged offers with deliverables and timelines.
 * No pricing, no per-offer action button (FR-6, FR-7, FR-8).
 * 3-column grid at desktop, 1-column at mobile (UX-DR6).
 */
export function ServicesSection() {
  const { offers } = siteContent;

  return (
    <div data-component="ServicesSection" className="flex flex-col gap-10">
      <p className="max-w-lg font-sans text-body text-ink-secondary">
        Three ways to work together — scoped engagements with clear deliverables. Contact to scope
        yours.
      </p>

      {/* 3-column desktop, 1-column mobile (UX-DR6) */}
      <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.name}
            className="flex flex-col gap-5 rounded-md border border-border-hairline bg-surface-raised p-6"
          >
            {/* Offer name */}
            <h3 className="font-display text-heading-sm uppercase tracking-wide text-ink-primary">
              {offer.name}
            </h3>

            {/* Scope */}
            <p className="font-sans text-body text-ink-secondary">{offer.scope}</p>

            {/* Deliverables */}
            <ul className="flex flex-col gap-1.5" aria-label={`${offer.name} deliverables`}>
              {offer.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 font-mono text-mono-meta text-ink-secondary"
                >
                  <span className="mt-0.5 shrink-0 text-ink-muted" aria-hidden="true">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Timeline — mono metadata (FR-6) */}
            <div className="mt-auto border-t border-border-hairline pt-4">
              <span className="font-mono text-mono-label text-ink-muted">TIMELINE</span>
              <p className="mt-1 font-mono text-mono-meta text-ink-secondary">{offer.timeline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
