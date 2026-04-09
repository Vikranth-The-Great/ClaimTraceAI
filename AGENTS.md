# ClaimTrace AI

> An explainable, audit-ready AI decision system that processes insurance claims through 5 sequential reasoning stages — producing a full, structured audit trail with confidence scores and source citations for every step, so every decision can be understood, verified, and challenged.

---

# Project Goal

## What Problem Does This Project Solve?

Standard insurance claim systems produce a verdict — Approved or Rejected — but discard all reasoning that led there. When a customer, regulator, or auditor asks "why was this claim rejected?", the system has nothing to show. The decision is a black box.

This problem statement requires building a system that not only decides, but also shows every step it took to reach that decision: what it checked, why it concluded what it did, how confident it was, and which specific input or rule drove that conclusion. Every decision must be **transparent, explainable, and traceable**.

## Who Are the Users?

**Primary:** Claims assessors and insurance operations teams who need to process claims quickly while maintaining a defensible, auditable record of every decision.

**Hackathon context:** Judges and evaluators who need to verify that the AI system's decisions are traceable, consistent, and explainable — not just correct.

## What Should the Final System Achieve?

A judge or assessor can load any claim, watch the 5-stage reasoning unfold in real time, understand precisely why the decision was reached, verify that the final verdict is consistent with each intermediate stage output, and copy or export the complete structured audit log — all within a single browser tab, with no backend or database required.

---

# Core Features

**1. 6-Field Claim Input Form** — Accepts Claim ID, Accident Description (textarea), Policy Type (Comprehensive / Third-Party dropdown), Claim Amount (INR number), Past Claims Count (number), and Document Status (Complete / Incomplete / Missing dropdown). All fields are required before processing begins.

**2. Three Pre-Loaded Demo Claims** — C1 (Third-Party policy + own damage → Rejected), C2 (Comprehensive + clean signals → Approved), C3 (Comprehensive + high amount for minor damage + 4 past claims + missing docs → Pending). One-click auto-fill buttons for each.

**3. Sequential 5-Stage AI Pipeline via OpenAI API** — Each stage fires a separate API call to `gpt-4o` in strict sequence. Prior stage outputs are passed as context to each subsequent stage. Each stage renders its card as it completes — the user watches the reasoning appear progressively.

**4. Per-Stage Audit Cards** — One visual card per stage: step name, full reasoning text (minimum 2 sentences), colour-coded confidence badge (green ≥ 0.80, amber 0.65–0.79, red < 0.65), source label. Cards reveal one by one with a subtle animation.

**5. Final Decision Banner** — Colour-coded: green = Approved, red = Rejected, amber = Pending. Displays weighted overall confidence (Stage 1 × 10% + Stage 2 × 40% + Stage 3 × 20% + Stage 4 × 30%) and the primary reason sentence.

**6. Full JSON Audit Log Panel** — Exact schema from the problem statement. Displayed below the visual cards in a formatted, copyable code block. Assembled after all stages complete.

**7. Consistency Validator** — Client-side check confirming the final decision does not contradict stage outputs. If a contradiction is detected, a yellow warning banner appears — the output is still shown, never suppressed.

**8. Batch Results Table** — After running all 3 demo claims (individually or via "Run All"), a summary table shows: Claim ID | Status badge | Overall Confidence | Key Reason.

**9. Per-Stage Loading Skeleton** — While a stage is processing, its card shows a shimmer/skeleton so the user knows the pipeline is live and working.

**10. Confidence Score Legend** — Static legend showing the three confidence bands (High / Medium / Low) with colour mappings — helps judges understand the scoring system at a glance.

**11. Copy to Clipboard + Export JSON** — One-click copy of the JSON audit log and optional download as `.json` file.

**12. "Run All 3 Claims" Batch Button** — Processes C1, C2, C3 sequentially and populates the batch table automatically.

---

# MVP Constraints

- No backend server. No database. No authentication. No deployment infrastructure.
- Single-page application (Next.js) running entirely in the browser.
- OpenAI API is the only external dependency. All 5 pipeline stages use `gpt-4o`.
- The `/frontend` folder is a pre-built Stitch export — Treat the existing /frontend directory as a strict, immutable foundation for structure and design—it is a fully built static UI that defines the intended look and user experience of the application. You must never create, replace, or regenerate the /frontend folder or its core layout from scratch. Instead, your role is to progressively enhance and operationalize this frontend by wiring API calls, integrating backend logic, attaching event handlers, and enabling dynamic behavior. The frontend serves as the visual blueprint, and all development must respect and preserve its structure.

