/**
 * Motion engine — pure helpers for the glitch atmosphere (AD-2, UX-DR4/UX-DR5).
 * No DOM side effects at import: the `MotionProvider` island wires GSAP/Lenis,
 * and this module only exposes decisions + class-based triggers.
 *
 * Attribute contract: `data-burst-on-load` (hero only) and `data-glitch-burst`
 * (section headers) are MUTUALLY EXCLUSIVE on any single element — an element
 * carrying both would fire a double burst.
 */

export const GLITCH_BURST_CLASS = 'glitch-burst';
export const REVEAL_ATTR = 'data-reveal';
export const BURST_ATTR = 'data-glitch-burst';

/** Duration of a burst in ms — must stay within the 100–400ms window (NFR-3). */
export const BURST_MS = 200;

/** True when the OS requests reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fire a one-shot glitch burst on an element with instant snap-back. Pure:
 * applies/re-applies a CSS animation class; the class's 0%/100% keyframes are
 * identical so the element always returns to its resting state.
 */
export function fireGlitchBurst(el: HTMLElement): void {
  if (!el || prefersReducedMotion()) {
    return;
  }
  el.classList.remove(GLITCH_BURST_CLASS);
  // Force reflow so the animation restarts on repeat fires.
  void el.offsetWidth;
  el.classList.add(GLITCH_BURST_CLASS);
}

/** Remove the burst class once the animation completes. */
export function clearGlitchBurst(el: HTMLElement, durationMs = BURST_MS): void {
  window.setTimeout(() => {
    el.classList.remove(GLITCH_BURST_CLASS);
  }, durationMs + 50);
}
