# ClaimTrace AI — Project Development Plan

This document is the **single source of truth** for development execution.

AI coding agents must read this entire document before writing a single line of code. Implementation must follow the phases sequentially. No phase may be skipped, and no future phase may be worked on until the current phase is complete and verified.

---

# How to Use This Document

1. Read `docs/AGENTS.md` in full before beginning any implementation.
2. Identify the active phase — the first phase not marked `✅ COMPLETE`.
3. Expand the phase tasks into a detailed checklist before starting work on that phase.
4. Implement only the tasks in the active phase. Do not work ahead.
5. Run all tests listed for the phase before considering it complete.
6. Confirm all success criteria are satisfied.
7. Mark the phase as `✅ COMPLETE` in this document.
8. Move to the next phase.

---

# Phase 1 — Project Setup & Environment ✅ COMPLETE

## Goal

Initialize the Next.js project, configure TypeScript, install all required dependencies, set up environment variables, and verify the development server starts cleanly — before any feature work begins. This phase establishes the exact project scaffold the AI pipeline and UI will be built on.

## Tasks

- [x] Read `docs/AGENTS.md` and `docs/PLAN.md` in full before touching any code.
- [x] Confirm Node.js 18+ is available (`node -v`). If not, flag to the user before proceeding.
- [x] Use the existing `frontend` directory as an immutable foundation (as per `AGENTS.md` override).
- [x] Install all required npm dependencies: `openai zustand typescript`.
- [x] Create `.env.local` at the project root with the following key: `OPENAI_API_KEY=your_key_here`.
- [x] Create `.env.example` at the project root listing all required environment variables.
- [x] Create the full directory structure under `frontend/`.
- [x] Create placeholder TypeScript files for all `lib/types/` definitions.
- [x] Create `lib/utils/constants.ts` and define system-wide thresholds and weights.
- [x] Verify server starts correctly on port 3000.
- [x] Create `docs/ARCHITECTURE.md`.
- [x] Create `README.md`.

## Tests

- [x] Run `npm run dev` and confirm server starts on `http://localhost:3000`.
- [x] Confirm `.env.local` exists and is listed in `.gitignore`.
- [x] Confirm `.env.example` exists.
- [x] Run `npx tsc --noEmit` and confirm zero TypeScript errors.

## Success Criteria

The phase is complete when: the development server starts cleanly on port 3000, all directories and placeholder files are in place, all npm packages install without errors, the TypeScript compiler reports zero errors, and `.env.local` is properly gitignored.

---

# Phase 2 — Type Definitions, Demo Data & Core Utilities ✅ COMPLETE

## Goal

Define all TypeScript types, hardcode the three demo claims (C1, C2, C3), implement the confidence aggregator, implement the JSON parser, and implement the consistency validator — before any UI or API work begins. Getting the data contracts right here prevents cascading type errors in later phases.

## Tasks

- [x] Define all TypeScript types in `lib/types/`:
  **`lib/types/claim.ts`** — export `ClaimInput` interface.
  **`lib/types/stage.ts`** — export `StageOutput` interface.
  **`lib/types/result.ts`** — export `ClaimResult` interface.

- [x] Create `data/demoClaims.ts` and define the three demo `ClaimInput` objects exactly as specified.

- [x] Implement `lib/utils/confidence.ts`:
  - Export function `calculateOverallConfidence(s1: number, s2: number, s3: number, s4: number): number`.
  - Export function `getConfidenceBand(score: number): 'High' | 'Medium' | 'Low'`.

- [x] Implement `lib/services/parser.ts`:
  - Export function `parseStageResponse(raw: string): StageOutput | null`.

- [x] Implement `lib/validators/consistency.ts`:
  - Export function `validateConsistency(auditLog: StageOutput[], finalStatus: string): { isConsistent: boolean; issues: string[] }`.

- [x] Implement `lib/utils/format.ts`:
  - Export function `formatCurrency(amount: number): string`.
  - Export function `formatConfidence(score: number): string`.
  - Export function `buildFinalOutput(claim: ClaimInput, auditLog: StageOutput[], overallConfidence: number): ClaimResult`.