You are allowed to modify, extend, or refine the existing frontend only in-place. This includes adding new components (pages, modals, widgets), updating or removing existing elements, and improving functionality—but always within the current /frontend architecture. Any new UI elements must be seamlessly integrated into the existing structure, maintaining consistency in design and flow. Under no circumstances should you rebuild or override the frontend; all enhancements must layer on top of what already exists.
- No multi-user support. No persistent claim storage beyond the current browser session.
- No OAuth, no email verification, no subscription logic.

---

# Technical Stack

## Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (`useClaimStore`)
- **HTTP Client:** Native `fetch()` API

> ⚠ CRITICAL: Treat the existing /frontend directory as a strict, immutable foundation for structure and design—it is a fully built static UI that defines the intended look and user experience of the application. You must never create, replace, or regenerate the /frontend folder or its core layout from scratch. Instead, your role is to progressively enhance and operationalize this frontend by wiring API calls, integrating backend logic, attaching event handlers, and enabling dynamic behavior. The frontend serves as the visual blueprint, and all development must respect and preserve its structure.

You are allowed to modify, extend, or refine the existing frontend only in-place. This includes adding new components (pages, modals, widgets), updating or removing existing elements, and improving functionality—but always within the current /frontend architecture. Any new UI elements must be seamlessly integrated into the existing structure, maintaining consistency in design and flow. Under no circumstances should you rebuild or override the frontend; all enhancements must layer on top of what already exists.

## Backend (Minimal — Next.js API Routes)

- **Framework:** Next.js App Router API routes (`/app/api/`)
- **Language:** TypeScript
- **Purpose:** Server-side OpenAI API calls (avoids CORS issues and keeps the API key off the client)
- **Routes:** `/api/process-claim/route.ts`, `/api/stage/route.ts`, `/api/validate/route.ts`

## AI Integration

- **Provider:** OpenAI
- **Model:** `gpt-4o`
- **Method:** REST API via `openai` npm SDK
- **Temperature:** `0.1` — low temperature is mandatory for deterministic demo outcomes
- **Response format:** `{ type: "json_object" }` — forces structured JSON output
- **Max tokens:** `500` per stage call

## Infrastructure & Environment

- **Containerization:** None required
- **Environment Config:** `.env.local` with `OPENAI_API_KEY`
- **Package Manager:** npm + `package.json`
- **Build Tool:** Next.js default (Turbopack / Webpack)

---

# Project Directory Structure

