'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BURST_ATTR, clearGlitchBurst, fireGlitchBurst, prefersReducedMotion, REVEAL_ATTR } from '@/lib/motion/engine';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Motion island — the single integration point for the glitch atmosphere (AD-2).
 * Runs GSAP 3 + Lenis 1 on ONE GSAP ticker:
 *   - Lenis `autoRaf: false`, driven by `gsap.ticker` via `lenis.raf(time * 1000)`
 *   - `gsap.ticker.lagSmoothing(0)` so scroll stays 1:1 with the ticker
 *   - `lenis.on('scroll', ScrollTrigger.update)`, `ScrollTrigger.refresh()` after mount
 * Reduced motion: `gsap.matchMedia()` disables JS tweens + Lenis smoothing.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = prefersReducedMotion();

    const lenis = new Lenis({
      autoRaf: false,
      // Reduced motion: no smoothing — native scroll feel.
      smoothWheel: !reduced,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia();

    // JS half of the reduced-motion policy: instant reveal, no tweens.
    if (reduced) {
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-reveal]', { opacity: 1, y: 0 });
      });
    } else {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const revealEls = gsap.utils.toArray<HTMLElement>(`[${REVEAL_ATTR}]`);
        revealEls.forEach((el, index) => {
          gsap.set(el, { opacity: 0, y: '1rem' });
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                delay: Math.min(index * 0.05, 0.15),
                onComplete: () => ScrollTrigger.refresh(),
              });
            },
          });
        });

        // Glitch burst on section-header viewport entry — never on body text.
        const burstEls = gsap.utils.toArray<HTMLElement>(`[${BURST_ATTR}]`);
        burstEls.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              fireGlitchBurst(el);
              clearGlitchBurst(el);
            },
          });
        });
      });
    }

    // Keep ScrollTrigger measurements fresh after fonts/layout settle (AD-8).
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshTimer);
      mm.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, { scope: rootRef });

  // One-shot hero-load burst on elements marked `data-burst-on-load`.
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }
    const els = rootRef.current?.querySelectorAll<HTMLElement>('[data-burst-on-load]');
    els?.forEach((el) => {
      fireGlitchBurst(el);
      clearGlitchBurst(el);
    });
  }, []);

  return (
    <div ref={rootRef}>
      {/* Atmosphere — decorative, aria-hidden (UX-DR4) */}
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere-scanlines" />
        <div className="atmosphere-noise" />
      </div>
      {children}
    </div>
  );
}