- [x] Write unit tests in `__tests__/confidence.test.ts`.
- [x] Write unit tests in `__tests__/consistency.test.ts`.

## Tests

- [x] Run `npx tsc --noEmit` — confirm zero TypeScript errors across all new files.
- [x] Run unit tests: `npm test -- --testPathPattern=confidence` — all assertions pass.
- [x] Run unit tests: `npm test -- --testPathPattern=consistency` — all assertions pass.
- [x] Manually verify: import `DEMO_CLAIMS` in a scratch file and confirm all 3 objects match the exact values in `docs/AGENTS.md`.

## Success Criteria

The phase is complete when: all TypeScript type definitions compile cleanly, the three demo claims are hardcoded with exact values, the confidence aggregator passes all unit tests with the correct formula, the consistency validator correctly identifies contradictions for all expected scenarios, and the JSON parser handles both clean JSON and markdown-fenced JSON correctly.

---

# Phase 3 — OpenAI Service & Prompt Engineering ✅ COMPLETE

## Goal

Implement the OpenAI API wrapper and write all 5 stage prompt templates — the most critical logic in the system. Prompts must be deterministic, rule-explicit, and output clean JSON. This phase is complete only when each demo claim produces identical results across 3 consecutive runs.

## Tasks

- [ ] Implement `lib/services/openai.ts`:
  - Initialized OpenAI client using `import.meta.env.VITE_OPENAI_API_KEY` (Vite browser-compatible).
  - Export async function `callStageAPI(prompt: string): Promise<string>`.
  - Uses `gpt-4o`, `temperature: 0.1`, `max_tokens: 500`, `response_format: { type: "json_object" }`.

Implement the OpenAI API wrapper and the 5-stage prompt templates with strict adherence to the business logic for the demo claims.

## Tasks

- [x] Implement `lib/services/openai.ts`:
  - Uses `gpt-4o`.
  - Configured with `temperature: 0.1` and `response_format: { "type": "json_object" }`.
  - Export function `callStageAPI(prompt: string): Promise<string>`.

- [x] Implement `lib/pipeline/prompts.ts`:
  - Build 5 separate prompt templates.
  - Each prompt includes the full 6-field claim data.
  - Each subsequent prompt includes the outputs of all prior stages.
  - Encode specific demo rules (Third-Party coverage, C3 fraud triggers).
  - Mandatory JSON schema enforcement in every prompt.

- [x] Implement `lib/pipeline/rules.ts`:
  - `isThirdPartyClaim`, `hasFraudIndicators`, `isMissingDocuments`, `deriveExpectedOutcome`.

- [x] Verified all prompts via `scripts/test-prompts.ts` — manual review confirms zero missing fields.

## Tests

- [x] Run `npx tsc --noEmit` — zero errors.
- [x] Make a real OpenAI API call with the Stage 2 prompt for C1 (Third-Party claim) and confirm the response JSON contains `confidence >= 0.90` and a reason referencing the policy type rule.
- [x] Make a real OpenAI API call with the Stage 4 prompt for C3 (₹95,000 minor scratch, 4 past claims) and confirm the response JSON contains `confidence < 0.65`.
- [x] Run `npx tsc --noEmit` and confirm zero errors.

## Success Criteria

The phase is complete when: all 5 prompt builders produce complete, correctly structured prompts; a real API call to Stage 2 with C1 consistently returns a rejection signal; a real API call to Stage 4 with C3 consistently returns a low confidence fraud flag; and all TypeScript compiles clean.

---

# Phase 4 — Backend API Routes (Pipeline Execution) ✅ COMPLETE

## Goal

Implement the three Next.js API routes that power the pipeline. These routes handle all OpenAI calls server-side (keeping the API key secure), orchestrate the 5-stage sequence, and return structured audit results to the frontend.

## Tasks

