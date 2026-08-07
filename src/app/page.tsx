import { Footer } from '@/components/ui/Footer';
import { CONTACT_EMAIL } from '@/lib/config';
import { SectionNumber } from '@/components/ui/SectionNumber';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';

export default function Home() {
  return (
    <main id="top" tabIndex={-1} className="flex min-h-screen flex-col">
      <div className="flex w-full max-w-content-max flex-col px-5 pt-24 desktop:mx-auto desktop:px-12">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="scroll-mt-20"
          data-reveal
        >
          {/* Visually hidden section label — the h1 in HeroSection is the real heading */}
          <h2 id="hero-heading" className="sr-only">
            Hero
          </h2>
          <HeroSection />
        </section>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <section
          id="services"
          aria-labelledby="services-heading"
          className="flex min-h-[60dvh] scroll-mt-20 flex-col gap-4 py-16"
          data-reveal
        >
          <div className="flex flex-col gap-2">
            <SectionNumber>001</SectionNumber>
            <h2
              id="services-heading"
              className="font-display text-heading uppercase"
              data-glitch-burst
            >
              Services
            </h2>
          </div>
          <ServicesSection />
        </section>

        {/* ── Projects ─────────────────────────────────────────────────── */}
        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="flex min-h-[60dvh] scroll-mt-20 flex-col gap-4 py-16"
          data-reveal
        >
          <div className="flex flex-col gap-2">
            <SectionNumber>002</SectionNumber>
            <h2
              id="projects-heading"
              className="font-display text-heading uppercase"
              data-glitch-burst
            >
              Projects
            </h2>
          </div>
          <ProjectsSection />
        </section>

        {/* ── About ────────────────────────────────────────────────────── */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="flex min-h-[40dvh] scroll-mt-20 flex-col gap-4 py-16"
          data-reveal
        >
          <div className="flex flex-col gap-2">
            <SectionNumber>003</SectionNumber>
            <h2
              id="about-heading"
              className="font-display text-heading uppercase"
              data-glitch-burst
            >
              About
            </h2>
          </div>
          <AboutSection />
        </section>

        {/* ── Skills ───────────────────────────────────────────────────── */}
        <section
          id="skills"
          aria-labelledby="skills-heading"
          className="flex min-h-[40dvh] scroll-mt-20 flex-col gap-4 py-16"
          data-reveal
        >
          <div className="flex flex-col gap-2">
            <SectionNumber>004</SectionNumber>
            <h2
              id="skills-heading"
              className="font-display text-heading uppercase"
              data-glitch-burst
            >
              Skills
            </h2>
          </div>
          <SkillsSection />
        </section>

        {/* ── Experience ───────────────────────────────────────────────── */}
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="flex min-h-[60dvh] scroll-mt-20 flex-col gap-4 py-16"
          data-reveal
        >
          <div className="flex flex-col gap-2">
            <SectionNumber>005</SectionNumber>
            <h2
              id="experience-heading"
              className="font-display text-heading uppercase"
              data-glitch-burst
            >
              Experience
            </h2>
          </div>
          <ExperienceSection />
        </section>

        {/* ── Contact placeholder (Epic 3) ─────────────────────────────── */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="flex min-h-[60dvh] scroll-mt-20 flex-col gap-4 py-16"
          data-reveal
        >
          <div className="flex flex-col gap-2">
            <SectionNumber>006</SectionNumber>
            <h2
              id="contact-heading"
              className="font-display text-heading uppercase"
              data-glitch-burst
            >
              Contact
            </h2>
          </div>
          <p className="max-w-xl font-mono text-mono-meta text-ink-secondary">
            Contact form lands in Epic 3. In the meantime,{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-ink-primary underline underline-offset-4 hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
            >
              email directly
            </a>
            .
          </p>
        </section>

      </div>

      <Footer
        email={CONTACT_EMAIL}
        resumeHref="/resume.pdf?v=1"
        socials={[
          { href: 'https://github.com/Glitch-guy0', children: 'github' },
          { href: 'https://linkedin.com/in/glitch-guy0', children: 'linkedin' },
        ]}
        copyright="© 2026 Prajwal M"
      />
    </main>
  );
}
