import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface ButtonSecondaryProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  disabled?: boolean;
}

/**
 * Secondary button — transparent with a 1px ink-primary outline that inverts
 * on hover (DESIGN.md button-secondary). Token-driven only.
 */
export function ButtonSecondary({
  children,
  className = '',
  disabled = false,
  href,
  ...rest
}: ButtonSecondaryProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-ink-primary bg-transparent px-6 py-3.5 font-mono text-mono-label text-ink-primary transition-colors duration-100 hover:bg-ink-primary hover:text-surface-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary disabled:pointer-events-none disabled:border-ink-disabled disabled:text-ink-disabled ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
