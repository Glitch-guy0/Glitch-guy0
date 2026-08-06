import type { ReactNode } from 'react';

export interface SectionNumberProps {
  /** Mono `001`-style prefix mapping 1:1 to nav order. */
  children: ReactNode;
  className?: string;
}

/**
 * Section number — the mono `001` prefix above section headings, the only
 * per-section emphasis (DESIGN.md section-number). Token-driven only.
 */
export function SectionNumber({ children, className = '' }: SectionNumberProps) {
  return (
    <span
      aria-hidden="true"
      className={`font-mono text-mono-label text-ink-primary ${className}`}
    >
      {children}
    </span>
  );
}
