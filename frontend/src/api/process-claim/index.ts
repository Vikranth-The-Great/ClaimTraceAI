/**
 * /api/process-claim — Runs the full 5-stage pipeline end-to-end.
 *
 * This is a client-side service module (not a Next.js API route), since the
 * project runs as a Vite SPA. It wraps the orchestrator and provides a clean
 * interface for the frontend hooks to consume.
 */

import { ClaimInput } from '../../lib/types/claim';
import { ClaimResult } from '../../lib/types/result';
import { runPipeline, validateClaimInput, OnStageComplete } from '../../lib/pipeline/orchestrator';

export interface ProcessClaimOptions {
  onStageComplete?: OnStageComplete;
}

/**
 * Processes a full insurance claim through the 5-stage AI pipeline.
 * Validates input, runs all stages sequentially, returns a structured audit result.
 */
export async function processClaim(
  rawClaim: unknown,
  options: ProcessClaimOptions = {}
): Promise<ClaimResult> {
  // Validate input — throws with a descriptive message on any invalid field
  const claim: ClaimInput = validateClaimInput(rawClaim);

  // Run orchestrator
  return runPipeline(claim, options.onStageComplete);
}
