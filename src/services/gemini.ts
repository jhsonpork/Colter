import { AdResult, CampaignDay } from '../types/ad';

// Use all 4 API keys in rotation for better reliability
const GEMINI_API_KEYS = [
  'AIzaSyBaqYfsUxcH5_UfV0U_SI7ISuTX4xSEiVA',
  'AIzaSyDg1ZK5U_vFHg4QwNw1gCKsVaQd3Q5VjIY',
  'AIzaSyBwgtynSmx4PA7SW4xHkBlLIGrGxqLxGyA',
  'AIzaSyDPELlGWyEcPsJbraoACArB5zQoT9kIVwE'
];

let currentKeyIndex = 0;
let failedKeys: string[] = [];

const getNextApiKey = () => {
  // Skip keys that have recently failed
  let attempts = 0;
  while (attempts < GEMINI_API_KEYS.length) {
    const key = GEMINI_API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
    
    if (!failedKeys.includes(key)) {
      return key;
    }
    
    attempts++;
  }
  
  // If all keys have failed, reset the failed keys list and try again
  failedKeys = [];
  return GEMINI_API_KEYS[currentKeyIndex];
};

// Reset failed keys after 5 minutes
setInterval(() => {
  failedKeys = [];
  console.log('Reset failed API keys list');
}, 5 * 60 * 1000);

const getTonePrompt = (tone: string) => {
  const tonePrompts = {
    professional: "professional, trustworthy, and authoritative",
    funny: "humorous, witty, and entertaining with clever wordplay",
    luxury: "sophisticated, exclusive, and premium with elegant language",
    genz: "trendy, casual, and relatable with modern slang and emojis",
    corporate: "formal, business-focused, and results-oriented",
    spiritual: "mindful, inspiring, and wellness-focused",
    edgy: "bold, provocative, and attention-grabbing",
    friendly: "warm, approachable, and conversational"
  };
  return tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.professional;
};

export const generateAd = async (
  businessDescription: string, 
  tone: string = 'professional',
  inputMode = 'description'
): Promise<AdResult | null> {
  const toneStyle = getTonePrompt(tone);
  const inputContext = inputMode === 'description' 
    ? 'Business Description' 
    : 'Detailed Business Information';

  const prompt = `
You are a world-class copywriter and viral marketing expert. Create a complete viral ad package for this business with a ${toneStyle} tone.

${inputContext}: "${businessDescription}"

Generate the following in JSON format:
{
  "headline": "A powerful, attention-grabbing headline (max 10 words) that's ${toneStyle}",
  "adCopy": "Compelling ad copy for Facebook/Instagram (2-3 sentences, focus on benefits and urgency) in a ${toneStyle} style",
  "tiktokScript": "A 30-second TikTok video script with hook, problem, solution, and CTA (format with line breaks) that's ${toneStyle}",
  "captions": ["3 different short captions for social media posts (each max 2 sentences) in a ${toneStyle} tone"],
  "businessType": "category of the business",
  "tone": "${tone}",
  "performanceEstimate": {
    "engagementRate": "realistic percentage between 3-12",
    "clickThroughRate": "realistic percentage between 1-5", 
    "conversionRate": "realistic percentage between 0.5-3"
  }
}

Make it viral, compelling, and conversion-focused. Use psychology triggers like scarcity, social proof, and FOMO. Be creative and attention-grabbing while maintaining the ${toneStyle} tone throughout.
`;

  try {
    const result = await callGeminiAPI(prompt);
    return result;
  } catch (error) {
    console.error('Failed to generate ad:', error);
    return null;
  }
};

export const generateCampaign = async (
  businessDescription: string,
  tone: string = 'professional'
): Promise<CampaignDay[] | null> {
  const toneStyle = getTonePrompt(tone);

  const prompt = `
You are a world-class marketing strategist. Create a 7-day viral ad campaign for this business with a ${toneStyle} tone.

Business Description: "${businessDescription}"

Generate a JSON array with 7 different ad concepts, each targeting a different angle or audience segment:

[
  {
    "day": 1,
    "theme": "Brief theme description (e.g., 'Problem Awareness')",
    "headline": "Attention-grabbing headline for this day's angle",
    "adCopy": "Compelling ad copy (2-3 sentences) with ${toneStyle} tone",
    "tiktokScript": "30-second TikTok script with hook, content, and CTA",
    "captions": ["3 caption variations for this day's theme"]
  }
]

Day themes should include: Problem Awareness, Solution Introduction, Social Proof, Urgency/Scarcity, Behind-the-Scenes, Customer Success, and Special Offer.

Each day should have a unique angle while maintaining the ${toneStyle} tone and building toward a cohesive campaign narrative.
`;

  try {
    const result = await callGeminiAPI(prompt);
    return result;
  } catch (error) {
    console.error('Failed to generate campaign:', error);
    return null;
  }
};

