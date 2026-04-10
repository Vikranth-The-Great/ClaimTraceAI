import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { runPipeline } from '../src/lib/pipeline/orchestrator';
import { ClaimInput } from '../src/lib/types/claim';

// Load env vars
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const testCases: ClaimInput[] = [
  {
    claimId: "TC-01-CLEAN",
    accidentDescription: "Was parked at the mall and someone dented my front left door. Minimal damage but needs repair.",
    policyType: "Comprehensive",
    claimAmount: 25000,
    pastClaimsCount: 0,
    documentStatus: "Complete"
  },
  {
    claimId: "TC-02-TP-OWN-DAMAGE",
    accidentDescription: "I accidentally hit a light pole while reversing out of my driveway early morning.",
    policyType: "Third-Party",
    claimAmount: 18000,
    pastClaimsCount: 1,
    documentStatus: "Complete"
  },
  {
    claimId: "TC-03-HIGH-FRAUD",
    accidentDescription: "Noticed a tiny scratch on my mirror after parking.",
    policyType: "Comprehensive",
    claimAmount: 125000,
    pastClaimsCount: 5,
    documentStatus: "Missing"
  },
  {
    claimId: "TC-04-TOTAL-LOSS",
    accidentDescription: "A heavy truck lost control on the highway and T-boned my car. The vehicle is completely totaled.",
    policyType: "Comprehensive",
    claimAmount: 850000,
    pastClaimsCount: 0,
    documentStatus: "Complete"
  },
  {
    claimId: "TC-05-VAGUE-MISSING",
    accidentDescription: "I woke up and something was broken on the car I don't know what happened.",
    policyType: "Comprehensive",
    claimAmount: 40000,
    pastClaimsCount: 0,
    documentStatus: "Missing"
  },
  {
    claimId: "TC-06-TP-VALID",
    accidentDescription: "I rear-ended another driver at a stop sign. Paying for the damage to their Mercedes bumper.",
    policyType: "Third-Party",
    claimAmount: 120000,
    pastClaimsCount: 0,
    documentStatus: "Complete"
  },
  {
    claimId: "TC-07-FREQ-OFFENDER",
    accidentDescription: "Scraped my rim on the sidewalk while parallel parking. Just need a quick fix.",
    policyType: "Comprehensive",
    claimAmount: 12000,
    pastClaimsCount: 6,
    documentStatus: "Complete"
  },
  {
    claimId: "TC-08-HIGH-VAL-INCOMPLETE",
    accidentDescription: "Engine spontaneously caught on fire while driving on the highway. Fire completely destroyed the front.",
    policyType: "Comprehensive",
    claimAmount: 400000,
    pastClaimsCount: 0,
    documentStatus: "Incomplete"
  },
  {
    claimId: "TC-09-WEATHER",
    accidentDescription: "A massive branch fell off the oak tree onto my car's roof during last night's severe thunderstorm.",
    policyType: "Comprehensive",
    claimAmount: 45000,
    pastClaimsCount: 0,
    documentStatus: "Complete"
  },
  {
    claimId: "TC-10-TP-FRAUD",
    accidentDescription: "I bumped a shopping cart into someone else's car leaving a small scratch.",
    policyType: "Third-Party",
    claimAmount: 450000,
    pastClaimsCount: 4,
    documentStatus: "Complete"
  }
];

async function executeTests() {
  console.log("==================================================");
  console.log("STARTING AUTOMATED 10-TEST BENCHMARK");
  console.log("==================================================\\n");

  let passes = 0;

  for (let i = 0; i < testCases.length; i++) {
    const claim = testCases[i];
    console.log(`[TEST ${i + 1}/10] Processing: ${claim.claimId}`);
    console.log(`Policy: ${claim.policyType} | Docs: ${claim.documentStatus} | Amount: ${claim.claimAmount} | Past Claims: ${claim.pastClaimsCount}`);
    
    try {
      const result = await runPipeline(claim);
      console.log(`Status: ${result.Status}`);
      console.log(`Reason: ${result.Reason}`);
      console.log(`Confidence: ${(result["Confidence Score"] * 100).toFixed(1)}%`);
      
      // Determine what we expected logically (just for human reference, the decision is AI driven)
      console.log("Result parsing successful.\\n--------------------------------------------------");
      passes++;
    } catch (e) {
      console.error(`FAILED! Error: ${e}\\n--------------------------------------------------`);
    }
  }

  console.log(`\\n==================================================`);
  console.log(`BENCHMARK COMPLETE: ${passes}/${testCases.length} claims processed successfully without crash.`);
  console.log(`==================================================`);
}

executeTests();
