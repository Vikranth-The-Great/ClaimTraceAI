import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verify() {
  // Dynamic imports to ensure process.env is populated before openai.ts is initialized
  const { DEMO_CLAIMS } = await import('../src/data/demoClaims');
  const prompts = await import('../src/lib/pipeline/prompts');
  const { callStageAPI } = await import('../src/lib/services/openai');
  const { parseStageResponse } = await import('../src/lib/services/parser');

  console.log('--- STARTING REAL API VERIFICATION ---');

  // Verify Stage 2 for C1
  console.log('\n[TEST 1: C1 Stage 2 Coverage Validation]');
  const c1 = DEMO_CLAIMS.C1;
  const p1 = prompts.buildStage2Prompt(c1, []);
  const r1 = await callStageAPI(p1);
  const data1 = parseStageResponse(r1);
  console.log('Response:', data1);
  if (data1 && data1.confidence >= 0.90 && data1.reason.toLowerCase().includes('third-party')) {
    console.log('✅ TEST 1 PASSED');
  } else {
    console.log('❌ TEST 1 FAILED');
  }

  // Verify Stage 4 for C3
  console.log('\n[TEST 2: C3 Stage 4 Fraud Check]');
  const c3 = DEMO_CLAIMS.C3;
  const p3 = prompts.buildStage4Prompt(c3, []);
  const r3 = await callStageAPI(p3);
  const data3 = parseStageResponse(r3);
  console.log('Response:', data3);
  if (data3 && data3.confidence < 0.65) {
    console.log('✅ TEST 2 PASSED');
  } else {
    console.log('❌ TEST 2 FAILED');
  }

  console.log('\n--- VERIFICATION COMPLETE ---');
}

verify().catch(console.error);
