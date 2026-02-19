/**
 * Enum representing the different areas of expertise.
 */
export const ExpertiseType = {
  BACKEND: 'backend',
  FRONTEND: 'frontend',
  EMBEDDED: 'embedded',
  DEVOPS: 'devops',
} as const;

export type ExpertiseType = typeof ExpertiseType[keyof typeof ExpertiseType];

/**
 * Configuration interface for an expertise.
 */
export interface IExpertiseConfig {
  /** The unique identifier for the expertise. */
  id: ExpertiseType;
  /** The display title of the expertise. */
  title: string;
  /** The primary color associated with the expertise (CSS color string). */
  color: string;
  /** A short description of the expertise. */
  description: string;
  /** The route path for this expertise. */
  path: string;
  /** The rotation angle of the wheel for this expertise (in degrees). */
  rotation: number;
}
