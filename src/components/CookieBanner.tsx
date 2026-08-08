'use client';

import { useEffect, useSyncExternalStore } from 'react';

/** Sole storage key for consent state (AD-6) — read/written only here. */
const CONSENT_KEY = 'glitch-guy0:consent';
/** Fired on `window` after a write so same-tab listeners (e.g. `Analytics`)
 * can react — the native `storage` event never fires in the writing tab. */
const CONSENT_EVENT = 'consent-changed';

export type ConsentValue = 'accepted' | 'declined';

/**
 * Read the stored consent value without throwing. Safe to call during SSR
 * (returns `null`) and in browsers that block `localStorage` (private mode).
 */
export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    return null;
  }
}

/** Write consent and notify same-tab listeners; swallows storage failures. */
function setStoredConsent(value: ConsentValue) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Private-mode / quota errors: fail safe, banner may reappear next load.
  }
  try {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  } catch {
    // Ignore — non-essential same-tab notification.
  }
}

/** Subscribe to consent changes: the same-tab `consent-changed` event
 * (dispatched on write, since `storage` never fires in the writing tab) and
 * the native `storage` event (fires in other open tabs on the same origin). */
function subscribeToConsent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONSENT_KEY) callback();
  };
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Client island (Story 5.1): bottom-fixed, non-modal consent banner. Shows
 * only when no consent value is stored; Accept/Decline record the choice and
 * hide it permanently, `Esc` is treated as Decline. Never blocks page content
 * — it is not a dialog, has no focus trap, and doesn't use `aria-hidden` on
 * the rest of the page.
 */
export function CookieBanner() {
  // `getServerSnapshot` returns `null` (no consent) so the first client render
  // matches the server-rendered pass — the banner then updates post-hydration
  // once the real stored value is read, per the SSR edge case in the spec.
  const consent = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => null);
  const visible = consent === null;

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setStoredConsent('declined');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  if (!visible) return null;

  function choose(value: ConsentValue) {
    setStoredConsent(value);
  }

  return (
    <div
      data-component="CookieBanner"
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-60 flex flex-col items-start gap-3 border-t border-border-hairline bg-surface-base/95 px-5 py-4 backdrop-blur-sm tablet:flex-row tablet:items-center tablet:justify-between desktop:px-12"
    >
      <p className="font-mono text-mono-meta text-ink-secondary">
        This site uses privacy-friendly analytics to understand traffic. No tracking until you
        accept.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => choose('declined')}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-ink-primary bg-transparent px-6 py-3.5 font-mono text-mono-label text-ink-primary transition-colors duration-100 hover:bg-ink-primary hover:text-surface-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          className="btn-fringe inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-ink-primary px-6 py-3.5 font-mono text-mono-label text-surface-base transition-colors duration-100 hover:bg-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
