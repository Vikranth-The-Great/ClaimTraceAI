export type PolicyType = 'Comprehensive' | 'Third-Party';
export type DocumentStatus = 'Complete' | 'Incomplete' | 'Missing';

export interface ClaimInput {
  claimId: string;
  accidentDescription: string;
  policyType: PolicyType;
  claimAmount: number;
  pastClaimsCount: number;
  documentStatus: DocumentStatus;
}
