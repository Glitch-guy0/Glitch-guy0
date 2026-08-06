import { Footer } from '@/components/ui/Footer';
import { CONTACT_EMAIL } from '@/lib/config';
import { SectionNumber } from '@/components/ui/SectionNumber';

const SECTIONS = [
  { id: 'hero', number: '000', title: 'Hero' },
  { id: 'services', number: '001', title: 'Services' },
  { id: 'projects', number: '002', title: 'Projects' },
  { id: 'about', number: '003', title: 'About' },
  { id: 'skills', number: '004', title: 'Skills' },
  { id: 'experience', number: '005', title: 'Experience' },
  { id: 'contact', number: '006', title: 'Contact' },
] as const;

export default function Home() {
  return (
    <main id="top" className="flex min-h-screen flex-col">
      <div className="flex w-full max-w-content-max flex-col px-5 pt-24 desktop:mx-auto desktop:px-12">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="flex min-h-[60dvh] scroll-mt-20 flex-col gap-4 py-16"
            data-reveal
          >
            <div className="flex flex-col gap-2">
              <SectionNumber>{section.number}</SectionNumber>
              <h2
                id={`${section.id}-heading`}
                className="font-display text-heading uppercase"
                data-glitch-burst
              >
                {section.title}
              </h2>
            </div>
            <p className="max-w-xl font-mono text-mono-meta text-ink-muted">
              Section content lands in Epic 2.
            </p>
          </section>
        ))}
      </div>

      <Footer
        email={CONTACT_EMAIL}
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
