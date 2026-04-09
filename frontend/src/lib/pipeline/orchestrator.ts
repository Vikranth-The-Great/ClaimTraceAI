import { ClaimInput, PolicyType, DocumentStatus } from '../types/claim';
import { StageOutput } from '../types/stage';
import { ClaimResult } from '../types/result';
import { callStageAPI } from '../services/openai';
import { parseStageResponse } from '../services/parser';
import { validateConsistency } from '../validators/consistency';
import { calculateOverallConfidence } from '../utils/confidence';
import {
  buildStage1Prompt,
  buildStage2Prompt,
  buildStage3Prompt,
  buildStage4Prompt,
  buildStage5Prompt,
} from './prompts';
import { STAGE_NAMES } from '../utils/constants';

// ─── Input Validation ────────────────────────────────────────────────────────

const VALID_POLICY_TYPES: PolicyType[] = ['Comprehensive', 'Third-Party'];
const VALID_DOCUMENT_STATUSES: DocumentStatus[] = ['Complete', 'Incomplete', 'Missing'];

export function validateClaimInput(claim: unknown): ClaimInput {
  if (!claim || typeof claim !== 'object') {
    throw new Error('Invalid: claim input must be an object');
  }

  const c = claim as Record<string, unknown>;

  if (!c.claimId || typeof c.claimId !== 'string' || c.claimId.trim() === '') {
    throw new Error('Invalid: claimId is required and must be a non-empty string');
  }
  if (!c.accidentDescription || typeof c.accidentDescription !== 'string' || c.accidentDescription.trim() === '') {
    throw new Error('Invalid: accidentDescription is required and must be a non-empty string');
  }
  if (!VALID_POLICY_TYPES.includes(c.policyType as PolicyType)) {
    throw new Error(`Invalid: policyType must be one of: ${VALID_POLICY_TYPES.join(', ')}`);
  }
  if (typeof c.claimAmount !== 'number' || c.claimAmount <= 0) {
    throw new Error('Invalid: claimAmount must be a positive number');
  }
  if (typeof c.pastClaimsCount !== 'number' || c.pastClaimsCount < 0) {
    throw new Error('Invalid: pastClaimsCount must be a non-negative number');
  }
  if (!VALID_DOCUMENT_STATUSES.includes(c.documentStatus as DocumentStatus)) {
    throw new Error(`Invalid: documentStatus must be one of: ${VALID_DOCUMENT_STATUSES.join(', ')}`);
  }

  return c as unknown as ClaimInput;
}

// ─── Stage Runner (with retry) ────────────────────────────────────────────────

async function runStageWithRetry(prompt: string, stageLabel: string): Promise<StageOutput> {
  const raw1 = await callStageAPI(prompt);
  const result1 = parseStageResponse(raw1);
  if (result1) return result1;

  // Retry once
  console.warn(`[Orchestrator] ${stageLabel} parse failed, retrying...`);
  const raw2 = await callStageAPI(prompt);
  const result2 = parseStageResponse(raw2);
  if (result2) return result2;

  throw new Error(`${stageLabel} failed to produce valid JSON after 2 attempts.`);
}

// ─── Pipeline Orchestrator ────────────────────────────────────────────────────

export type OnStageComplete = (stage: StageOutput, stageIndex: number) => void;

export async function runPipeline(
  claim: ClaimInput,
  onStageComplete?: OnStageComplete
): Promise<ClaimResult> {
  const auditLog: StageOutput[] = [];

  // Stage 1 — Claim Analysis
  const s1 = await runStageWithRetry(
    buildStage1Prompt(claim),
    'Stage 1 (Claim Analysis)'
  );
  s1.step = STAGE_NAMES.CLAIM_ANALYSIS;
  auditLog.push(s1);
  onStageComplete?.(s1, 0);

  // Stage 2 — Coverage Validation
  const s2 = await runStageWithRetry(
    buildStage2Prompt(claim, auditLog),
    'Stage 2 (Coverage Validation)'
  );
  s2.step = STAGE_NAMES.COVERAGE_CHECK;
  auditLog.push(s2);
  onStageComplete?.(s2, 1);

  // Stage 3 — Document Validation
  const s3 = await runStageWithRetry(
    buildStage3Prompt(claim, auditLog),
    'Stage 3 (Document Validation)'
  );
  s3.step = STAGE_NAMES.DOCUMENT_CHECK;
  auditLog.push(s3);
  onStageComplete?.(s3, 2);

  // Stage 4 — Fraud / Consistency Check
  const s4 = await runStageWithRetry(
    buildStage4Prompt(claim, auditLog),
    'Stage 4 (Fraud Check)'
  );
  s4.step = STAGE_NAMES.FRAUD_CHECK;
  auditLog.push(s4);
  onStageComplete?.(s4, 3);

  // Stage 5 — Decision Generation (has extra 'result' field)
  const raw5 = await callStageAPI(buildStage5Prompt(claim, auditLog));
  let decisionStage: StageOutput;
  try {
    const parsed = JSON.parse(raw5);
    decisionStage = {
      step: STAGE_NAMES.DECISION,
      reason: parsed.reason ?? 'Decision generated.',
      confidence: parsed.confidence ?? 0,
      source: parsed.source ?? 'All prior stages',
      result: parsed.result,
    };
  } catch {
    throw new Error('Stage 5 (Decision) failed to parse JSON.');
  }
  auditLog.push(decisionStage);
  onStageComplete?.(decisionStage, 4);

  // Compute overall confidence using weighted formula
  const overallConfidence = calculateOverallConfidence(
    s1.confidence,
    s2.confidence,
    s3.confidence,
    s4.confidence
  );

  const finalStatus = decisionStage.result as 'Approved' | 'Rejected' | 'Pending';

  // Run consistency validator
  const { isConsistent, issues } = validateConsistency(auditLog, finalStatus);

  return {
    'Claim ID': claim.claimId,
    'Status': finalStatus,
    'Reason': decisionStage.reason,
    'Confidence Score': overallConfidence,
    'Audit Log': auditLog,
    isConsistent,
    consistencyIssues: issues,
  };
}
