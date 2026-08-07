import { siteContent } from '@/content';

/**
 * Experience section — Server Component (AD-5).
 * 2–3 outcome-framed work statements with magnitude (FR-18).
 * The zero-downtime migration is here as a work statement, NOT a featured project.
 * Each statement states an outcome with a magnitude and reads as more than a duties list.
 */
export function ExperienceSection() {
  const { workStatements } = siteContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        {workStatements.map((stmt, i) => (
          <article
            key={i}
            className="flex flex-col gap-3 border-l-2 border-border-hairline py-1 pl-5"
          >
            {/* Role / context */}
            <span className="font-mono text-mono-label uppercase tracking-widest text-ink-muted">
              {stmt.role}
            </span>
            {/* Outcome with magnitude — the headline of the statement */}
            <h3 className="font-display text-heading-sm text-ink-primary">{stmt.outcome}</h3>
            {/* Supporting detail */}
            <p className="font-sans text-body text-ink-secondary">{stmt.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
