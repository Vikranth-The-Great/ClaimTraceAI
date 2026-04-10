# ClaimTrace AI — System Architecture

## Overview
ClaimTrace AI is an explainable, audit-ready AI decision system for insurance claims. It processes claims through 5 sequential reasoning stages — producing a full, structured audit trail with confidence scores and source citations for every step.

## Tech Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript (Strict Mode)
- **State Management**: Zustand with `persist` middleware (Local Storage persistence)
- **AI Engine**: OpenAI `gpt-4o` (Temperature 0.1 for determinism)
- **Styling**: Tailwind CSS & Vanilla CSS (Glassmorphism & Professional Audit Dashboard aesthetics)
- **Icons**: Material Symbols Rounded

## Core Modules (`frontend/src/lib/`)
- **`pipeline/`**: Contains the orchestrator and the 5-stage logic. Each stage is a separate GPT-4o call where prior stage outputs are piped forward as context.
- **`services/`**: Secure OpenAI API wrapper using the `openai` SDK.
- **`validators/`**: Consistency validator that flags contradictions between AI reasoning steps and the final verdict.
- **`utils/`**: Weighted confidence calculator and shared constants.
- **`types/`**: Comprehensive TypeScript interfaces for claims, stages, and audit logs.

## Pipeline Reasoning Logic
1.  **Claim Analysis (Stage 1)**: Evaluates the narrative for plausibility.
2.  **Coverage Validation (Stage 2)**: Hard rules: `Third-Party` covers only others; `Comprehensive` covers own and others. Rejects claims violating this.
3.  **Document Validation (Stage 3)**: Flags missing/incomplete docs, especially for claims > ₹50,000.
4.  **Fraud Check (Stage 4)**: Flags high past claim counts (>3) and disproportionate amount-to-description ratios (e.g., ₹95k for a scratch).
5.  **Executive Decision (Stage 5)**: The "Consensus" stage that aggregates all prior scores and logic into a final verdict.

## Analytics Intelligence Dashboard
The `/analytics` module aggregates data from the Zustand `auditHistory`:
- **KPI Engine**: Calculates approval rates, average confidence, and risk distributions.
- **Data Visualization**: Decision distribution charts and per-stage confidence histograms.
- **Audit History Tracker**: A high-density table for browsing all historical decisions.

## Mandatory JSON Schema (Audit Traceability)
The system produces an audit-ready JSON payload for every decision:
```json
{
  "Claim ID": "C1",
  "Status": "Rejected",
  "Reason": "Reason sentence",
  "Confidence Score": 0.92,
  "Audit Log": [
    { "step": "claim_analysis", "reason": "...", "confidence": 0.85, "source": "Description input" },
    ...
  ]
}
```
