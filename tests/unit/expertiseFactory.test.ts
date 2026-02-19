import { describe, it, expect } from 'vitest';
import { ExpertiseFactory } from '@/core/ExpertiseFactory';
import { ExpertiseType } from '@/interfaces';

describe('ExpertiseFactory', () => {
  it('should return correct configuration for BACKEND', () => {
    const config = ExpertiseFactory.getConfig(ExpertiseType.BACKEND);
    expect(config.title).toBe('BACKEND');
    expect(config.color).toBe('#ef4444');
    expect(config.path).toBe('/backend');
    expect(config.rotation).toBe(0);
  });

  it('should cycle through expertise types correctly', () => {
    const backend = ExpertiseType.BACKEND;
    const next1 = ExpertiseFactory.getNextExpertise(backend);
    expect(next1.id).toBe(ExpertiseType.FRONTEND);

    const next2 = ExpertiseFactory.getNextExpertise(next1.id);
    expect(next2.id).toBe(ExpertiseType.EMBEDDED);

    const next3 = ExpertiseFactory.getNextExpertise(next2.id);
    expect(next3.id).toBe(ExpertiseType.DEVOPS);

    const next4 = ExpertiseFactory.getNextExpertise(next3.id);
    expect(next4.id).toBe(ExpertiseType.BACKEND); // Loop back
  });

  it('should return previous expertise correctly', () => {
    const backend = ExpertiseType.BACKEND;
    const prev = ExpertiseFactory.getPreviousExpertise(backend);
    expect(prev.id).toBe(ExpertiseType.DEVOPS); // Loop back
  });
});
