import { ClaimInput } from '../lib/types/claim';

export const DEMO_CLAIMS: Record<string, ClaimInput> = {
  C1: {
    claimId: 'C1',
    accidentDescription: 'Hit a tree while reversing out of the driveway',
    policyType: 'Third-Party',
    claimAmount: 15000,
    pastClaimsCount: 0,
    documentStatus: 'Complete'
  },
  C2: {
    claimId: 'C2',
    accidentDescription: 'Rear-ended by another vehicle on the highway. Bumper and boot damaged.',
    policyType: 'Comprehensive',
    claimAmount: 38000,
    pastClaimsCount: 1,
    documentStatus: 'Complete'
  },
  C3: {
    claimId: 'C3',
    accidentDescription: 'Minor scratch on the side panel while parking',
    policyType: 'Comprehensive',
    claimAmount: 95000,
    pastClaimsCount: 4,
    documentStatus: 'Missing'
  }
};
