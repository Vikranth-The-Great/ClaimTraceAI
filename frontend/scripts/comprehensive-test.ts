import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function fullPipelineTest() {
  const { DEMO_CLAIMS } = await import('../src/data/demoClaims');
  const prompts = await import('../src/lib/pipeline/prompts');
  const { callStageAPI } = await import('../src/lib/services/openai');
  const { parseStageResponse } = await import('../src/lib/services/parser');
  const { calculateOverallConfidence } = await import('../src/lib/utils/confidence');

  const claims = [DEMO_CLAIMS.C1, DEMO_CLAIMS.C2, DEMO_CLAIMS.C3];

  console.log('--- STARTING COMPREHENSIVE 3-CLAIM PIPELINE TEST ---\n');

  for (const claim of claims) {
    console.log(`\n>>> TESTING CLAIM: ${claim.claimId} (${claim.policyType}, Amount: ${claim.claimAmount})`);
    
    const auditLog = [];
    
    // Stage 1
    console.log('Running Stage 1...');
    const p1 = prompts.buildStage1Prompt(claim);
    const r1 = await callStageAPI(p1);
    const o1 = parseStageResponse(r1);
    if (o1) auditLog.push(o1);

    // Stage 2
    console.log('Running Stage 2...');
    const p2 = prompts.buildStage2Prompt(claim, auditLog);
    const r2 = await callStageAPI(p2);
    const o2 = parseStageResponse(r2);
    if (o2) auditLog.push(o2);

    // Stage 3
    console.log('Running Stage 3...');
    const p3 = prompts.buildStage3Prompt(claim, auditLog);
    const r3 = await callStageAPI(p3);
    const o3 = parseStageResponse(r3);
    if (o3) auditLog.push(o3);

    // Stage 4
    console.log('Running Stage 4...');
    const p4 = prompts.buildStage4Prompt(claim, auditLog);
    const r4 = await callStageAPI(p4);
    const o4 = parseStageResponse(r4);
    if (o4) auditLog.push(o4);

    // Stage 5
    console.log('Running Stage 5...');
    const p5 = prompts.buildStage5Prompt(claim, auditLog);
    const r5 = await callStageAPI(p5);
    const o5 = await JSON.parse(r5); // Stage 5 has 'result' field
    
    console.log(`\n[FINAL RESULT FOR ${claim.claimId}]:`);
    console.log(`Status: ${o5.result}`);
    console.log(`Confidence: ${o5.confidence}`);
    console.log(`Reason: ${o5.reason}`);

    // Verification
    if (claim.claimId === 'C1' && o5.result === 'Rejected') console.log('✅ PASS: C1 Rejected');
    else if (claim.claimId === 'C2' && o5.result === 'Approved') console.log('✅ PASS: C2 Approved');
    else if (claim.claimId === 'C3' && o5.result === 'Pending') console.log('✅ PASS: C3 Pending');
    else console.log('❌ FAIL: Outcome mismatch');
  }

  console.log('\n--- ALL TESTS COMPLETE ---');
}

fullPipelineTest().catch(console.error);
