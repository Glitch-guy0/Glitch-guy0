import type { ReactNode } from 'react';

export interface ProjectCardProps {
  title: string;
  visual: ReactNode;
  body: ReactNode;
  metadata: ReactNode;
  className?: string;
}

/**
 * Project card — raised panel, 1px hairline, one visual, problem → solution →
 * result body, mono metadata row. Hover: hairline flashes white and the visual
 * does a single 150ms horizontal tear (DESIGN.md project-card). Token-driven only.
 */
export function ProjectCard({ title, visual, body, metadata, className = '' }: ProjectCardProps) {
  return (
    <article
      data-component="ProjectCard"
      className={`group rounded-md border border-border-hairline bg-surface-raised transition-colors duration-150 hover:border-ink-primary ${className}`}
    >
      <div className="card-tear overflow-hidden rounded-t-md border-b border-border-hairline">
        {visual}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-display text-heading-sm uppercase text-ink-primary">{title}</h3>
        <div className="flex flex-col gap-3 text-body text-ink-secondary">{body}</div>
        <div className="mt-1 border-t border-border-hairline pt-3 font-mono text-mono-meta text-ink-secondary">
          {metadata}
        </div>
      </div>
    </article>
  );
}
