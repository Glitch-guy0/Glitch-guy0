import { SkillPill } from '@/components/ui/SkillPill';
import { siteContent } from '@/content';

/**
 * Skills section — Server Component (AD-5).
 * 6–8 skill domain pills, harness-first; no percentage bars or rating bars (FR-16, FR-17).
 */
export function SkillsSection() {
  const { skillPills } = siteContent;

  return (
    <div data-component="SkillsSection" className="flex flex-col gap-8">
      <p className="max-w-lg font-sans text-body text-ink-secondary">
        Skill domains I work across — named by capability area, not tool list.
      </p>
      {/* Flex-wrap pill row (UX-DR3) — no percentage bars, no numeric ratings */}
      <div className="flex flex-wrap gap-3" role="list" aria-label="Skill domains">
        {skillPills.map((skill) => (
          <div key={skill} role="listitem">
            <SkillPill>{skill}</SkillPill>
          </div>
        ))}
      </div>
    </div>
  );
}
