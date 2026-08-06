import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface ButtonPrimaryProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Primary CTA — the one place white becomes a fill (DESIGN.md button-primary).
 * Token-driven only: white fill, surface mono label, 4px radius, gray-fill hover
 * with 100ms grayscale fringe + scale 1.02 (btn-fringe) and instant snap-back.
 */
export function ButtonPrimary({
  children,
  className = '',
  disabled = false,
  href,
  ...rest
}: ButtonPrimaryProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={`btn-fringe inline-flex items-center justify-center gap-2 rounded-md bg-ink-primary px-6 py-3.5 font-mono text-mono-label text-surface-base transition-colors duration-100 hover:bg-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary disabled:pointer-events-none disabled:bg-ink-disabled disabled:text-ink-primary ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
