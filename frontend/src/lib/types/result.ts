import { StageOutput } from './stage';

export interface ClaimResult {
  "Claim ID": string;
  "Status": 'Approved' | 'Rejected' | 'Pending';
  "Reason": string;
  "Confidence Score": number;
  "Audit Log": StageOutput[];
  isConsistent?: boolean;
  consistencyIssues?: string[];
}