export const rewriteAd = async (
  originalAd: string,
  tone: string = 'professional'
): Promise<string> {
  const toneStyle = getTonePrompt(tone);

  const prompt = `
You are a world-class copywriter specializing in viral marketing. Rewrite this ad to make it more compelling, viral, and conversion-focused with a ${toneStyle} tone.

Original Ad: "${originalAd}"

Rewrite this ad to:
- Make it more engaging and viral
- Improve the hook and emotional triggers
- Add urgency and scarcity elements
- Optimize the call-to-action
- Maintain a ${toneStyle} tone throughout
- Use proven copywriting formulas (AIDA, PAS, etc.)

Return only the rewritten ad copy, no explanations or formatting.
`;

  try {
    const result = await callGeminiAPI(prompt);
    
    // For rewrite requests, return the text directly
    if (typeof result === 'string') {
      return result.trim();
    }
    
    // If it's an object, try to extract text
    if (result && typeof result === 'object') {
      return JSON.stringify(result);
    }
    
    return 'Error: Unable to rewrite ad. Please try again.';
  } catch (error) {
    console.error('Failed to rewrite ad:', error);
    return 'Error: Unable to rewrite ad. Please try again.';
  }
};

export const callGeminiAPI = async (prompt: string): Promise<any> => {
  const maxRetries = GEMINI_API_KEYS.length * 2; // Allow multiple attempts per key
  let lastError: Error | null = null;
  let attemptCount = 0;

  while (attemptCount < maxRetries) {
    const apiKey = getNextApiKey();
    attemptCount++;
    
    try {
      console.log(`Attempt ${attemptCount}/${maxRetries} with API key ${apiKey.slice(0, 5)}...`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.9,
              topK: 1,
              topP: 1,
              maxOutputTokens: 4096,
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API key ${apiKey.slice(0, 5)}... failed with status ${response.status}: ${errorText}`);
        
        // Add this key to failed keys list
        if (!failedKeys.includes(apiKey)) {
          failedKeys.push(apiKey);
        }
        
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error(`API key ${apiKey.slice(0, 5)}... returned invalid response structure:`, data);
        throw new Error('Invalid response structure from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // For rewrite requests, return the text directly
      if (prompt.includes('Return only the rewritten ad copy')) {
        return generatedText.trim();
      }
      
      // For JSON responses, extract and parse JSON
      const jsonMatch = generatedText.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (!jsonMatch) {
        // If no JSON found but it's a rewrite request, return the text
        if (prompt.includes('Rewrite this ad')) {
          return generatedText.trim();
        }
        console.error(`API key ${apiKey.slice(0, 5)}... returned no JSON in response:`, generatedText);
        throw new Error('No JSON found in response');
      }

      try {
        const result = JSON.parse(jsonMatch[0]);
        console.log(`Successfully used API key ${apiKey.slice(0, 5)}...`);
        
        // Remove this key from failed keys if it was there
        failedKeys = failedKeys.filter(k => k !== apiKey);
        
        return result;
      } catch (parseError) {
        // If JSON parsing fails but it's a rewrite request, return the text
        if (prompt.includes('Rewrite this ad')) {
          return generatedText.trim();
        }
        console.error(`API key ${apiKey.slice(0, 5)}... returned invalid JSON:`, parseError);
        throw new Error('Failed to parse JSON response');
      }
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attemptCount} failed with API key ${apiKey.slice(0, 5)}...`, error);
      
      // Add a small delay before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // If we've exhausted all retries, throw the last error
  console.error(`All ${maxRetries} API attempts failed. Last error:`, lastError);
  throw new Error(`All API attempts failed. Last error: ${lastError?.message || 'Unknown error'}`);
};