import { ClaimInput } from '../lib/types/claim';
import { runStage } from '../api/stage';
import { validate } from '../api/validate';
import { calculateOverallConfidence } from '../lib/utils/confidence';
import { STAGE_NAMES } from '../lib/utils/constants';
import useClaimStore from '../store/useClaimStore';
import { ClaimResult } from '../lib/types/result';

// STAGE_NAMES is imported for its side-effects (constants validation); kept for consistency.
void STAGE_NAMES;

export function usePipeline() {
  const store = useClaimStore();

  /**
   * Process a single claim through the full 5-stage pipeline.
   * Updates the main dashboard state (isProcessing, stages, finalResult).
   * Used by the Claims Dashboard (homepage).
   */
  async function processClaim(claim: ClaimInput): Promise<void> {
    store.startProcessing();

    try {
      const priorStages = [];

      for (let stageNumber = 1; stageNumber <= 5; stageNumber++) {
        const stage = await runStage({
          claim,
          stageNumber: stageNumber as 1 | 2 | 3 | 4 | 5,
          priorStages,
        });

        priorStages.push(stage);
        store.appendStage(stage);
      }

      // Run consistency validation
      const decisionStage = priorStages[4];
      const finalStatus = decisionStage.result as 'Approved' | 'Rejected' | 'Pending';
      const validationResult = validate({ auditLog: priorStages, finalStatus });

      if (!validationResult.isConsistent) {
        store.setConsistencyWarning(validationResult.issues);
      }

      const overallConfidence = calculateOverallConfidence(
        priorStages[0].confidence,
        priorStages[1].confidence,
        priorStages[2].confidence,
        priorStages[3].confidence,
      );

      const result: ClaimResult = {
        'Claim ID': claim.claimId,
        'Status': finalStatus,
        'Reason': decisionStage.reason,
        'Confidence Score': overallConfidence,
        'Audit Log': priorStages,
        isConsistent: validationResult.isConsistent,
        consistencyIssues: validationResult.issues,
      };

      store.setFinalResult(result);
      store.addToHistory(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown pipeline error occurred.';
      store.setError(message);
    }
  }

  /**
   * Process a single claim silently for the batch pipeline.
   * Does NOT update main dashboard state — only adds to batchResults and auditHistory.
   * Used by the Batch Analysis page.
   */
  async function runBatchAll(claim: ClaimInput): Promise<void> {
    try {
      const priorStages = [];

      for (let stageNumber = 1; stageNumber <= 5; stageNumber++) {
        const stage = await runStage({
          claim,
          stageNumber: stageNumber as 1 | 2 | 3 | 4 | 5,
          priorStages,
        });
        priorStages.push(stage);
      }

      const decisionStage = priorStages[4];
      const finalStatus = decisionStage.result as 'Approved' | 'Rejected' | 'Pending';
      const validationResult = validate({ auditLog: priorStages, finalStatus });

      const overallConfidence = calculateOverallConfidence(
        priorStages[0].confidence,
        priorStages[1].confidence,
        priorStages[2].confidence,
        priorStages[3].confidence,
      );

      const result: ClaimResult = {
        'Claim ID': claim.claimId,
        'Status': finalStatus,
        'Reason': decisionStage.reason,
        'Confidence Score': overallConfidence,
        'Audit Log': priorStages,
        isConsistent: validationResult.isConsistent,
        consistencyIssues: validationResult.issues,
      };

      store.addToBatch(result);
      store.addToHistory(result);
    } catch (err: unknown) {
      // Batch errors are non-fatal — log but don't crash the batch run.
      console.error(`Batch processing failed for ${claim.claimId}:`, err);
    }
  }

  return { processClaim, runBatchAll };
}
