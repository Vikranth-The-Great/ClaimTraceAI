import { ClaimInput } from '../types/claim';
import { StageOutput } from '../types/stage';
import { COMPANY_MASTER_POLICY } from './policy';

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

function getPolicyContext(): string {
  return `
=== MASTER COMPANY POLICY ===
${COMPANY_MASTER_POLICY}
=============================
`;
}

export function buildStage1Prompt(claim: ClaimInput): string {
  return `
STAGE 1: CLAIM ANALYSIS
Task: Analyze the plausibility and internal consistency of the accident description.

${getPolicyContext()}

Claim Data:
${formatClaimData(claim)}

Instructions:
- Evaluate if the description logically aligns with a typical accident.
- Provide a reasoning text of at least 2 full sentences.
- Assign a confidence score between 0.80 and 0.95.
- Set source to "Description input".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage2Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  return `
STAGE 2: COVERAGE VALIDATION
Task: Validate if the policy covers the damage described based on the MASTER COMPANY POLICY.

${getPolicyContext()}

Claim Data:
${formatClaimData(claim)}

Prior Stage Results:
${formatPriorStages(priorStages)}

Instructions:
- STRICTLY refer to Section 1 of the Policy. 
- If the claim involves own damage on a Third-Party policy, it MUST be flagged for rejection. This is absolute.
- Provide a reasoning text of at least 2 full sentences quoting the policy logic.
- Assign a confidence score between 0.90 and 0.99.
- Set source to "Master Policy - Section 1".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage3Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  return `
STAGE 3: DOCUMENT VALIDATION
Task: Evaluate document completeness relative to the claim size and type based on the MASTER COMPANY POLICY.

${getPolicyContext()}

Claim Data:
${formatClaimData(claim)}

Prior Stage Results:
${formatPriorStages(priorStages)}

Instructions:
- STRICTLY refer to Section 3 of the Policy.
- Evaluate Document Status against the Claim Amount.
- Provide a reasoning text of at least 2 full sentences quoting the policy logic.
- Assign a confidence score between 0.70 and 0.90. (Lower if documents are inadequate for the amount).
- Set source to "Master Policy - Section 3".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage4Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  return `
STAGE 4: FRAUD / CONSISTENCY CHECK
Task: Identify potential fraud indicators or input contradictions based on the MASTER COMPANY POLICY.

${getPolicyContext()}

Claim Data:
${formatClaimData(claim)}

Prior Stage Results:
${formatPriorStages(priorStages)}

Instructions:
- STRICTLY refer to Section 2 of the Policy.
- Check Past Claims Count and Claim Amount proportionality.
- Provide a reasoning text of at least 2 full sentences quoting the policy logic.
- Assign a confidence score between 0.55 and 0.95. If flags (like > 3 claims or disproportionate amounts) are found, confidence should be < 0.65.
- Set source to "Master Policy - Section 2".

${COMMON_INSTRUCTIONS}
`.trim();
}

export function buildStage5Prompt(claim: ClaimInput, priorStages: StageOutput[]): string {
  return `
STAGE 5: DECISION GENERATION
Task: Aggregate all prior reasoning into a final verdict strictly following the MASTER COMPANY POLICY.

${getPolicyContext()}

Claim Data:
${formatClaimData(claim)}

Prior Stage Results:
${formatPriorStages(priorStages)}

Instructions:
- STRICTLY refer to Section 4 of the Policy (AUTOMATED DECISION MATRIX).
- If Stage 2 indicated Coverage rejection -> Status: Rejected.
- If Stage 4 indicated Fraud flags (confidence < 0.65) -> Status: Rejected or Pending.
- If any stage confidence < 0.65 -> Status: Pending.
- Provide a primary reason sentence that summarizes the decision based on Policy Rules.
- The "result" field must be exactly one of: "Approved", "Rejected", "Pending".
- Confidence Score should be a weighted average (S1*0.1, S2*0.4, S3*0.2, S4*0.3).

Respond ONLY with valid JSON. Use this schema: { "step": "decision", "result": string, "reason": string, "confidence": number, "source": string }
`.trim();
}
