export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.80,
  MEDIUM: 0.65,
};

export const WEIGHTS = {
  STAGE_1: 0.10,
  STAGE_2: 0.40,
  STAGE_3: 0.20,
  STAGE_4: 0.30,
};

export const STAGE_NAMES = {
  CLAIM_ANALYSIS: 'claim_analysis',
  COVERAGE_CHECK: 'coverage_check',
  DOCUMENT_CHECK: 'document_check',
  FRAUD_CHECK: 'fraud_check',
  DECISION: 'decision',
} as const;

export const DEFAULT_MODELS = {
  PRIMARY: 'gpt-4o',
};

export const TEMPERATURE = 0.1;
export const MAX_TOKENS = 500;
