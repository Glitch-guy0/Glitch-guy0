'use client';

import { useSyncExternalStore } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { getStoredConsent } from '@/components/CookieBanner';

/** Subscribe to consent changes: `CookieBanner`'s same-tab `consent-changed`
 * event, plus the native `storage` event for changes made in other open tabs. */
function subscribeToConsent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('consent-changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('consent-changed', callback);
    window.removeEventListener('storage', callback);
  };
}

/**
 * Client wrapper (Story 5.2): mounts `<Analytics />` from `@vercel/analytics/react`
 * only when running in production AND the visitor has accepted consent via
 * `CookieBanner`. Reacts to `CookieBanner`'s `consent-changed` event so
 * accepting mounts analytics without a full page reload in the same tab.
 */
export function Analytics() {
  const consent = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => null);

  if (process.env.NODE_ENV !== 'production' || consent !== 'accepted') return null;

  return (
    <span data-component="Analytics">
      <VercelAnalytics />
    </span>
  );
}
