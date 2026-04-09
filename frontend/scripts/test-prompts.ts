import { DEMO_CLAIMS } from '../src/data/demoClaims';
import * as prompts from '../src/lib/pipeline/prompts';

const c1 = DEMO_CLAIMS.C1;
console.log('--- TESTING PROMPTS FOR C1 ---');

const s1 = prompts.buildStage1Prompt(c1);
console.log('\n[STAGE 1 PROMPT]:\n', s1);

const s2 = prompts.buildStage2Prompt(c1, []);
console.log('\n[STAGE 2 PROMPT]:\n', s2);

const s3 = prompts.buildStage3Prompt(c1, []);
console.log('\n[STAGE 3 PROMPT]:\n', s3);

const s4 = prompts.buildStage4Prompt(c1, []);
console.log('\n[STAGE 4 PROMPT]:\n', s4);

const s5 = prompts.buildStage5Prompt(c1, []);
console.log('\n[STAGE 5 PROMPT]:\n', s5);

console.log('\n--- VERIFICATION COMPLETE ---');