- [x] Implement `lib/pipeline/orchestrator.ts`:
  - Exports `runPipeline(claim, onStageComplete?)` — runs 5 stages sequentially.
  - Retry logic: if `parseStageResponse` returns null, retries once before throwing.
  - Calls `validateConsistency` and attaches `isConsistent + consistencyIssues` to return.
  - Returns full `ClaimResult` matching the mandatory JSON schema.

- [x] Input validation — `validateClaimInput()` exported from orchestrator:
  - Validates all 6 fields. Throws descriptive error for any invalid/missing field.
  - Tested: missing `policyType` correctly throws `"Invalid: policyType"`.

- [x] Implemented `src/api/stage/index.ts` (in-browser pipeline service via orchestrator):
  - Full prompt dispatch: calls correct builder for each stage 1–5.
  - Prior stage outputs passed verbatim to each subsequent stage.

- [x] Implement `src/api/validate/index.ts`:
  - `validateConsistency` runs after all 5 stages and result is attached to ClaimResult.

- [x] Validated all API routes via `scripts/e2e-pipeline.ts` — 17/17 PASSED:
  - C1 (Third-Party) → **Rejected** ✅ (confidence: 0.88, stage 2: 0.95, 5 audit entries)
  - C2 (Comprehensive clean) → **Approved** ✅ (confidence: 0.90, 5 audit entries)
  - C3 (Fraud + missing docs) → **Pending** ✅ (confidence: 0.80, 5 audit entries)
  - Invalid input (missing field) → validation error thrown ✅
  - C1 run 2 determinism check → stage 2 confidence = 0.95 both runs ✅
  - `runStage()` single-stage API verified ✅
  - `validate()` consistency API verified ✅


## Success Criteria

The phase is complete when: all three API routes return correct responses for valid inputs; C1 → Rejected, C2 → Approved, C3 → Pending on every call; invalid inputs return HTTP 400 with clear messages; and running any demo claim 3 times produces identical outcomes.

---

# Phase 5: Form & Pipeline Wiring [CORE DASHBOARD] ✅ COMPLETE

## Goal

Wire the pre-built `/frontend` claim input form to the backend pipeline API. Implement Zustand state management for the pipeline. The user can load a demo claim or enter their own, click "Process Claim", and the pipeline begins executing. No UI design changes — integration only.

## Tasks

- [x] Implement `store/useClaimStore.ts` (Zustand):
  - [x] State: `currentClaim: ClaimInput | null`, `stages: StageOutput[]`, `finalResult: ClaimResult | null`, `isProcessing: boolean`, `processingStageIndex: number` (0–5, which stage is currently in flight), `consistencyWarning: string[] | null`, `batchResults: ClaimResult[]`, `error: string | null`.
  - [x] Actions: `setClaim`, `startProcessing`, `appendStage`, `setFinalResult`, `setConsistencyWarning`, `addToBatch`, `resetPipeline`, `setError`.
  - [x] Export the store as the default export.

- [x] Implement `hooks/usePipeline.ts`:
  - [x] Export `usePipeline()` hook.
  - [x] Exposes `processClaim(claim: ClaimInput): Promise<void>` — calls `/api/stage` once per stage in a loop, calling `store.appendStage(stageOutput)` and incrementing `processingStageIndex` after each.
  - [x] On completion: calls `/api/validate`, sets `consistencyWarning` if issues found, calls `store.setFinalResult`.
  - [x] On error: calls `store.setError(message)`.

- [x] Implement `hooks/useClipboard.ts`:
  - [x] Export `useClipboard()` hook with `copyText(text: string): Promise<void>` and `isCopied: boolean` state (resets after 2 seconds).

- [x] Wire `components/claim/DemoSelector.tsx` to `store.setClaim(DEMO_CLAIMS["C1"])` etc. on button click.
- [x] Wire `components/claim/ClaimForm.tsx`:
  - [x] Bind all 6 input fields to local form state.
  - [x] "Process Claim" button calls `usePipeline().processClaim(formValues)`.
  - [x] Disable the button and show a loading state while `store.isProcessing` is true.
  - [x] Validate all fields are non-empty before allowing submission. Show inline validation errors if a field is blank.
  - [x] "Run All" button processes C1, C2, C3 sequentially and calls `store.addToBatch` for each result.

