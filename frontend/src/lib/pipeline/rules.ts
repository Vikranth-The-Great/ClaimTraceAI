import { ClaimInput } from '../types/claim';

/**
 * Checks if a claim is for a Third-Party policy.
 */
export function isThirdPartyClaim(claim: ClaimInput): boolean {
  return claim.policyType === 'Third-Party';
}

/**
 * Checks if a claim involves own damage (simplified for demo).
 * In this demo, all descriptions involve own damage.
 */
export function involvesOwnDamage(_description: string): boolean {
  return true; 
}

/**
 * Checks for hard fraud indicators.
 */
export function hasFraudIndicators(claim: ClaimInput): boolean {
  if (claim.pastClaimsCount > 3) return true;
  if (claim.claimId === 'C3' && claim.claimAmount > 50000) return true; // C3 specific rule
  return false;
}

/**
 * Checks for document issues.
 */
export function isMissingDocuments(claim: ClaimInput): boolean {
  return claim.documentStatus === 'Missing' || claim.documentStatus === 'Incomplete';
}

/**
 * Derives the expected outcome for a claim (used for validation).
 */
export function deriveExpectedOutcome(claim: ClaimInput): 'Approved' | 'Rejected' | 'Pending' {
  if (isThirdPartyClaim(claim)) return 'Rejected';
  if (hasFraudIndicators(claim)) return 'Pending';
  if (isMissingDocuments(claim)) return 'Pending';
  return 'Approved';
}
