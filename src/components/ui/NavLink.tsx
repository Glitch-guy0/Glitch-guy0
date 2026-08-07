import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  active?: boolean;
}

/**
 * Nav link — mono label in ink-secondary; active renders white + weight;
 * hover fires a 100ms text-flicker (DESIGN.md nav-link). Token-driven only.
 * Smooth-scroll/hash behavior is wired by the Header island (Story 1.6).
 */
export function NavLink({
  children,
  active = false,
  className = '',
  ...rest
}: NavLinkProps) {
  return (
    <a
      data-component="NavLink"
      aria-current={active ? 'true' : undefined}
      className={`nav-flicker inline-flex min-h-11 items-center py-2 font-mono text-mono-label uppercase transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary ${
        active
          ? 'font-semibold text-ink-primary'
          : 'text-ink-secondary hover:text-ink-primary'
      } ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