```
claimtrace-ai/
├── frontend/                    ← Pre-built Stitch export. DO NOT modify structure.
│   ├── app/
│   │   ├── layout.tsx           ← Root layout (topbar, global styles)
│   │   ├── page.tsx             ← Main dashboard page
│   │   ├── replay/[id]/page.tsx ← Claim audit replay page (if applicable)
│   │   ├── insights/page.tsx    ← Batch insights page
│   │   └── api/                 ← Next.js serverless API routes
│   │       ├── process-claim/route.ts  ← Full 5-stage pipeline endpoint
│   │       ├── stage/route.ts          ← Single-stage execution endpoint
│   │       └── validate/route.ts       ← Consistency validator endpoint
│   ├── components/
│   │   ├── claim/
│   │   │   ├── ClaimForm.tsx    ← 6-field form + demo selectors
│   │   │   ├── DemoSelector.tsx ← C1/C2/C3 pill buttons
│   │   │   └── InputField.tsx   ← Reusable input with label + validation
│   │   ├── pipeline/
│   │   │   ├── Timeline.tsx           ← Animated stage flow container
│   │   │   ├── StageCard.tsx          ← Individual stage audit card
│   │   │   ├── StageSkeleton.tsx      ← Loading shimmer UI
│   │   │   └── ProgressIndicator.tsx  ← Pipeline progress animation
│   │   ├── result/
│   │   │   ├── DecisionBanner.tsx     ← Final verdict display (Approved/Rejected/Pending)
│   │   │   ├── ConfidenceBadge.tsx    ← Colour-coded confidence pill
│   │   │   ├── AuditLogPanel.tsx      ← JSON viewer + copy/export
│   │   │   └── ConfidenceLegend.tsx   ← High/Medium/Low colour legend
│   │   ├── table/
│   │   │   └── BatchTable.tsx         ← Multi-claim batch results table
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Tabs.tsx
│   ├── lib/
│   │   ├── pipeline/
│   │   │   ├── orchestrator.ts  ← Runs the 5-stage pipeline sequentially
│   │   │   ├── stages.ts        ← Stage definitions (1–5)
│   │   │   ├── prompts.ts       ← All AI prompt templates (one per stage)
│   │   │   └── rules.ts         ← Decision rules (coverage, fraud thresholds)
│   │   ├── services/
│   │   │   ├── openai.ts        ← OpenAI API wrapper (model, temp, format)
│   │   │   └── parser.ts        ← JSON parsing + markdown fence stripping
│   │   ├── validators/
│   │   │   └── consistency.ts   ← Final decision consistency checker
│   │   ├── utils/
│   │   │   ├── confidence.ts    ← Weighted confidence calculator
│   │   │   ├── format.ts        ← Data formatting helpers
│   │   │   └── constants.ts     ← Thresholds, enums, stage names
│   │   └── types/
│   │       ├── claim.ts         ← Claim input type definitions
│   │       ├── stage.ts         ← Stage output schema types
│   │       └── result.ts        ← Final output JSON schema types
│   ├── data/
│   │   └── demoClaims.ts        ← C1, C2, C3 predefined claim objects
│   ├── store/
│   │   └── useClaimStore.ts     ← Zustand store (pipeline state, batch results)
│   ├── hooks/
│   │   ├── usePipeline.ts       ← Runs pipeline + manages stage states
│   │   └── useClipboard.ts      ← Copy JSON to clipboard logic
│   ├── styles/
│   │   ├── animations.css       ← Keyframes (timeline reveal, shimmer)
│   │   └── tokens.css           ← Design tokens (colours, spacing)
│   └── public/
│       └── icons/               ← SVG icons
├── docs/
│   ├── PLAN.md                  ← Master build plan
│   ├── AGENTS.md                ← This file
│   └── ARCHITECTURE.md          ← System design and API reference
├── .env.local                   ← OPENAI_API_KEY (never committed)
├── .env.example                 ← Template listing all required env vars
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

# The Five Processing Stages — Business Logic Reference

Every claim passes through all 5 stages in strict order. No stage is skipped. Each stage produces exactly one JSON entry for the audit log.

| # | Stage Name | What It Checks | Confidence Range |
|---|---|---|---|
| 1 | **Claim Analysis** | Plausibility and internal consistency of the accident description | 0.80–0.95 |
| 2 | **Coverage Validation** | Hard rule: Comprehensive covers own damage; Third-Party does NOT | 0.90–0.99 |
| 3 | **Document Validation** | Document completeness vs claim size; cross-field consistency | 0.70–0.90 |
| 4 | **Fraud / Consistency Check** | Past claims > 3, amount-to-damage ratio, input contradictions | 0.55–0.95 |
| 5 | **Decision Generation** | Aggregates all 4 prior stages into Approved / Rejected / Pending | Weighted avg |

**Decision Rules (Encoded in System Prompts):**
- If Coverage Validation (Stage 2) fails → **Rejected** regardless of other stages
- If Fraud Check (Stage 4) produces a hard flag → **Rejected**
- If any stage confidence < 0.65 → **Pending** (route to human review)
- If all stages pass with confidence ≥ 0.65 → **Approved**

**Weighted Confidence Formula:**
```
overall_confidence = (s1 × 0.10) + (s2 × 0.40) + (s3 × 0.20) + (s4 × 0.30)
```

**Mandatory JSON Audit Log Schema (per problem statement):**
```json
{
  "Claim ID": "C1",
  "Status": "Rejected",
  "Reason": "Third-party policy does not cover own vehicle damage",
  "Confidence Score": 0.92,
  "Audit Log": [
    { "step": "claim_analysis", "reason": "...", "confidence": 0.85, "source": "Description input" },
    { "step": "coverage_check", "reason": "...", "confidence": 0.97, "source": "Policy Type rule" },
    { "step": "document_check", "reason": "...", "confidence": 0.90, "source": "Document Status input" },
    { "step": "fraud_check", "reason": "...", "confidence": 0.88, "source": "Past Claims count + Claim Amount" },
    { "step": "decision", "result": "Rejected", "confidence": 0.92, "source": "Coverage result" }
  ]
}
```

---

# Three Demo Claims — Reference Data

**C1 — Expected: Rejected**
- Description: "Hit a tree while reversing out of the driveway"
- Policy: Third-Party | Amount: ₹15,000 | Past Claims: 0 | Documents: Complete
- Why: Stage 2 fires at 0.97 — Third-party does not cover own damage

**C2 — Expected: Approved**
- Description: "Rear-ended by another vehicle on the highway. Bumper and boot damaged."
- Policy: Comprehensive | Amount: ₹38,000 | Past Claims: 1 | Documents: Complete
- Why: All 5 stages pass. Clean signals throughout.

**C3 — Expected: Pending**
- Description: "Minor scratch on the side panel while parking"
- Policy: Comprehensive | Amount: ₹95,000 | Past Claims: 4 | Documents: Missing
- Why: Stage 3 flags missing docs + large amount. Stage 4 flags 4 past claims + disproportionate amount for minor damage. Both below 0.65 → Pending.

---

# Development Workflow

AI coding agents must follow this exact workflow on every session:

1. Read `docs/PLAN.md` in full before doing anything.
2. Identify the current active phase — the first incomplete phase.
3. Expand phase tasks into a detailed checklist before starting.
4. Implement only the tasks in the current phase. Do not work ahead.
5. Run all tests defined for that phase.
6. Confirm all success criteria are met.
7. Mark the phase `✅ COMPLETE` in `PLAN.md`.
8. Move to the next phase.

**Never skip phases. Never implement tasks from future phases during an earlier phase.**

---

# Frontend Integration Rules

These rules are absolute and non-negotiable:

- Treat the existing /frontend directory as a strict, immutable foundation for structure and design—it is a fully built static UI that defines the intended look and user experience of the application. You must never create, replace, or regenerate the /frontend folder or its core layout from scratch. Instead, your role is to progressively enhance and operationalize this frontend by wiring API calls, integrating backend logic, attaching event handlers, and enabling dynamic behavior. The frontend serves as the visual blueprint, and all development must respect and preserve its structure. You are allowed to modify, extend, or refine the existing frontend only in-place. This includes adding new components (pages, modals, widgets), updating or removing existing elements, and improving functionality—but always within the current /frontend architecture. Any new UI elements must be seamlessly integrated into the existing structure, maintaining consistency in design and flow. Under no circumstances should you rebuild or override the frontend; all enhancements must layer on top of what already exists.
- The agent does not scaffold a new frontend, run any `create-next-app` or similar init command, or replace existing frontend files.
- All agent frontend work is limited to: **wiring API calls**, **adding state management**, **connecting event handlers**, and **adding new components inside the existing structure** using the same file naming, import patterns, and Tailwind conventions already present.
- When implementing the pipeline, the agent edits existing component files to add `fetch()` calls, Zustand state updates, and stage rendering logic — never rebuilds what is already there.
- Any doubt about whether a change modifies existing frontend structure → **stop and ask the user first**.

---

# Prompt Engineering Rules (Critical for Consistent Demo Outcomes)

These rules govern every AI prompt template written in `lib/pipeline/prompts.ts`:

1. **Pass all 6 claim fields verbatim** in every stage prompt — never summarise them.
2. **Pass all prior stage outputs verbatim** — each subsequent stage needs full context to remain consistent.
3. **State rules explicitly as hard numbers** — never say "use your judgment". Say "Past Claims > 3 is a fraud flag" and "confidence < 0.65 triggers Pending".
4. **Coverage rule is absolute** in Stage 2 — the prompt must say "Do not deviate from this rule under any circumstances."
5. **Every prompt ends with:** `"Respond ONLY with valid JSON. No preamble. No markdown fences. Use exactly this schema: { step, reason, confidence, source }"`
6. **temperature: 0.1** is mandatory on every API call — ensures demo claims produce identical outcomes across multiple runs.
7. **C3 fraud prompt must explicitly state:** "A claim of ₹95,000 for a described minor scratch is disproportionate — flag this as a fraud indicator."
8. After implementing prompts, test each demo claim 3 times. Outcomes must be identical every time before the phase is marked complete.

---

# Coding Standards

## General Rules

- Keep code simple. If there are two ways to implement something, choose the simpler one.
- Avoid unnecessary abstraction. Do not create base classes, factories, or abstract layers unless they are genuinely reused in 3 or more places.
- Do not over-engineer. The goal is a working, demonstrable MVP — not a production-grade enterprise system.
- Use the latest stable versions of all libraries. Avoid deprecated packages.
- Write readable code. Variable names, function names, and file names must be self-explanatory.
- Never leave dead code, unused imports, or commented-out blocks in the codebase.

## TypeScript Rules

- Define types for all claim inputs, stage outputs, and final results in `lib/types/`.
- Use strict TypeScript (`"strict": true` in `tsconfig.json`).
- All async functions must have explicit return type annotations.

## API Route Rules

- Each API route handles one concern only (`process-claim`, `stage`, `validate`).
- Business logic (prompts, rules, parsing) lives in `lib/` — not inside route handlers.
- All environment variables are read via `process.env.OPENAI_API_KEY` — never hardcoded.
- Every API route returns a consistent JSON response structure.
- Every API route handles errors explicitly and returns the appropriate HTTP status code.

## Error Handling Rules

- Strip markdown code fences (` ```json ... ``` `) from all OpenAI responses before `JSON.parse()`.
- If `JSON.parse()` fails: retry the API call once automatically.
- If the second attempt also fails: render an error card for that stage — never crash the app silently.
- If the final decision contradicts stage outputs: display a yellow warning banner — still show all output.
- Never return a 200 response with an error message inside the body.

## Naming Conventions

- TypeScript/React: `camelCase` for variables and functions, `PascalCase` for components and interfaces, `kebab-case` for file names.
- API routes: lowercase, hyphenated, RESTful (e.g. `/api/process-claim`, `/api/validate`).
- Stage step name strings must exactly match: `claim_analysis`, `coverage_check`, `document_check`, `fraud_check`, `decision`.

---

# API Design Standards

- Base path: `/api/`
- HTTP methods: POST for all pipeline calls (claim data is sent in the request body)
- All request and response bodies use JSON
- Error responses return: `{ "error": true, "message": "Description", "code": "ERROR_CODE" }`
- The `OPENAI_API_KEY` is never sent to the client — all OpenAI calls happen server-side via API routes

**Key API Routes:**

| Route | Method | Purpose |
|---|---|---|
| `/api/process-claim` | POST | Accepts full claim object, runs all 5 stages sequentially, returns complete audit result |
| `/api/stage` | POST | Accepts claim + prior stage outputs + stage number, runs a single stage (used for streaming) |
| `/api/validate` | POST | Accepts final decision + audit log, runs consistency check, returns validation result |

---

# Testing Expectations

## What to Test

- **Unit tests:** Confidence aggregator formula, JSON parser (strips fences, handles malformed), consistency validator logic, decision rule functions.
- **Integration tests:** Each API route — valid claim in → correct JSON audit log out.
- **Manual demo verification:** Run each demo claim (C1, C2, C3) 3 times. The outcome (status, key reason, confidence band) must be identical on all 3 runs.

## Test File Structure

- Tests live in `__tests__/` or alongside source files as `*.test.ts`
- `lib/utils/confidence.ts` → `__tests__/confidence.test.ts`
- `lib/validators/consistency.ts` → `__tests__/consistency.test.ts`
- `app/api/process-claim/route.ts` → `__tests__/api/process-claim.test.ts`

## Minimum Coverage

- Confidence aggregator formula verified with known inputs and expected outputs.
- Consistency validator tested for: correct decision + correct stages (no warning), contradicting decision + stages (warning fires), Pending routing when confidence < 0.65.
- Parser tested for: valid JSON string (parses cleanly), JSON wrapped in code fences (strips and parses), completely invalid string (returns null / triggers retry).

---

# Documentation Rules

All planning documents are stored in:

```
docs/
```

| File | Purpose |
|---|---|
| `docs/PLAN.md` | Master development plan — phases, tasks, tests, success criteria |
| `docs/AGENTS.md` | This file — project context, standards, and agent rules |
| `docs/ARCHITECTURE.md` | API endpoint reference, data model types, prompt design notes |

The agent must update `docs/PLAN.md` to mark completed phases as work progresses.

---

# AI Agent Behavior Rules

These are non-negotiable behavioral rules for any AI coding agent on this project:

- **Read before acting.** Always read `PLAN.md` and `AGENTS.md` in full before writing any code.
- **Work phase-by-phase.** Never implement tasks from a future phase during an earlier phase.
- **Do not invent scope.** Only build what is defined in `PLAN.md` and `AGENTS.md`. If something is unclear, ask.
- Treat the existing /frontend directory as a strict, immutable foundation for structure and design—it is a fully built static UI that defines the intended look and user experience of the application. You must never create, replace, or regenerate the /frontend folder or its core layout from scratch. Instead, your role is to progressively enhance and operationalize this frontend by wiring API calls, integrating backend logic, attaching event handlers, and enabling dynamic behavior. The frontend serves as the visual blueprint, and all development must respect and preserve its structure. You are allowed to modify, extend, or refine the existing frontend only in-place. This includes adding new components (pages, modals, widgets), updating or removing existing elements, and improving functionality—but always within the current /frontend architecture. Any new UI elements must be seamlessly integrated into the existing structure, maintaining consistency in design and flow. Under no circumstances should you rebuild or override the frontend; all enhancements must layer on top of what already exists.
- **Confirm before major decisions.** If a task requires a significant architectural choice, stop and confirm with the user.
- **Implement one task at a time.** Verify it works. Then move to the next.
- **Focus on a working MVP.** Every decision should optimize for a system that works correctly — not one that is theoretically perfect.
- **The demo must be deterministic.** Test C1, C2, and C3 three times each. If outcomes vary, fix the prompt before proceeding.
