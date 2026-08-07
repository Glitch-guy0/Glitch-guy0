import type { ReactNode } from 'react';

export interface SkillPillProps {
  children: ReactNode;
  className?: string;
}

/**
 * Skill pill — transparent, 1px hairline, mono label; hover turns the border
 * white (DESIGN.md skill-pill). No percentage bars, no fills.
 */
export function SkillPill({ children, className = '' }: SkillPillProps) {
  return (
    <span
      data-component="SkillPill"
      className={`inline-flex items-center rounded-sm border border-border-hairline px-4 py-2 font-mono text-mono-label text-ink-secondary transition-colors duration-100 hover:border-ink-primary hover:text-ink-primary ${className}`}
    >
      {children}
    </span>
  );
}
