/**
 * Server-only configuration (AD-8). Never import from a client component —
 * this module reads `process.env` and must stay out of the client bundle.
 */

/** Builder contact email for `mailto:` links in the header and footer (FR-2). */
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL?.trim() || 'builder@example.com';
