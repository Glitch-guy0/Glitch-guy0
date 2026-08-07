import Image from 'next/image';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { siteContent } from '@/content';

/**
 * Projects section — Server Component (AD-5).
 * Three featured entries (Shikigami first per FR-10) using ProjectCard,
 * followed by a secondary showcase listing that is visually distinct (FR-14).
 * Grid: 3-up ≥ 1280px / 2-up 768–1279px / stacked < 768px (UX-DR6).
 */
export function ProjectsSection() {
  const { featuredProjects, showcaseProjects } = siteContent;

  return (
    <div className="flex flex-col gap-14">
      {/* ── Featured entries ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            visual={
              /* Fixed 16:9 aspect wrapper — no layout shift (UX-DR12) */
              <div className="relative aspect-video w-full overflow-hidden bg-surface-raised">
                {project.imageSrc.endsWith('.svg') ? (
                  /* SVG placeholder — use regular img for SVG support */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    className="h-full w-full object-cover"
                    width={1200}
                    height={675}
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                )}
              </div>
            }
            body={
              <>
                <p>
                  <span className="font-mono text-mono-label text-ink-muted">PROBLEM — </span>
                  {project.problem}
                </p>
                <p>
                  <span className="font-mono text-mono-label text-ink-muted">SOLUTION — </span>
                  {project.solution}
                </p>
                <p>
                  <span className="font-mono text-mono-label text-ink-muted">RESULT — </span>
                  {project.result}
                </p>
              </>
            }
            metadata={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-ink-muted">{project.stack}</span>
                <div className="flex items-center gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-mono-label uppercase text-ink-secondary transition-colors duration-100 hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
                    aria-label={`${project.title} GitHub repository`}
                  >
                    GITHUB ↗
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-mono-label uppercase text-ink-secondary transition-colors duration-100 hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
                      aria-label={`${project.title} live demo`}
                    >
                      LIVE ↗
                    </a>
                  )}
                </div>
              </div>
            }
          />
        ))}
      </div>

      {/* ── Secondary showcase — visually distinct from featured entries (FR-14) ── */}
      <div className="flex flex-col gap-4">
        <h3 className="font-mono text-mono-label uppercase tracking-widest text-ink-muted">
          MORE SHIPPED WORK
        </h3>
        <div className="flex flex-col gap-3">
          {showcaseProjects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col gap-2 border-b border-border-hairline py-4 tablet:flex-row tablet:items-start tablet:justify-between"
            >
              <div className="flex flex-col gap-1">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-heading-sm uppercase text-ink-primary transition-colors duration-100 hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
                  aria-label={`${project.title} GitHub repository`}
                >
                  {project.title} ↗
                </a>
                <p className="font-sans text-body text-ink-secondary">{project.description}</p>
              </div>
              <span className="shrink-0 font-mono text-mono-meta text-ink-muted tablet:text-right">
                {project.stack}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
