import { calculateOverallConfidence, getConfidenceBand } from '../src/lib/utils/confidence';

describe('Confidence Aggregator', () => {
  it('calculates weighted confidence correctly', () => {
    // (0.90 * 0.10) + (0.90 * 0.40) + (0.90 * 0.20) + (0.90 * 0.30) = 0.90
    expect(calculateOverallConfidence(0.9, 0.9, 0.9, 0.9)).toBe(0.90);
    
    // (0.80 * 0.10) + (0.90 * 0.40) + (0.70 * 0.20) + (0.60 * 0.30) = 0.08 + 0.36 + 0.14 + 0.18 = 0.76
    expect(calculateOverallConfidence(0.80, 0.90, 0.70, 0.60)).toBeCloseTo(0.76);
  });

  it('determines the correct confidence band', () => {
    expect(getConfidenceBand(0.85)).toBe('High');
    expect(getConfidenceBand(0.80)).toBe('High');
    expect(getConfidenceBand(0.75)).toBe('Medium');
    expect(getConfidenceBand(0.65)).toBe('Medium');
    expect(getConfidenceBand(0.60)).toBe('Low');
  });
});
