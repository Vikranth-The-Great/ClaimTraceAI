import { StageOutput } from '../types/stage';

export function parseStageResponse(raw: string): StageOutput | null {
  try {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      const firstNewline = cleaned.indexOf('\n');
      if (firstNewline !== -1) {
        cleaned = cleaned.substring(firstNewline + 1);
      }
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3).trim();
    }

    const parsed = JSON.parse(cleaned);
    
    if (parsed && typeof parsed.step === 'string' && typeof parsed.reason === 'string' && 
        typeof parsed.confidence === 'number' && typeof parsed.source === 'string') {
      return parsed as StageOutput;
    }
    return null;
  } catch (error) {
    return null;
  }
}
