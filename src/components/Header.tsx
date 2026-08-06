'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from '@/components/ui/NavLink';
import { getActiveLenis, prefersReducedMotion } from '@/lib/motion/engine';

/** Header height + breathing room — matches the sections' `scroll-mt-20` (80px). */
const ANCHOR_OFFSET = -80;

export const SECTION_ANCHORS = [
  { id: 'hero', label: 'Hero' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

interface HeaderProps {
  /** Server-read CONTACT_EMAIL (FR-2, AD-8). */
  email: string;
}

/**
 * Fixed header island (UX-DR7, AD-8): transparent until scroll, then a hairline
 * bottom border; real `<a href="#section">` anchors smooth-scroll via the Lenis
 * instance and leave the hash in the URL so the browser back button works;
 * `ScrollTrigger.refresh()` fires after navigation settles. Mailto reachable on
 * every viewport. Mobile shows a condensed anchor sheet.
 */
export function Header({ email }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [sheetOpen, setSheetOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Transparent → hairline on scroll (throttled passive listener).
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active-section tracking via IntersectionObserver.
  useEffect(() => {
    const sections = SECTION_ANCHORS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToTarget = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = getActiveLenis();
    if (lenis) {
      lenis.scrollTo(target, {
        offset: ANCHOR_OFFSET,
        duration: 1,
        // Reduced motion: jump instantly, no programmatic animation (NFR-3).
        immediate: prefersReducedMotion(),
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else {
      target.scrollIntoView();
      ScrollTrigger.refresh();
    }
  };

  const scrollToAnchor = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToTarget(id);
    // Leave the hash in the URL for back-button compatibility (AD-8).
    if (window.location.hash === `#${id}`) {
      // Same anchor re-clicked: replace instead of stacking a duplicate entry.
      history.replaceState(null, '', `#${id}`);
    } else {
      history.pushState(null, '', `#${id}`);
    }
    setSheetOpen(false);
  };

  // Back/forward navigation: hash changed without a click — re-scroll to the target.
  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) scrollToTarget(hash);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-70 bg-surface-base/80 backdrop-blur-sm transition-[border-color,background-color] duration-150 ${
        scrolled ? 'border-b border-border-hairline' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-content-max items-center justify-between gap-4 px-5 desktop:px-12">
        <a
          href="#hero"
          onClick={(e) => scrollToAnchor(e, 'hero')}
          className="font-display text-mono-label uppercase tracking-wider text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
          aria-label="Back to top"
        >
          glitch-guy0<span className="text-ink-secondary">{'//'}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 tablet:flex">
          {SECTION_ANCHORS.map((section) => (
            <NavLink
              key={section.id}
              href={`#${section.id}`}
              active={activeSection === section.id}
              onClick={(e) => scrollToAnchor(e, section.id)}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${email}`}
            className="hidden items-center rounded-md border border-border-hairline px-3 py-2 font-mono text-mono-meta text-ink-secondary transition-colors duration-100 hover:border-ink-primary hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary tablet:inline-flex"
          >
            email
          </a>
          <button
            type="button"
            aria-label={sheetOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sheetOpen}
            aria-controls="mobile-nav-sheet"
            onClick={() => setSheetOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md font-mono text-mono-label text-ink-primary transition-colors duration-100 hover:bg-ink-primary hover:text-surface-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary tablet:hidden"
          >
            {sheetOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {sheetOpen && (
        <nav
          id="mobile-nav-sheet"
          aria-label="Mobile"
          className="border-t border-border-hairline bg-surface-base tablet:hidden"
        >
          <ul className="mx-auto flex w-full max-w-content-max flex-col px-5 desktop:px-12">
            {SECTION_ANCHORS.map((section) => (
              <li key={section.id} className="border-b border-border-hairline last:border-b-0">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => scrollToAnchor(e, section.id)}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                  className={`flex min-h-12 items-center py-2 font-mono text-mono-label uppercase transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary ${
                    activeSection === section.id
                      ? 'font-semibold text-ink-primary'
                      : 'text-ink-secondary'
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${email}`}
                className="flex min-h-12 items-center py-2 font-mono text-mono-label uppercase text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
              >
                {email}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
