import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface FooterLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export interface FooterProps {
  /** mailto: contact link — rendered on every viewport (FR-2). */
  email: string;
  resumeHref?: string;
  socials?: FooterLinkProps[];
  copyright?: string;
  className?: string;
}

/**
 * Footer — mono meta row: email, resume link, socials, copyright, with a
 * hairline top border and no hero treatment (DESIGN.md footer). Token-driven only.
 */
export function Footer({
  email,
  resumeHref,
  socials = [],
  copyright,
  className = '',
}: FooterProps) {
  return (
    <footer className={`border-t border-border-hairline bg-surface-base ${className}`}>
      <div className="mx-auto flex max-w-content-max flex-col gap-4 px-5 py-8 font-mono text-mono-meta text-ink-secondary desktop:flex-row desktop:items-center desktop:justify-between desktop:px-12">
        <a
          href={`mailto:${email}`}
          className="underline-offset-2 transition-colors duration-100 hover:text-ink-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
        >
          {email}
        </a>
        {socials.length > 0 && (
          <nav aria-label="Social links" className="flex flex-wrap gap-4">
            {socials.map((social) => (
              <a
                key={social.href ?? social.children?.toString() ?? ''}
                className="transition-colors duration-100 hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
                {...social}
              />
            ))}
          </nav>
        )}
        {resumeHref && (
          <a
            href={resumeHref}
            className="transition-colors duration-100 hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
          >
            resume.pdf
          </a>
        )}
        {copyright && <p className="text-ink-secondary">{copyright}</p>}
      </div>
    </footer>
  );
}
