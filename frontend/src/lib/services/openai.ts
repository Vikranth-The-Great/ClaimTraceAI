import OpenAI from 'openai';
import { DEFAULT_MODELS, TEMPERATURE, MAX_TOKENS } from '../utils/constants';

let _openai: OpenAI | null = null;

function getOpenAIClient() {
  if (_openai) return _openai;

  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_key_here') {
    throw new Error('VITE_OPENAI_API_KEY is not set or is using placeholder.');
  }

  _openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  return _openai;
}

/**
 * Calls the OpenAI API for a specific pipeline stage.
 * @param prompt The prompt to send to the model.
 * @returns The raw JSON string from the model.
 */
export async function callStageAPI(prompt: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODELS.PRIMARY,
      messages: [
        { 
          role: 'system', 
          content: 'You are an objective insurance claim auditing assistant. You provide structured, explainable reasoning in JSON format.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: 'json_object' }
    });

    return response.choices[0].message.content || '{}';
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(`OpenAI API call failed: ${error.message}`);
  }
}
