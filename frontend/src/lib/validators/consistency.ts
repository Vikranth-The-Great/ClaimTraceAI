import { StageOutput } from '../types/stage';
import { STAGE_NAMES, CONFIDENCE_THRESHOLDS } from '../utils/constants';

export function validateConsistency(auditLog: StageOutput[], finalStatus: string): { isConsistent: boolean; issues: string[] } {
  const issues: string[] = [];

  const hasLowConfidence = auditLog.some(s => s.step !== STAGE_NAMES.DECISION && s.confidence < CONFIDENCE_THRESHOLDS.MEDIUM);
  
  if (hasLowConfidence && finalStatus === 'Approved') {
    issues.push('Reasoning Conflict: One or more stages have low confidence, but the final decision is Approved.');
  }

  const coverageStage = auditLog.find(s => s.step === STAGE_NAMES.COVERAGE_CHECK);
  if (coverageStage && coverageStage.reason.toLowerCase().includes('reject') && finalStatus === 'Approved') {
    issues.push('Critical Conflict: Coverage stage indicated rejection, but final status is Approved.');
  }

  const fraudStage = auditLog.find(s => s.step === STAGE_NAMES.FRAUD_CHECK);
  if (fraudStage && fraudStage.confidence < 0.65 && finalStatus === 'Approved') {
    issues.push('Risk Conflict: High fraud risk detected, but final status is Approved.');
  }

  const decisionStage = auditLog.find(s => s.step === STAGE_NAMES.DECISION);
  if (decisionStage && decisionStage.result && decisionStage.result !== finalStatus) {
    issues.push(`Internal Conflict: Workflow result (${decisionStage.result}) does not match output status (${finalStatus}).`);
  }

  return {
    isConsistent: issues.length === 0,
    issues
  };
}
