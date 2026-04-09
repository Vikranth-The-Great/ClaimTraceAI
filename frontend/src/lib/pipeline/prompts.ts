import { ClaimInput } from '../types/claim';
import { StageOutput } from '../types/stage';

function formatClaimData(claim: ClaimInput): string {
  return `
Claim ID: ${claim.claimId}
Accident Description: ${claim.accidentDescription}
Policy Type: ${claim.policyType}
Claim Amount: INR ${claim.claimAmount}
Past Claims Count: ${claim.pastClaimsCount}
Document Status: ${claim.documentStatus}
`.trim();
}

function formatPriorStages(stages: StageOutput[]): string {
  if (stages.length === 0) return 'No prior stages.';
  return stages.map(s => `Step: ${s.step}\nReasoning: ${s.reason}\nConfidence: ${s.confidence}\nSource: ${s.source}`).join('\n\n');
}

const COMMON_INSTRUCTIONS = 'Respond ONLY with valid JSON. No preamble. No markdown fences. Use exactly this schema: { "step": string, "reason": string, "confidence": number, "source": string }';

export function buildStage1Prompt(claim: ClaimInput): string {
  const data = formatClaimData(claim);
  return `
STAGE 1: CLAIM ANALYSIS
Task: Analyze the plausibility and internal consistency of the accident description.

Claim Data:
${data}

Instructions:
- Evaluate if the description "Hit a tree while reversing" or "Rear-ended" or "Minor scratch" logically aligns with a typical accident.
- Provide a reasoning text of at least 2 full sentences.
- Assign a confidence score between 0.80 and 0.95.
- Set source to "Description input".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage2Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  const data = formatClaimData(claim);
  const prior = formatPriorStages(priorStages);
  return `
STAGE 2: COVERAGE VALIDATION
Task: Validate if the policy covers the damage described.

CRITICAL RULE:
- Comprehensive policy COVERS own damage (e.g., hitting a tree, side-panel scratches).
- Third-Party policy DOES NOT cover own vehicle damage (it only covers damage to others).
- If a claim involves own damage on a Third-Party policy, it MUST be flagged for rejection.
- DO NOT DEVIATE FROM THIS RULE UNDER ANY CIRCUMSTANCES.

Claim Data:
${data}

Prior Stage Results:
${prior}

Instructions:
- Provide a reasoning text of at least 2 full sentences.
- Assign a confidence score between 0.90 and 0.99.
- Set source to "Policy Type rule".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage3Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  const data = formatClaimData(claim);
  const prior = formatPriorStages(priorStages);
  return `
STAGE 3: DOCUMENT VALIDATION
Task: Evaluate document completeness relative to the claim size and type.

Claim Data:
${data}

Prior Stage Results:
${prior}

Instructions:
- If Document Status is "Missing" or "Incomplete", especially for high amounts (> INR 50,000), result in lower confidence.
- Provide a reasoning text of at least 2 full sentences.
- Assign a confidence score between 0.70 and 0.90.
- Set source to "Document Status input".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage4Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  const data = formatClaimData(claim);
  const prior = formatPriorStages(priorStages);
  return `
STAGE 4: FRAUD / CONSISTENCY CHECK
Task: Identify potential fraud indicators or input contradictions.

CRITICAL RULES:
- If Past Claims Count > 3, flag as a high fraud risk.
- If Claim Amount is disproportionate to damage (e.g., INR 95,000 for a "minor scratch"), flag as a fraud indicator.
- Specifically, a claim of INR 95,000 for a described minor scratch is disproportionate.

Claim Data:
${data}

Prior Stage Results:
${prior}

Instructions:
- Provide a reasoning text of at least 2 full sentences.
- Assign a confidence score between 0.55 and 0.95. If flags are found, confidence should be < 0.65.
- Set source to "Past Claims count + Claim Amount".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage5Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  const data = formatClaimData(claim);
  const prior = formatPriorStages(priorStages);
  return `
STAGE 5: DECISION GENERATION
Task: Aggregate all prior reasoning into a final verdict.

DECISION RULES:
- If Coverage Validation (Stage 2) indicated no coverage -> Status: Rejected.
- If Fraud Check (Stage 4) found high risk (confidence < 0.65) -> Status: Rejected or Pending.
- If any stage confidence < 0.65 -> Status: Pending (Human Review Required).
- If all stages pass with confidence >= 0.65 -> Status: Approved.

Claim Data:
${data}

Prior Stage Results:
${prior}

Instructions:
- Provide a primary reason sentence that summarizes the decision.
- The "result" field must be exactly one of: "Approved", "Rejected", "Pending".
- Confidence Score should be a weighted average (S1*0.1, S2*0.4, S3*0.2, S4*0.3).

Respond ONLY with valid JSON. Use this schema: { "step": "decision", "result": string, "reason": string, "confidence": number, "source": string }
`.trim();
}