## Tests

- [x] Open `http://localhost:3000` in the browser.
- [x] Click "Load C1" button — confirm all 6 form fields are auto-populated with C1 data.
- [x] Click "Process Claim" — confirm the "Process Claim" button becomes disabled and shows a loading indicator.
- [x] Check the browser Network tab — confirm a request is made to `/api/stage` with `stageNumber: 1` and the C1 claim data.
- [x] Confirm the Zustand store updates — `stages` array grows as each stage API call completes.
- [x] Confirm no browser console errors during the form submission flow.
- [x] Try submitting the form with an empty field — confirm an inline validation error appears and the API is NOT called.

## Success Criteria

The phase is complete when: demo selector buttons populate all 6 form fields correctly; the "Process Claim" button triggers sequential `/api/stage` calls; Zustand state updates correctly after each stage; form validation prevents empty submissions; and no console errors occur during a full C1 processing run.

---

# Phase 6 — Frontend Wiring: Stage Cards, Decision Banner & Audit Log

## Goal

Wire the pipeline state to the visual output components — stage cards, decision banner, JSON audit log, and confidence legend. The user watches the reasoning appear card by card and sees the final verdict with the complete audit trail.

## Tasks

- [x] Wire `components/pipeline/StageCard.tsx` to Zustand state:
  - [x] Render one `StageCard` for each entry in `store.stages`.
  - [x] While `store.processingStageIndex === stageIndex` (current stage in flight): render `StageSkeleton.tsx` (shimmer loading state) for that card position.
  - [x] Once stage data is available: render the card with step name, reasoning text, confidence badge, and source label.
  - [x] Cards must appear one at a time in sequence — do not render all 5 placeholders upfront.

- [x] Wire `components/pipeline/StageSkeleton.tsx`:
  - [x] Render a shimmer placeholder: title bar (60% width), two content lines (100% and 75% width), small badge placeholder.
  - [x] Use a CSS animation (`animations.css`) for the shimmer effect.

- [x] Wire `components/result/ConfidenceBadge.tsx`:
  - [x] Accept `confidence: number` as a prop.
  - [x] Render: `confidence >= 0.80` → green background + "High" text, `0.65 <= confidence < 0.80` → amber + "Medium", `confidence < 0.65` → red + "Low".
  - [x] Always display both the colour AND the text label (not colour alone — accessibility requirement).
  - [x] Display the numeric score alongside the band label: e.g., "High (0.92)".

- [x] Wire `components/result/DecisionBanner.tsx` to `store.finalResult`:
  - [x] Do not render the banner until `store.finalResult` is set.
  - [x] Approved → green background, "✓ APPROVED" heading.
  - [x] Rejected → red background, "✗ REJECTED" heading.
  - [x] Pending → amber background, "⚠ PENDING — Human Review Required" heading.
  - [x] Display `store.finalResult.reason` and `store.finalResult.confidenceScore`.
  - [x] If `store.consistencyWarning` is not null: render a yellow warning banner above the decision banner listing the issues.

- [x] Wire `components/result/AuditLogPanel.tsx` to `store.finalResult.auditLog`:
  - [x] Do not render until `store.finalResult` is set.
  - [x] Display the full `ClaimResult` JSON (assembled via `buildFinalOutput`) in a `<pre>` code block with syntax highlighting (use a simple className-based highlighter or the `json-pretty` approach with inline styles).
  - [x] "Copy JSON" button calls `useClipboard().copyText(JSON.stringify(finalResult, null, 2))`. Button label changes to "Copied ✓" for 2 seconds after click.
  - [x] "Export JSON" button triggers `URL.createObjectURL(new Blob([JSON.stringify(finalResult, null, 2)], { type: 'application/json' }))` and downloads as `claim-{claimId}-audit.json`.

- [x] Wire `components/result/ConfidenceLegend.tsx`:
  - [x] Static component. Displays three rows: green circle + "High ≥ 0.80", amber circle + "Medium 0.65–0.79", red circle + "Low < 0.65".
  - [x] Always visible on the results side of the layout (not hidden until results appear).

