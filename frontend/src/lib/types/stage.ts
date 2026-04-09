export interface StageOutput {
  step: string;
  reason: string;
  confidence: number;
  source: string;
  result?: string; // Optional for the decision stage
}
