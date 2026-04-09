/**
 * E2E Pipeline Test — Phase 4 Verification
 * 
 * Tests:
 * 1. C1 (Third-Party) → Rejected
 * 2. C2 (Comprehensive clean) → Approved
 * 3. C3 (Fraud + missing docs) → Pending
 * 4. Invalid input (missing field) → validation error thrown
 * 5. C1 run 2 determinism → stage 2 confidence must match run 1
 * 6. Consistency validator — audit log matches final status
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const { DEMO_CLAIMS } = await import('../src/data/demoClaims');
const { processClaim } = await import('../src/api/process-claim/index');
const { validate }     = await import('../src/api/validate/index');
const { runStage }     = await import('../src/api/stage/index');

let passed = 0;
let failed = 0;

function pass(label: string) { console.log(`  ✅ PASS: ${label}`); passed++; }
function fail(label: string, detail?: string) { console.log(`  ❌ FAIL: ${label}${detail ? ' — ' + detail : ''}`); failed++; }

// ─── Test 1: C1 → Rejected ───────────────────────────────────────────────────

console.log('\n[TEST 1] C1 (Third-Party policy + own damage) → Rejected');
const r1 = await processClaim(DEMO_CLAIMS.C1);
console.log(`  Status: ${r1.Status} | Confidence: ${r1['Confidence Score']} | Stages: ${r1['Audit Log'].length}`);
r1.Status === 'Rejected'                ? pass('C1 status = Rejected')       : fail('C1 status', r1.Status);
r1['Audit Log'].length === 5            ? pass('C1 has 5 audit entries')      : fail('C1 audit log length', String(r1['Audit Log'].length));
r1['Confidence Score'] > 0             ? pass('C1 confidence score valid')   : fail('C1 confidence', String(r1['Confidence Score']));
r1['Audit Log'][1].confidence >= 0.90  ? pass('C1 stage2 confidence ≥ 0.90') : fail('C1 stage2 confidence', String(r1['Audit Log'][1].confidence));
r1.isConsistent                        ? pass('C1 consistency valid')        : fail('C1 consistency', r1.consistencyIssues?.join(', '));

// ─── Test 2: C2 → Approved ───────────────────────────────────────────────────

console.log('\n[TEST 2] C2 (Comprehensive + clean signals) → Approved');
const r2 = await processClaim(DEMO_CLAIMS.C2);
console.log(`  Status: ${r2.Status} | Confidence: ${r2['Confidence Score']} | Stages: ${r2['Audit Log'].length}`);
r2.Status === 'Approved'   ? pass('C2 status = Approved')      : fail('C2 status', r2.Status);
r2['Audit Log'].length === 5 ? pass('C2 has 5 audit entries') : fail('C2 audit log length', String(r2['Audit Log'].length));
r2.isConsistent            ? pass('C2 consistency valid')      : fail('C2 consistency', r2.consistencyIssues?.join(', '));

// ─── Test 3: C3 → Pending ────────────────────────────────────────────────────

console.log('\n[TEST 3] C3 (Fraud risk + missing docs) → Pending');
const r3 = await processClaim(DEMO_CLAIMS.C3);
console.log(`  Status: ${r3.Status} | Confidence: ${r3['Confidence Score']} | Stages: ${r3['Audit Log'].length}`);
r3.Status === 'Pending'    ? pass('C3 status = Pending')       : fail('C3 status', r3.Status);
r3['Audit Log'].length === 5 ? pass('C3 has 5 audit entries') : fail('C3 audit log length', String(r3['Audit Log'].length));
r3['Audit Log'][3].confidence < 0.65 ? pass('C3 stage4 confidence < 0.65') : fail('C3 stage4 confidence', String(r3['Audit Log'][3].confidence));

// ─── Test 4: Invalid input → validation error ────────────────────────────────

console.log('\n[TEST 4] Invalid input (missing policyType) → validation error');
try {
  await processClaim({ claimId: 'X1', accidentDescription: 'Test', claimAmount: 10000, pastClaimsCount: 0, documentStatus: 'Complete' });
  fail('Should have thrown a validation error');
} catch (e: any) {
  const msg: string = e.message ?? '';
  msg.toLowerCase().includes('policytype') ? pass('Throws Invalid: policyType error') : fail('Wrong error message', msg);
}

// ─── Test 5: Determinism — C1 run 2 ─────────────────────────────────────────

console.log('\n[TEST 5] Determinism — C1 run 2 (stage 2 confidence must be ≥ 0.90)');
const r1b = await processClaim(DEMO_CLAIMS.C1);
console.log(`  Status: ${r1b.Status} | Stage2 confidence: ${r1b['Audit Log'][1]?.confidence}`);
r1b.Status === 'Rejected'                ? pass('C1 run2 status = Rejected')       : fail('C1 run2 status', r1b.Status);
r1b['Audit Log'][1].confidence >= 0.90  ? pass('C1 run2 stage2 confidence ≥ 0.90') : fail('C1 run2 stage2 confidence', String(r1b['Audit Log'][1].confidence));

// ─── Test 6: Single-stage API (runStage) ─────────────────────────────────────

console.log('\n[TEST 6] Single-stage API — runStage() for C1 Stage 2');
const s2 = await runStage({ claim: DEMO_CLAIMS.C1, stageNumber: 2, priorStages: [] });
console.log(`  Step: ${s2.step} | Confidence: ${s2.confidence}`);
s2.step === 'coverage_check'  ? pass('runStage returns correct step name') : fail('runStage step name', s2.step);
s2.confidence >= 0.90         ? pass('runStage stage2 confidence ≥ 0.90')  : fail('runStage confidence', String(s2.confidence));

// ─── Test 7: Validate API ────────────────────────────────────────────────────

console.log('\n[TEST 7] Validate API — consistency check on C1 audit log');
const validationResult = validate({ auditLog: r1['Audit Log'], finalStatus: r1.Status });
validationResult.isConsistent ? pass('Validate: C1 audit log consistent') : fail('Validate: inconsistency found', validationResult.issues.join('; '));

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${'='.repeat(50)}`);
console.log(`E2E RESULTS: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('🎉 ALL TESTS PASSED');
else              console.log('⚠️  SOME TESTS FAILED — review output above');
console.log('='.repeat(50));
