/**
 * /api/stage — Runs a single stage of the pipeline.
 *
 * Used for streaming-style UI updates: each stage fires individually so the
 * UI can reveal cards one by one as results arrive.
 */

import { ClaimInput } from '../../lib/types/claim';
import { StageOutput } from '../../lib/types/stage';
import { callStageAPI } from '../../lib/services/openai';
import { parseStageResponse } from '../../lib/services/parser';
import { STAGE_NAMES } from '../../lib/utils/constants';
import {
  buildStage1Prompt,
  buildStage2Prompt,
  buildStage3Prompt,
  buildStage4Prompt,
  buildStage5Prompt,
} from '../../lib/pipeline/prompts';

export interface RunStageRequest {
  claim: ClaimInput;
  stageNumber: 1 | 2 | 3 | 4 | 5;
  priorStages: StageOutput[];
}

const STAGE_NAME_MAP: Record<number, string> = {
  1: STAGE_NAMES.CLAIM_ANALYSIS,
  2: STAGE_NAMES.COVERAGE_CHECK,
  3: STAGE_NAMES.DOCUMENT_CHECK,
  4: STAGE_NAMES.FRAUD_CHECK,
  5: STAGE_NAMES.DECISION,
};

function buildPrompt(req: RunStageRequest): string {
  switch (req.stageNumber) {
    case 1: return buildStage1Prompt(req.claim);
    case 2: return buildStage2Prompt(req.claim, req.priorStages);
    case 3: return buildStage3Prompt(req.claim, req.priorStages);
    case 4: return buildStage4Prompt(req.claim, req.priorStages);
    case 5: return buildStage5Prompt(req.claim, req.priorStages);
    default: throw new Error(`Invalid stage number: ${req.stageNumber}`);
  }
}

/**
 * Executes a single pipeline stage and returns its structured output.
 */
export async function runStage(req: RunStageRequest): Promise<StageOutput> {
  const prompt = buildPrompt(req);
  const raw = await callStageAPI(prompt);
  const parsed = parseStageResponse(raw);

  if (!parsed) {
    // Retry once
    const raw2 = await callStageAPI(prompt);
    const parsed2 = parseStageResponse(raw2);
    if (!parsed2) {
      throw new Error(`Stage ${req.stageNumber} failed to parse valid JSON after 2 attempts.`);
    }
    parsed2.step = STAGE_NAME_MAP[req.stageNumber];
    return parsed2;
  }

  parsed.step = STAGE_NAME_MAP[req.stageNumber];
  return parsed;
}