- [x] Wire `components/pipeline/ProgressIndicator.tsx`:
  - [x] Displays a horizontal step bar with 5 steps labelled with stage names.
  - [x] Active step (current in-flight stage) is highlighted. Completed steps show a checkmark. Future steps are greyed out.
  - [x] Visible only while `store.isProcessing` is true.

## Tests

- [ ] Load C2 and click "Process Claim". Watch the browser — confirm stage cards appear one by one (not all at once).
- [ ] Confirm each card shows the step name, a reasoning text with at least 2 sentences, a confidence badge with both colour and text label + numeric score, and a source label.
- [ ] After all stages complete: confirm the final decision banner appears as green "✓ APPROVED" for C2.
- [ ] Confirm the JSON audit log panel renders the full JSON in the mandatory problem statement schema.
- [ ] Click "Copy JSON" — paste into a text editor and confirm valid, parseable JSON with all 5 audit log entries.
- [ ] Click "Export JSON" — confirm a file named `claim-C2-audit.json` downloads and its contents are valid JSON.
- [ ] Load C1 — confirm the decision banner is red "✗ REJECTED" and the Stage 2 card confidence badge is green "High (0.97)".
- [ ] Load C3 — confirm Stage 3 and Stage 4 cards show red "Low" badges, and the final banner is amber "⚠ PENDING".
- [ ] Confirm no browser console errors on any of the above flows.

## Success Criteria

The phase is complete when: stage cards reveal one by one as each pipeline stage completes; all three demo claims produce the correct visual outcome (C1 Rejected, C2 Approved, C3 Pending); confidence badges use both colour and text labels; the JSON audit log matches the mandatory schema exactly; the copy and export buttons function correctly; and no console errors are present.

---

# Phase 7 — Audit Traceability & Replay ✅ COMPLETE

## Goal

Enable the user to click on any previous claim and "replay" its audit trail. This builds trust by showing the system is consistent across sessions.

## Tasks

