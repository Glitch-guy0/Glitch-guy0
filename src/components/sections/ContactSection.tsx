import { ContactForm } from '@/components/ContactForm';
import { CONTACT_EMAIL } from '@/lib/config';
import { siteContent } from '@/content';

/**
 * Contact section — Server Component (AD-5) wrapping the `ContactForm`
 * client island plus a no-JS `mailto:` fallback that stays reachable even
 * if the island fails to hydrate.
 */
export function ContactSection() {
  const { contact } = siteContent;

  return (
    <div data-component="ContactSection" className="flex flex-col gap-6">
      <p className="max-w-xl font-mono text-mono-meta text-ink-secondary">{contact.subhead}</p>
      <ContactForm />
      <noscript>
        <p className="max-w-xl font-mono text-mono-meta text-ink-secondary">
          JavaScript is disabled. You can still{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-ink-primary underline underline-offset-4 hover:text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
          >
            email directly
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
