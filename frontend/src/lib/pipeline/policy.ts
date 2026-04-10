export const COMPANY_MASTER_POLICY = `
=============================================
ATLAS INSURANCE - MASTER AUTO POLICY GUIDELINES
Document ID: PL-2023-AUTO-01
EFFECTIVE DATE: Jan 1, 2024
=============================================

1. POLICY TYPES & COVERAGE:
   A) Third-Party Liability Only ("Third-Party"):
      - COVERS: Damages or bodily injury to third-party vehicles, property, or persons caused by the insured vehicle.
      - EXCLUDES: Any damage whatsoever to the policyholder's own vehicle (Own Damage), regardless of fault.
   
   B) Comprehensive Coverage ("Comprehensive"):
      - COVERS: Third-party liabilities PLUS Own Damage to the insured vehicle.
      - Own Damage includes: Accidents, self-inflicted damage (e.g., hitting a tree, side-panel scratches, rear-ending another car), weather-related damage, fire, and theft.

2. FRAUD & RISK INDICATORS (RED FLAGS):
   - Claim Frequency: Any policyholder filing more than 3 past claims must be flagged as High Risk / Fraud Suspect.
   - Proportionality: Claim amounts must logically align with the physical damage described. For example, claiming a massive amount (e.g., > 50,000 INR) for a "minor scratch" or "small dent" is a strong indicator of inflation/fraud.

3. DOCUMENTATION REQUIREMENTS:
   - For high-value claims (exceeding 50,000 INR), "Complete" documentation is strictly mandatory.
   - If documents are "Missing" or "Incomplete" for these high-value claims, confidence must be lowered and it requires human review.

4. AUTOMATED DECISION MATRIX:
   - RULE A: If a claim violates Coverage parameters (e.g., Own Damage claimed on a Third-Party policy), it MUST be REJECTED.
   - RULE B: If strict fraud red flags are triggered (High frequency + Disproportionate amount), the claim MUST be REJECTED or sent to PENDING.
   - RULE C: If minor discrepancies exist (e.g., missing documents, slightly vague descriptions), set to PENDING for manual review.
   - RULE D: Clean claims with Complete documents, valid coverage, and aligned parameters should be APPROVED.
`;