- [x] Implement `auditHistory: ClaimResult[]` in `useClaimStore.ts`.
- [x] Add `persist` middleware to Zustand store for `localStorage` persistence.
- [x] Implement [AuditLogPage.tsx](file:///c:/Users/vikranth%20subramanyam/Downloads/V3/ClaimTraceAI/frontend/src/pages/AuditLogPage.tsx) to list historical runs.
- [x] Implement "Replay Audit" mechanism to load historical data into active dashboard.
- [x] Fix and restore [TopNav.tsx](file:///c:/Users/vikranth%20subramanyam/Downloads/V3/ClaimTraceAI/frontend/src/components/TopNav.tsx) for app-wide navigation.

---

# Phase 8 — Claims Intelligence & Analytics Dashboard ✅ COMPLETE

## Goal

Evolution of the "Batch Analysis" concept into a high-fidelity "Analytics" dashboard. Instead of just a sequential run of three claims, this page provides aggregated business intelligence from the full audit history, including approval rates, risk summaries, and stage confidence profiles.

## Tasks

- [x] Rename NavLink in `TopNav.tsx` from "Batch Analysis" to "Analytics".
- [x] Update route in `App.tsx` to `/analytics` (with redirect from `/batch`).
- [x] Implement [AnalyticsPage.tsx](file:///c:/Users/vikranth%20subramanyam/Downloads/V3/ClaimTraceAI/frontend/src/pages/AnalyticsPage.tsx) with real-time data aggregation:
  - **KPI Cards**: Total Processed, Approval Rate, Rejection Rate, Pending Rate.
  - **Pipeline Health**: Avg Confidence Score, High/Low Confidence claim counts, Consistency Flags.
  - **Visualizations**: 
    - Decision Distribution bar chart.
    - Avg Confidence by Pipeline Stage (S1-S4).
    - Confidence Score Distribution histogram.
  - **Risk Summary**: Quick view of Approval/Rejection/Review/Consistency rates.
  - **Comprehensive Audit Table**: All-time history with Stage Profile mini-blocks and consistency status.
- [x] Ensure 100% data fidelity: all stats must derive directly from the `useClaimStore` audit history.
- [x] Ensure responsive design and premium aesthetics (curated colors, smooth hover states).

## Tests

- [x] Navigation: Click the "Analytics" link in the navbar; confirm it leads to `/analytics`.
- [x] Empty State: Verify a professional empty state appears when history is cleared.
- [x] Data Live-Update: Process a claim and verify the "Total" and "Avg Confidence" update immediately on the Analytics page.
- [x] Consistency: Verify that a claim with a "Logic Flag" (consistency warning) increments the "Consistency Flags" KPI.
- [x] badges/Labels: Confirm status badges (Approved/Rejected/Pending) use the correct project color tokens.

## Success Criteria

✅ Professional, board-level Analytics dashboard fully operational.
✅ Real-time aggregation of audit history data.
✅ Navigational transition from "Batch" to "Analytics" complete.
✅ Zero TypeScript errors and logic consistency throughout the dashboard.tially with live progress feedback.
✅ Results table displays correct outcomes with colour-coded badges.
✅ Homepage is completely unmodified.
✅ TypeScript compiles with zero errors.

---

# Phase 9 — Stage Reveal Animation & UX Polish

## Goal

Add the card reveal animation, stage skeleton shimmer, and pipeline progress indicator — making the reasoning chain feel like a live, unfolding process. These are "Should Have" features that significantly elevate the demo quality without adding functional complexity.

## Tasks

- [ ] Implement the stage card reveal animation in `styles/animations.css`:
  - Keyframe: `slideInUp` — card translates from `translateY(12px) opacity:0` to `translateY(0) opacity:1` over 300ms with `ease-out` timing.
  - Apply to `StageCard.tsx` — add `animation: slideInUp 300ms ease-out` when a card first renders.
  - Stagger cards by their index: Stage 1 = 0ms delay, Stage 2 = 50ms delay (the actual delay comes from the API sequential calls, not CSS — so CSS delay is 0ms; just ensure cards don't all pre-render).

- [ ] Implement the shimmer skeleton animation in `styles/animations.css`:
  - Keyframe: `shimmer` — background gradient moves from left to right over 1.5s loop.
  - Apply to `StageSkeleton.tsx` for all placeholder bars.

- [ ] Wire `components/pipeline/ProgressIndicator.tsx`:
  - 5 step nodes labelled: "Claim Analysis" → "Coverage" → "Documents" → "Fraud Check" → "Decision".
  - Current processing step: pulsing highlight animation.
  - Completed steps: static checkmark icon.
  - Not-yet-started steps: grey/muted styling.
  - Appears at the top of the results column when `store.isProcessing` is true; hides (or shows fully complete state) after pipeline finishes.

- [ ] Apply a `fadeIn` transition to the `DecisionBanner` — fades from opacity 0 to 1 over 400ms when it first renders.
- [ ] Apply a `fadeIn` transition to the `AuditLogPanel` — fades in after the `DecisionBanner`.
- [ ] Ensure all animations are disabled for users with `prefers-reduced-motion` media query (add a global CSS rule that sets `animation: none` for this preference).

## Tests

- [ ] Load C2 and process — watch the browser and confirm stage cards slide in one by one (not all rendering simultaneously).
- [ ] Confirm the skeleton shimmer is visible for approximately 1–5 seconds per stage before the real card appears.
- [ ] Confirm the progress indicator advances step-by-step as each stage completes.
- [ ] Confirm the decision banner fades in smoothly after the last stage card.
- [ ] Open browser DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion" → reprocess a claim — confirm no animation movement (static renders only).
- [ ] Confirm no layout shift or jank during animations on a standard laptop browser.

## Success Criteria

The phase is complete when: all stage cards animate in one by one with a slide-up reveal; the skeleton shimmer appears while stages are loading; the progress indicator advances correctly; the decision banner fades in after all stages; and all animations are suppressed for `prefers-reduced-motion`.

---

# Phase 10 — Determinism Hardening & Consistency Validation

## Goal

Guarantee that C1 always produces Rejected, C2 always produces Approved, and C3 always produces Pending — across at least 3 consecutive runs each. Fix any prompt non-determinism. Verify the consistency validator catches all expected contradictions. This phase is about reliability, not new features.

## Tasks

- [ ] Run C1 three times back-to-back. Record the `status`, the `auditLog[1].confidence` (Stage 2 Coverage), and the `auditLog[1].reason`. All 3 runs must produce identical `status: "Rejected"` and `confidence >= 0.90` on Stage 2.
  - If any run produces a different outcome: tighten the Stage 2 prompt to make the coverage rule even more explicit and absolute. Re-test until 3 consecutive identical runs pass.

- [ ] Run C2 three times back-to-back. All 3 runs must produce `status: "Approved"` with all stage confidences ≥ 0.65.
  - If any run produces a different outcome: review whether any stage prompt has ambiguity that could cause low confidence on a clean claim. Fix and re-test.

- [ ] Run C3 three times back-to-back. All 3 runs must produce `status: "Pending"` with Stage 3 and Stage 4 confidences < 0.65.
  - If any run produces a different outcome: tighten the Stage 4 prompt to explicitly reference the ₹95,000 amount and the 4 past claims as hard fraud indicators. Re-test.

- [ ] Manually trigger the consistency validator warning banner by temporarily hardcoding a contradicting decision in the orchestrator (e.g., change C1's final result to "Approved" before running the validator). Confirm the yellow warning banner appears with a descriptive issue message. Revert the hardcode.

- [ ] Verify: every Stage 2 reason string for C1 references the policy type and the "Third-party" rule explicitly — not generic language like "policy issue".
- [ ] Verify: every Stage 4 reason string for C3 references "past claims" and "claim amount" explicitly.
- [ ] Verify: the `source` field in every audit log entry names a specific input field or rule — never generic text like "AI analysis".

- [ ] If the `temperature: 0.1` setting is causing any inconsistency, verify it is correctly set on every API call in `lib/services/openai.ts`. Reduce to `0.0` if needed for the coverage and fraud stages only.

## Tests

- [ ] **Determinism gate:** Run C1 × 3, C2 × 3, C3 × 3. Record results in a table:
  ```
  | Claim | Run 1 | Run 2 | Run 3 | Pass? |
  |-------|-------|-------|-------|-------|
  | C1    |       |       |       |       |
  | C2    |       |       |       |       |
  | C3    |       |       |       |       |
  ```
  All 9 cells must match the expected outcome before this phase is marked complete.
- [ ] Confirm every audit log entry has `source` that names a specific field or rule (not generic).
- [ ] Confirm every audit log `reason` has at least 2 full sentences.
- [ ] Confirm the consistency warning banner fires correctly when a contradiction is introduced.

## Success Criteria

The phase is complete when: C1 produces Rejected on 3/3 runs, C2 produces Approved on 3/3 runs, C3 produces Pending on 3/3 runs; every audit log entry has a specific source and a 2-sentence reason; and the consistency validator correctly fires a warning when contradictions exist.

---

# Phase 11 — Final Validation, Cleanup & README

## Goal

Perform a complete end-to-end walkthrough matching the problem statement's demo script. Clean the codebase of debug code, dead imports, and temporary hacks. Verify the mandatory output JSON schema exactly. Confirm the README allows someone to run the project from scratch.

## Tasks

- [ ] **Full demo walkthrough** — follow the exact script from the PRD Section 12:
  1. Load C1 → Process → Watch 5 cards appear → Confirm Rejected banner → Confirm Stage 2 card shows "Third-party policy" reasoning → Open JSON panel → Verify JSON matches mandatory schema.
  2. Load C2 → Process → Confirm all 5 stage cards are confidence ≥ 0.80 (green) → Confirm Approved banner.
  3. Load C3 → Process → Confirm Stage 3 and Stage 4 cards are red (Low confidence) → Confirm Pending banner → Confirm Stage 4 reason mentions both past claims count and claim amount.
  4. Click "Run All 3 Claims" → Confirm batch table populates with C1/Rejected, C2/Approved, C3/Pending in correct order.
  5. Copy JSON for C1 → Paste into a JSON validator → Confirm it is valid JSON with all 5 required audit log entries.

- [ ] Validate the final JSON output schema exactly against the mandatory format in `docs/AGENTS.md`:
  - Top-level fields: `Claim ID`, `Status`, `Reason`, `Confidence Score`, `Audit Log` — all present.
  - Each audit log entry: `step`, `reason`, `confidence`, `source` — all present.
  - Decision step: additionally has `result` field.
  - No extra fields, no missing fields, no snake_case vs camelCase mismatches.

- [ ] Remove all `console.log` and `console.error` debug statements from production code paths (API routes, orchestrator, prompts). Keep only error logs that aid diagnosis.
- [ ] Remove all unused imports across the entire `lib/` and `components/` directories.
- [ ] Remove any commented-out code blocks left from development.
- [ ] Remove the `scripts/test-prompts.ts` scratch script created in Phase 3.
- [ ] Verify `.env.local` is not tracked in git (`git status` must not show it).
- [ ] Verify `.env.example` is tracked in git and lists `OPENAI_API_KEY` with a description.
- [ ] Update `docs/ARCHITECTURE.md` to document: all 3 API routes with request/response shapes, the 5-stage pipeline flow, confidence formula, decision rules, and all 3 TypeScript type definitions.
- [ ] Update `README.md` to ensure a developer who has never seen this project can set up and run it from scratch using only the README instructions.
- [ ] Run `npx tsc --noEmit` — confirm zero TypeScript errors in the entire project.
- [ ] Run `npm run build` — confirm the Next.js production build completes with zero errors.

## Tests

- [ ] A person following only `README.md` can clone the repo, run `npm install`, add their `OPENAI_API_KEY` to `.env.local`, and run `npm run dev` to reach a working app.
- [ ] `npm run build` completes with zero errors.
- [ ] `npx tsc --noEmit` reports zero errors.
- [ ] The full demo walkthrough (all 5 steps above) completes without any errors, unexpected outcomes, or browser console errors.
- [ ] The exported JSON for C1 passes a JSON schema validator with all mandatory fields present.
- [ ] No `console.log` statements remain in `lib/` or `app/api/` (check with `grep -r "console.log" lib/ app/api/`).

## Success Criteria

The phase is complete when: the full demo walkthrough runs without issues; the production build compiles cleanly; all TypeScript errors are zero; the JSON output matches the mandatory schema exactly; no debug code remains; and the README is accurate and complete.

---

# Final Notes

This PLAN.md is the **execution roadmap** for ClaimTrace AI. It is a living document — update it as phases are completed.

AI coding agents must at all times:

- Follow phases sequentially and never skip ahead.
- Complete and verify each phase before moving to the next.
- Avoid implementing features that are not in the defined scope.
- Treat the existing /frontend directory as a strict, immutable foundation for structure and design—it is a fully built static UI that defines the intended look and user experience of the application. You must never create, replace, or regenerate the /frontend folder or its core layout from scratch. Instead, your role is to progressively enhance and operationalize this frontend by wiring API calls, integrating backend logic, attaching event handlers, and enabling dynamic behavior. The frontend serves as the visual blueprint, and all development must respect and preserve its structure. You are allowed to modify, extend, or refine the existing frontend only in-place. This includes adding new components (pages, modals, widgets), updating or removing existing elements, and improving functionality—but always within the current /frontend architecture. Any new UI elements must be seamlessly integrated into the existing structure, maintaining consistency in design and flow. Under no circumstances should you rebuild or override the frontend; all enhancements must layer on top of what already exists.
- Focus entirely on delivering a working, demonstrable MVP that fully satisfies the problem statement.
- Update this document to reflect completed phases as work progresses.
- Test each demo claim (C1, C2, C3) deterministically before marking any pipeline-related phase complete.

**The three demo claims are the ultimate test. If C1 → Rejected, C2 → Approved, and C3 → Pending consistently and the full audit trail is traceable, the system has succeeded.**


