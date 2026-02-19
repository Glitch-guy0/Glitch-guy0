import { ExpertiseType } from '@/interfaces';
import type { IExpertiseConfig } from '@/interfaces';

/**
 * Factory class for managing expertise configurations.
 */
export class ExpertiseFactory {
  /**
   * Retrieves the configuration for a specific expertise type.
   *
   * @param type - The expertise type to retrieve the configuration for.
   * @returns The configuration object for the specified expertise.
   */
  public static getConfig(type: ExpertiseType): IExpertiseConfig {
    switch (type) {
      case ExpertiseType.BACKEND:
        return {
          id: ExpertiseType.BACKEND,
          title: 'BACKEND',
          color: '#ef4444', // Red-500
          description: 'Scalable server-side solutions and architecture.',
          path: '/backend',
          rotation: 0,
        };
      case ExpertiseType.FRONTEND:
        return {
          id: ExpertiseType.FRONTEND,
          title: 'FRONTEND',
          color: '#3b82f6', // Blue-500
          description: 'Responsive and interactive user interfaces.',
          path: '/frontend',
          rotation: 45,
        };
      case ExpertiseType.EMBEDDED:
        return {
          id: ExpertiseType.EMBEDDED,
          title: 'EMBEDDED',
          color: '#22c55e', // Green-500
          description: 'Low-level programming and hardware integration.',
          path: '/embedded',
          rotation: 90,
        };
      case ExpertiseType.DEVOPS:
        return {
          id: ExpertiseType.DEVOPS,
          title: 'DEVOPS',
          color: '#a855f7', // Purple-500
          description: 'Cloud infrastructure and CI/CD pipelines.',
          path: '/devops',
          rotation: 135,
        };
      default:
        // This case should not be reachable if type is strict
        throw new Error(`Unknown expertise type: ${type}`);
    }
  }

  /**
   * Retrieves all expertise configurations in the defined sequence.
   *
   * @returns An array of all expertise configurations.
   */
  public static getAllConfigs(): IExpertiseConfig[] {
    return [
      this.getConfig(ExpertiseType.BACKEND),
      this.getConfig(ExpertiseType.FRONTEND),
      this.getConfig(ExpertiseType.EMBEDDED),
      this.getConfig(ExpertiseType.DEVOPS),
    ];
  }

  /**
   * Determines the next expertise in the sequence.
   *
   * @param currentType - The current expertise type.
   * @returns The next expertise configuration in the cycle.
   */
  public static getNextExpertise(currentType: ExpertiseType): IExpertiseConfig {
    const all = this.getAllConfigs();
    const index = all.findIndex((c) => c.id === currentType);

    if (index === -1) {
      // Fallback to first if not found
      return all[0];
    }

    const nextIndex = (index + 1) % all.length;
    return all[nextIndex];
  }

    /**
   * Determines the previous expertise in the sequence.
   *
   * @param currentType - The current expertise type.
   * @returns The previous expertise configuration in the cycle.
   */
    public static getPreviousExpertise(currentType: ExpertiseType): IExpertiseConfig {
        const all = this.getAllConfigs();
        const index = all.findIndex((c) => c.id === currentType);

        if (index === -1) {
          // Fallback to last if not found
          return all[all.length - 1];
        }

        const prevIndex = (index - 1 + all.length) % all.length;
        return all[prevIndex];
      }
}
