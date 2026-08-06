import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { Footer } from '@/components/ui/Footer';
import { FormField } from '@/components/ui/FormField';
import { NavLink } from '@/components/ui/NavLink';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionNumber } from '@/components/ui/SectionNumber';
import { SkillPill } from '@/components/ui/SkillPill';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex w-full max-w-content-max flex-col gap-16 px-5 py-16 desktop:mx-auto desktop:px-12">
        <header className="flex flex-col gap-2" data-reveal>
          <SectionNumber>001</SectionNumber>
          <h1
            className="font-display text-display-mobile uppercase tablet:text-display"
            data-burst-on-load
          >
            Component Library
          </h1>
          <p className="max-w-xl text-body text-ink-secondary">
            Story 1.4 preview — the token-driven primitives Epic 2 sections will be built from.
          </p>
        </header>

        <section aria-labelledby="cta-heading" className="flex flex-col gap-4" data-reveal>
          <h2 id="cta-heading" className="font-display text-heading uppercase" data-glitch-burst>
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <ButtonPrimary href="#contact">Tell me about your project</ButtonPrimary>
            <ButtonSecondary href="#projects">View projects</ButtonSecondary>
            <ButtonPrimary href="#contact" disabled>
              Disabled CTA
            </ButtonPrimary>
          </div>
        </section>

        <section aria-labelledby="nav-heading" className="flex flex-col gap-4">
          <h2 id="nav-heading" className="font-display text-heading uppercase">
            Nav links
          </h2>
          <nav aria-label="Preview navigation" className="flex flex-wrap gap-6">
            <NavLink href="#hero">Hero</NavLink>
            <NavLink href="#services" active>
              Services
            </NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
        </section>

        <section aria-labelledby="pill-heading" className="flex flex-col gap-4">
          <h2 id="pill-heading" className="font-display text-heading uppercase">
            Skill pills
          </h2>
          <div className="flex flex-wrap gap-3">
            <SkillPill>LLM Harnessing</SkillPill>
            <SkillPill>Vector Search</SkillPill>
            <SkillPill>Backend &amp; APIs</SkillPill>
          </div>
        </section>

        <section aria-labelledby="field-heading" className="flex max-w-md flex-col gap-4">
          <h2 id="field-heading" className="font-display text-heading uppercase">
            Form field
          </h2>
          <FormField id="preview-name" label="Name" placeholder="Jane Founder" />
          <FormField
            id="preview-email"
            label="Email"
            type="email"
            placeholder="jane@company.com"
            error="Enter a valid email address."
          />
        </section>

        <section aria-labelledby="card-heading" className="flex flex-col gap-4">
          <h2 id="card-heading" className="font-display text-heading uppercase">
            Project card
          </h2>
          <div className="max-w-md">
            <ProjectCard
              title="Shikigami Agent SDK"
              visual={
                <div className="flex aspect-video w-full items-center justify-center bg-surface-base">
                  <span className="font-mono text-mono-meta text-ink-muted">[visual slot]</span>
                </div>
              }
              body={
                <>
                  <p>
                    <strong className="font-semibold text-ink-primary">Problem:</strong>{' '}
                    Agent harness sprawl across production collections.
                  </p>
                  <p>
                    <strong className="font-semibold text-ink-primary">Solution:</strong>{' '}
                    A unified SDK layer with evaluation built in.
                  </p>
                  <p>
                    <strong className="font-semibold text-ink-primary">Result:</strong>{' '}
                    A 3-day zero-downtime migration of 5 production collections.
                  </p>
                </>
              }
              metadata={
                <>
                  <span>typescript · rag</span>
                  <span className="mx-2" aria-hidden="true">
                    /
                  </span>
                  <span>github</span>
                </>
              }
            />
          </div>
        </section>
      </div>

      <Footer
        email="builder@example.com"
        resumeHref="/resume.pdf?v=1"
        socials={[
          { href: 'https://github.com/glitch-guy0', children: 'github' },
          { href: 'https://linkedin.com/in/glitch-guy0', children: 'linkedin' },
        ]}
        copyright="© 2026 Glitch-guy0"
      />
    </main>
  );
}
