import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { siteContent } from '@/content';

/**
 * Hero section — Server Component (AD-5).
 * Renders the outcome headline above the fold with exactly one primary CTA
 * pointing to #contact (FR-4, FR-5). The <h1> carries data-burst-on-load
 * for the single load-burst per the motion engine attribute contract.
 */
export function HeroSection() {
  const { hero } = siteContent;

  return (
    <div data-component="HeroSection" className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center gap-8 pb-16 pt-8 tablet:gap-10">
      {/* Outcome headline — sentence-case, display size (UX-DR2) */}
      <div className="flex flex-col gap-4">
        <h1
          className="max-w-3xl font-display text-display-mobile font-bold leading-[1] tracking-[-0.01em] text-ink-primary desktop:text-display"
          data-burst-on-load
        >
          {hero.headline}
        </h1>
        <p className="max-w-xl font-sans text-body text-ink-secondary desktop:text-body-lg">
          {hero.tagline}
        </p>
      </div>

      {/* CTA row — one primary, one optional secondary (FR-5) */}
      <div className="flex flex-wrap items-center gap-4">
        <ButtonPrimary href="#contact" className="min-h-[44px] min-w-[44px]">
          {hero.ctaLabel}
        </ButtonPrimary>
        {hero.secondaryLabel && (
          <ButtonSecondary href="#projects" className="min-h-[44px] min-w-[44px]">
            {hero.secondaryLabel}
          </ButtonSecondary>
        )}
      </div>
    </div>
  );
}
