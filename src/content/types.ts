/**
 * Content type definitions for the Glitch-guy0 portfolio (AD-4).
 * All copy is single-sourced here; no JSX string literals for content.
 */

export interface HeroContent {
  /** Sentence-case outcome headline — "I build X for Y" (FR-4) */
  headline: string;
  /** One supporting line below the headline */
  tagline: string;
  /** Primary CTA label; href is always #contact (FR-5) */
  ctaLabel: string;
  /** Optional secondary link label; href is #projects */
  secondaryLabel?: string;
}

export interface Offer {
  /** Short offer name */
  name: string;
  /** 1–2 line scope description */
  scope: string;
  /** Deliverables as a list of strings */
  deliverables: string[];
  /** Timeline string displayed in mono */
  timeline: string;
}

export interface ProjectEntry {
  /** Project title */
  title: string;
  /** Brief one-line tagline */
  tagline: string;
  /** Problem statement */
  problem: string;
  /** Solution description */
  solution: string;
  /** Result with quantified magnitude (FR-9) */
  result: string;
  /** GitHub URL (FR-12) */
  githubUrl: string;
  /** Live demo URL — undefined if GitHub-only (FR-12) */
  liveUrl?: string;
  /** Public path to project visual under /images/ (FR-11) */
  imageSrc: string;
  /** Descriptive alt text (FR-11, NFR-2) */
  imageAlt: string;
  /** Stack line for mono metadata row */
  stack: string;
}

export interface ShowcaseEntry {
  /** Project title */
  title: string;
  /** One-line description */
  description: string;
  /** GitHub URL (FR-14) */
  githubUrl: string;
  /** Stack for mono display */
  stack: string;
}

export interface AboutContent {
  /** First-person copy paragraphs — honest, work-focused (FR-15) */
  paragraphs: string[];
}

export interface WorkStatement {
  /** Role / context */
  role: string;
  /** Outcome with magnitude (FR-18) */
  outcome: string;
  /** Supporting detail sentence */
  detail: string;
}

export interface ContactContent {
  /** Section heading copy */
  heading: string;
  /** One supporting line under the heading */
  subhead: string;
  /** Field labels for the controlled inputs */
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  /** Submit button label while idle/error (pre-submit) */
  submitLabel: string;
  /** Submit button label while a request is in flight */
  submittingLabel: string;
  /** Inline confirmation shown after a successful submit */
  successMessage: string;
  /** Inline error shown after a failed submit */
  errorMessage: string;
  /** Retry button label on the error block */
  retryLabel: string;
}

export interface SiteContent {
  hero: HeroContent;
  offers: Offer[];
  featuredProjects: ProjectEntry[];
  showcaseProjects: ShowcaseEntry[];
  about: AboutContent;
  /** 6–8 skill domain pills — domain names, not tool lists (FR-16) */
  skillPills: string[];
  workStatements: WorkStatement[];
  contact: ContactContent;
}
