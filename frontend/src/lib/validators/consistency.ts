import { StageOutput } from '../types/stage';
import { STAGE_NAMES, CONFIDENCE_THRESHOLDS } from '../utils/constants';

export function validateConsistency(auditLog: StageOutput[], finalStatus: string): { isConsistent: boolean; issues: string[] } {
  const issues: string[] = [];

  const hasLowConfidence = auditLog.some(s => s.step !== STAGE_NAMES.DECISION && s.confidence < CONFIDENCE_THRESHOLDS.MEDIUM);
  
  if (hasLowConfidence && finalStatus === 'Approved') {
    issues.push('Contradiction: One or more stages have low confidence, but the final decision is Approved.');
  }

  const decisionStage = auditLog.find(s => s.step === STAGE_NAMES.DECISION);
  if (decisionStage && decisionStage.result && decisionStage.result !== finalStatus) {
    issues.push(`Contradiction: Decision stage result (${decisionStage.result}) does not match final status (${finalStatus}).`);
  }

  return {
    isConsistent: issues.length === 0,
    issues
  };
}
