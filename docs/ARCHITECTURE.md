# ClaimTrace AI — System Architecture

## Overview
ClaimTrace AI is an explainable, audit-ready AI decision system for insurance claims. It uses a 5-stage sequential reasoning pipeline to process claims and generate a structured audit log.

## Tech Stack
- **Frontend**: React (Vite)
- **State Management**: Zustand
- **AI**: OpenAI (GPT-4o)
- **Styling**: Tailwind CSS / Vanilla CSS

## Directory Structure
- `frontend/src/lib/pipeline`: Pipeline orchestration logic.
- `frontend/src/lib/services`: External service wrappers (OpenAI, etc.).
- `frontend/src/lib/types`: TypeScript definitions.
- `frontend/src/lib/utils`: Helper functions and constants.
- `frontend/src/store`: Zustand store for application state.
- `frontend/src/hooks`: Custom React hooks for pipeline execution.

## Pipeline Stages
1. **Claim Analysis**: Plausibility check of the description.
2. **Coverage Validation**: Hard rule check (Comprehensive vs Third-Party).
3. **Document Validation**: Completeness check vs claim amount.
4. **Fraud / Consistency Check**: Red flag detection (past claims, amount ratios).
5. **Decision Generation**: Final aggregation and verdict.

## Confidence Scoring
Overall confidence is calculated as a weighted average:
`(s1 * 0.10) + (s2 * 0.40) + (s3 * 0.20) + (s4 * 0.30)`

## Data Schema
The system outputs a mandatory JSON schema containing:
- Claim ID
- Status (Approved/Rejected/Pending)
- Reason
- Confidence Score
- Full Audit Log (sequential steps)
