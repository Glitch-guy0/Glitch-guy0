import { siteContent } from '@/content';

/**
 * About section — Server Component (AD-5).
 * Honest, work-focused first-person copy (FR-15).
 * Skills are in the sibling SkillsSection with its own #skills anchor.
 */
export function AboutSection() {
  const { about } = siteContent;

  return (
    <div data-component="AboutSection" className="max-w-2xl flex flex-col gap-4">
      {about.paragraphs.map((para, i) => (
        <p key={i} className="font-sans text-body text-ink-secondary desktop:text-body-lg">
          {para}
        </p>
      ))}
    </div>
  );
}
