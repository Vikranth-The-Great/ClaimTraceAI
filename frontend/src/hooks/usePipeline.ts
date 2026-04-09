import { ClaimInput } from '../lib/types/claim';
import { runStage } from '../api/stage';
import { validate } from '../api/validate';
import { calculateOverallConfidence } from '../lib/utils/confidence';
import { STAGE_NAMES } from '../lib/utils/constants';
import useClaimStore from '../store/useClaimStore';

export function usePipeline() {
  const store = useClaimStore();

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

      // Calculate overall confidence from the 4 non-decision stages
      const overallConfidence = calculateOverallConfidence(
        priorStages[0].confidence,
        priorStages[1].confidence,
        priorStages[2].confidence,
        priorStages[3].confidence,
      );

      const result = {
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

  return { processClaim };
}
