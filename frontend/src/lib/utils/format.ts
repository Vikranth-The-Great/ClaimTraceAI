import { ClaimInput } from '../types/claim';
import { StageOutput } from '../types/stage';
import { ClaimResult } from '../types/result';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatConfidence(score: number): string {
  return score.toFixed(2);
}

export function buildFinalOutput(claim: ClaimInput, auditLog: StageOutput[], overallConfidence: number): ClaimResult {
  const decisionStage = auditLog.find(s => s.step === 'decision');
  const status = (decisionStage?.result as 'Approved' | 'Rejected' | 'Pending') || 'Pending';
  const reason = decisionStage?.reason || 'Awaiting full AI analysis';

  return {
    "Claim ID": claim.claimId,
    "Status": status,
    "Reason": reason,
    "Confidence Score": overallConfidence,
    "Audit Log": auditLog
  };
}
