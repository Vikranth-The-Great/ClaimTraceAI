/**
 * /api/validate — Runs the consistency validator on a completed pipeline result.
 *
 * Checks that the final decision does not contradict any intermediate stage
 * outputs or confidence thresholds. Returns validation result which is
 * attached to the ClaimResult and shown as a warning banner in the UI.
 */

import { StageOutput } from '../../lib/types/stage';
import { validateConsistency } from '../../lib/validators/consistency';

export interface ValidateRequest {
  auditLog: StageOutput[];
  finalStatus: string;
}

export interface ValidateResult {
  isConsistent: boolean;
  issues: string[];
}

/**
 * Validates the consistency of a completed pipeline's audit log against its final status.
 */
export function validate(req: ValidateRequest): ValidateResult {
  return validateConsistency(req.auditLog, req.finalStatus);
}
