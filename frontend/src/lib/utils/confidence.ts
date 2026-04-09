import { WEIGHTS, CONFIDENCE_THRESHOLDS } from './constants';

export function calculateOverallConfidence(s1: number, s2: number, s3: number, s4: number): number {
  const result = (s1 * WEIGHTS.STAGE_1) + (s2 * WEIGHTS.STAGE_2) + (s3 * WEIGHTS.STAGE_3) + (s4 * WEIGHTS.STAGE_4);
  return Math.round(result * 100) / 100;
}

export function getConfidenceBand(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) {
    return 'High';
  } else if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return 'Medium';
  } else {
    return 'Low';
  }
}
