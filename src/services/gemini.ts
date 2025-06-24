import { AdResult, CampaignDay } from '../types/ad';

const GEMINI_API_KEYS = [
  'AIzaSyBaqYfsUxcH5_UfV0U_SI7ISuTX4xSEiVA',
  'AIzaSyDg1ZK5U_vFHg4QwNw1gCKsVaQd3Q5VjIY',
  'AIzaSyBwgtynSmx4PA7SW4xHkBlLIGrGxqLxGyA',
  'AIzaSyDPELlGWyEcPsJbraoACArB5zQoT9kIVwE',
  // New keys
  'AIzaSyBKUyr2-CERxnGkpHpbWbtRooYdP2SU9ME',
  'AIzaSyAMdtlY4q4rHZ2PIuJVJ4D7dEKL0zSgNjY',
  'AIzaSyBt4V-Ghd6St-d_2Jt-O0-IRWV_5edev0w',
  'AIzaSyC9kRHVZgE6_SsJXWTAQRoJEV3HCki3No0',
  'AIzaSyDIqZAJW1qIt9LiWZ6dSygYrqaniYT8HLk',
  'AIzaSyBVaYY8uM4YmlDk1SbgTgOPLXzpmaB6bvM',
  'AIzaSyBN4c2BlB__2ksn8urTe6-ZsVnd2TKRjh8',
  'AIzaSyBDtYhssL5IDvqvXqyPqbl0V-UeMrD7YAg',
  'AIzaSyBi7H5jniHO663-ToxeI0CL-ft4AS3q2rU',
  'AIzaSyBQd0rBRvVV3N0bs8ei0ckqD6nFegSSmzY'
];

// Track API key usage
interface KeyStatus {
  key: string;
  usageCount: number;
  lastUsed: number;
  failedAttempts: number;
}

const keyStatuses: KeyStatus[] = GEMINI_API_KEYS.map(key => ({
  key,
  usageCount: 0,
  lastUsed: 0,
  failedAttempts: 0
}));

// Get the best available key
const getNextApiKey = (): KeyStatus => {
  // Sort by least failed attempts, then by least usage, then by oldest last used
  const sortedKeys = [...keyStatuses].sort((a, b) => {
    if (a.failedAttempts !== b.failedAttempts) {
      return a.failedAttempts - b.failedAttempts;
    }
    if (a.usageCount !== b.usageCount) {
      return a.usageCount - b.usageCount;
    }
    return a.lastUsed - b.lastUsed;
  });
  
  const keyStatus = sortedKeys[0];
  keyStatus.usageCount++;
  keyStatus.lastUsed = Date.now();
  
  return keyStatus;
};

const markKeyAsFailed = (key: string) => {
  const keyStatus = keyStatuses.find(ks => ks.key === key);
  if (keyStatus) {
    keyStatus.failedAttempts++;
  }
};

const resetFailedAttempts = () => {
  // Reset failed attempts every hour
  keyStatuses.forEach(ks => {
    if (Date.now() - ks.lastUsed > 60 * 60 * 1000) {
      ks.failedAttempts = 0;
    }
  });
};

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

// Mock responses for different tool types
const createMockAdResult = (): AdResult => {
  return {
    headline: "⚠️ Engaging Headline for Your Business",
    adCopy: "⚠️ This is a mock ad response. Our AI is currently busy. Please try again in a few minutes for a real ad tailored to your business.",
    tiktokScript: "⚠️ [Opening shot]\nHi there! This is a mock TikTok script.\n\n[Middle section]\nOur AI is currently processing many requests.\n\n[Closing]\nPlease try again soon for a real script!",
    captions: [
      "⚠️ Mock caption #1. Please try again soon!",
      "⚠️ Mock caption #2. Our AI is busy right now.",
      "⚠️ Mock caption #3. We'll be back shortly!"
    ],
    businessType: "Service Business",
    tone: "professional",
    performanceEstimate: {
      engagementRate: 5,
      clickThroughRate: 2,
      conversionRate: 1
    }
  };
};

const createMockCampaignDays = (): CampaignDay[] => {
  const themes = [
    "Problem Awareness", 
    "Solution Introduction", 
    "Social Proof", 
    "Urgency/Scarcity", 
    "Behind-the-Scenes", 
    "Customer Success", 
    "Special Offer"
  ];
  
  return Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    theme: themes[i],
    headline: `⚠️ Mock Headline for Day ${i + 1}`,
    adCopy: `⚠️ This is a mock ad copy for day ${i + 1}. Our AI is currently busy. Please try again in a few minutes.`,
    tiktokScript: `⚠️ [Day ${i + 1} Opening]\nThis is a mock TikTok script.\n\n[Middle]\nOur AI is currently processing many requests.\n\n[Closing]\nPlease try again soon!`,
    captions: [
      `⚠️ Mock caption for day ${i + 1}. Please try again soon!`,
      `⚠️ Another caption option for day ${i + 1}.`,
      `⚠️ Third caption alternative for day ${i + 1}.`
    ]
  }));
};

const createMockTrendRewrite = (trendTopic: string, userNiche: string) => {
  return {
    originalTrend: trendTopic,
    tweetVersion: `⚠️ This is a mock tweet adapting "${trendTopic}" for the ${userNiche} niche. Please try again soon for a real adaptation!`,
    scriptVersion: `⚠️ [Opening]\nHey there! This is a mock script showing how "${trendTopic}" applies to ${userNiche}.\n\n[Middle]\nOur AI is currently busy processing requests.\n\n[Closing]\nTry again soon for a real script!`,
    adVersion: `⚠️ [${userNiche} AD] This is a mock ad that would normally show how "${trendTopic}" relates to your niche. Please try again soon!`,
    niche: userNiche
  };
};

const createMockSocialContent = (platform: string, contentType: string) => {
  return {
    hook: "⚠️ This is a mock attention-grabbing hook",
    script: `⚠️ [Opening]\nHey there! This is a mock ${platform} script.\n\n[Middle]\nOur AI is currently busy processing requests.\n\n[Closing]\nTry again soon for a real script!`,
    hashtags: ["mockhashtag1", "mockhashtag2", "tryagainsoon", "aiisbursy", "mockresponse"],
    captions: [
      "⚠️ This is a mock caption #1. Please try again soon!",
      "⚠️ This is a mock caption #2. Our AI is busy right now.",
      "⚠️ This is a mock caption #3. We'll be back shortly!"
    ],
    platform: platform,
    contentType: contentType,
    trendingElements: ["Mock trending sound", "Mock effect", "Mock format"]
  };
};

const createMockEmailResult = (emailType: string) => {
  return {
    subject: `⚠️ Mock ${emailType} Email Subject Line`,
    emailBody: `⚠️ Hi [Name],\n\nThis is a mock ${emailType} email. Our AI is currently busy processing requests.\n\nPlease try again soon for a real email template tailored to your business and target audience.\n\nBest regards,\nYour Name`,
    followUps: [
      "⚠️ Mock follow-up email #1. Please try again soon!",
      "⚠️ Mock follow-up email #2. Our AI is busy right now.",
      "⚠️ Mock follow-up email #3. We'll be back shortly!"
    ],
    spamScore: 3,
    openRatePrediction: 25,
    responseRatePrediction: 5
  };
};

const createMockModularAd = (hook: string, pain: string, solution: string, cta: string) => {
  return {
    components: {
      hook: hook || "⚠️ Mock hook",
      pain: pain || "⚠️ Mock pain point",
      solution: solution || "⚠️ Mock solution",
      cta: cta || "⚠️ Mock CTA"
    },
    assembledAds: [
      {
        version: "Standard Flow",
        fullAd: `⚠️ ${hook || "Mock hook"} ${pain || "Mock pain"} ${solution || "Mock solution"} ${cta || "Mock CTA"}`,
        effectiveness: 7
      },
      {
        version: "Problem-First",
        fullAd: `⚠️ ${pain || "Mock pain"} ${hook || "Mock hook"} ${solution || "Mock solution"} ${cta || "Mock CTA"}`,
        effectiveness: 6
      },
      {
        version: "Solution-Led",
        fullAd: `⚠️ ${solution || "Mock solution"} ${pain || "Mock pain"} ${hook || "Mock hook"} ${cta || "Mock CTA"}`,
        effectiveness: 5
      }
    ],
    templates: [
      "⚠️ [HOOK] → [PAIN] → [SOLUTION] → [CTA]",
      "⚠️ [PAIN] → [HOOK] → [SOLUTION] → [CTA]",
      "⚠️ [SOLUTION] → [PAIN] → [HOOK] → [CTA]"
    ],
    randomizedVersion: `⚠️ ${solution || "Mock solution"} ${cta || "Mock CTA"} ${hook || "Mock hook"} ${pain || "Mock pain"}`
  };
};

const createMockHyperPersona = (targetAudience: string) => {
  return {
    demographicProfile: `⚠️ Mock demographic profile for ${targetAudience}. Our AI is currently busy.`,
    psychographicSummary: "⚠️ Mock psychographic summary. Please try again soon for a real analysis.",
    psychologicalDrivers: [
      {
        driver: "⚠️ Mock Psychological Driver 1",
        explanation: "This is a mock explanation of this psychological driver."
      },
      {
        driver: "⚠️ Mock Psychological Driver 2",
        explanation: "This is a mock explanation of this psychological driver."
      },
      {
        driver: "⚠️ Mock Psychological Driver 3",
        explanation: "This is a mock explanation of this psychological driver."
      }
    ],
    decisionPatterns: [
      {
        pattern: "⚠️ Mock Decision Pattern 1",
        explanation: "This is a mock explanation of this decision pattern.",
        marketingImplications: "These are mock marketing implications."
      },
      {
        pattern: "⚠️ Mock Decision Pattern 2",
        explanation: "This is a mock explanation of this decision pattern.",
        marketingImplications: "These are mock marketing implications."
      }
    ],
    communicationStrategies: {
      messagingApproaches: [
        "⚠️ Mock messaging approach 1",
        "⚠️ Mock messaging approach 2",
        "⚠️ Mock messaging approach 3"
      ],
      channelPreferences: [
        "⚠️ Mock channel preference 1",
        "⚠️ Mock channel preference 2",
        "⚠️ Mock channel preference 3"
      ]
    },
    objectionHandling: [
      {
        objection: "⚠️ Mock Objection 1",
        psychologicalRoot: "This is a mock psychological root of the objection.",
        recommendedResponse: "This is a mock recommended response."
      },
      {
        objection: "⚠️ Mock Objection 2",
        psychologicalRoot: "This is a mock psychological root of the objection.",
        recommendedResponse: "This is a mock recommended response."
      }
    ]
  };
};

const createMockCreatorFunnel = (accountHandle: string) => {
  return {
    accountHandle: accountHandle || "⚠️ mock_account",
    leadMagnetIdea: "⚠️ Mock lead magnet idea. Our AI is currently busy. Please try again soon.",
    emailSequence: [
      "⚠️ Mock email #1: Welcome email",
      "⚠️ Mock email #2: Value email",
      "⚠️ Mock email #3: Problem email",
      "⚠️ Mock email #4: Solution email",
      "⚠️ Mock email #5: Testimonial email",
      "⚠️ Mock email #6: Objection email",
      "⚠️ Mock email #7: Closing email"
    ],
    monetizationApproach: "⚠️ Mock monetization approach. Please try again soon for a real strategy.",
    landingPage: {
      headline: "⚠️ Mock Landing Page Headline",
      socialProof: "⚠️ Mock social proof section. Our AI is currently busy.",
      cta: "⚠️ Try Again Soon",
      faqs: [
        "⚠️ Mock FAQ question #1? Mock answer #1.",
        "⚠️ Mock FAQ question #2? Mock answer #2.",
        "⚠️ Mock FAQ question #3? Mock answer #3.",
        "⚠️ Mock FAQ question #4? Mock answer #4.",
        "⚠️ Mock FAQ question #5? Mock answer #5."
      ]
    },
    exportFormat: "⚠️ Mock export format description. Please try again soon."
  };
};

const createMockCommentExploder = (viralPost: string) => {
  return {
    viralPost: viralPost || "⚠️ Mock viral post",
    extractedComments: [
      "⚠️ Mock extracted comment #1. Our AI is currently busy.",
      "⚠️ Mock extracted comment #2. Please try again soon.",
      "⚠️ Mock extracted comment #3. We'll be back shortly!",
      "⚠️ Mock extracted comment #4. Try again in a few minutes.",
      "⚠️ Mock extracted comment #5. AI is processing many requests."
    ],
    expandedContent: {
      tiktokHooks: [
        "⚠️ Mock TikTok hook #1 based on comments",
        "⚠️ Mock TikTok hook #2 based on comments",
        "⚠️ Mock TikTok hook #3 based on comments",
        "⚠️ Mock TikTok hook #4 based on comments",
        "⚠️ Mock TikTok hook #5 based on comments"
      ],
      tweetThreads: [
        "⚠️ Mock tweet thread #1 based on comments",
        "⚠️ Mock tweet thread #2 based on comments",
        "⚠️ Mock tweet thread #3 based on comments"
      ],
      videoAngles: [
        "⚠️ Mock video angle #1 based on comments",
        "⚠️ Mock video angle #2 based on comments",
        "⚠️ Mock video angle #3 based on comments",
        "⚠️ Mock video angle #4 based on comments",
        "⚠️ Mock video angle #5 based on comments"
      ]
    }
  };
};

const createMockTimingForecaster = (contentType: string, timezone: string, niche: string) => {
  return {
    contentType: contentType || "⚠️ Mock content type",
    timezone: timezone || "⚠️ Mock timezone",
    niche: niche || "⚠️ Mock niche",
    predictions: {
      tiktok: "⚠️ Mock TikTok timing prediction. Our AI is currently busy. Best times are typically 6-9 PM local time.",
      instagram: "⚠️ Mock Instagram timing prediction. Please try again soon. Best times are typically 11 AM-2 PM local time.",
      youtubeShorts: "⚠️ Mock YouTube Shorts timing prediction. We'll be back shortly! Best times are typically 4-7 PM local time.",
      email: "⚠️ Mock email timing prediction. Try again in a few minutes. Best times are typically Tuesday-Thursday 10 AM."
    },
    reasoning: "⚠️ Mock timing logic explanation. This is a placeholder response while our AI is processing many requests. Please try again soon for a detailed analysis of optimal posting times based on your content type, timezone, and niche."
  };
};

const createMockStyleRoulette = (businessType: string) => {
  return {
    businessType: businessType || "⚠️ Mock business type",
    randomStyles: Array.from({ length: 10 }, (_, i) => ({
      style: ["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i],
      script: `⚠️ Mock script for ${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]} style. Our AI is currently busy. Please try again soon for a real script.`,
      caption: `⚠️ Mock caption for ${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]} style. Please try again soon!`,
      hook: `⚠️ Mock hook for ${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]} style. Our AI is busy right now.`,
      uniqueElements: [
        `⚠️ Mock unique element #1 for ${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]}`,
        `⚠️ Mock unique element #2 for ${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]}`,
        `⚠️ Mock unique element #3 for ${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]}`
      ],
      platform: ["TikTok", "Instagram Reels", "YouTube Shorts"][i % 3]
    })),
    styleExplanations: {
      rant: "⚠️ Mock explanation of rant-style ads. Our AI is currently busy. Please try again soon.",
      skit: "⚠️ Mock explanation of skit-style content. Please try again soon for real guidance.",
      story: "⚠️ Mock explanation of storytelling ad approach. Our AI is processing many requests.",
      qa: "⚠️ Mock explanation of Q&A format execution. Try again in a few minutes.",
      interview: "⚠️ Mock explanation of fake interview style. We'll be back shortly!",
      duet: "⚠️ Mock explanation of duet/response style. Our AI is currently busy.",
      stitch: "⚠️ Mock explanation of stitch/reaction style. Please try again soon.",
      vlog: "⚠️ Mock explanation of vlog-style ad approach. Our AI is processing many requests.",
      pov: "⚠️ Mock explanation of POV ad execution. Try again in a few minutes."
    }
  };
};

const createMockCourseCurriculum = (topic: string) => {
  return {
    topic: topic || "⚠️ Mock topic",
    courseDetails: {
      title: `⚠️ Mock Course: Complete Guide to ${topic || "This Topic"}`,
      subtitle: "⚠️ Mock subtitle: Learn everything you need to know in this comprehensive course",
      positioning: "⚠️ Mock positioning statement. Our AI is currently busy. Please try again soon.",
      audienceLevel: "Beginner to Intermediate"
    },
    curriculum: Array.from({ length: 5 }, (_, i) => ({
      moduleNumber: i + 1,
      moduleTitle: `⚠️ Mock Module ${i + 1}: Introduction to ${topic || "This Topic"} ${i + 1}`,
      lessons: Array.from({ length: 3 }, (_, j) => ({
        lessonNumber: j + 1,
        lessonTitle: `⚠️ Mock Lesson ${i + 1}.${j + 1}: Understanding ${topic || "This Topic"} Concept ${j + 1}`,
        goals: [
          `⚠️ Mock goal #1 for lesson ${i + 1}.${j + 1}`,
          `⚠️ Mock goal #2 for lesson ${i + 1}.${j + 1}`,
          `⚠️ Mock goal #3 for lesson ${i + 1}.${j + 1}`
        ],
        activities: [
          `⚠️ Mock activity #1 for lesson ${i + 1}.${j + 1}`,
          `⚠️ Mock activity #2 for lesson ${i + 1}.${j + 1}`
        ],
        quizPrompts: [
          `⚠️ Mock quiz prompt #1 for lesson ${i + 1}.${j + 1}`,
          `⚠️ Mock quiz prompt #2 for lesson ${i + 1}.${j + 1}`
        ]
      })),
      cta: `⚠️ Mock CTA for module ${i + 1}. Our AI is currently busy. Please try again soon.`
    })),
    bonusUnits: {
      slidePrompts: [
        "⚠️ Mock slide prompt #1. Please try again soon!",
        "⚠️ Mock slide prompt #2. Our AI is busy right now.",
        "⚠️ Mock slide prompt #3. We'll be back shortly!"
      ],
      videoSegments: [
        "⚠️ Mock video segment #1. Please try again soon!",
        "⚠️ Mock video segment #2. Our AI is busy right now.",
        "⚠️ Mock video segment #3. We'll be back shortly!"
      ],
      funnelLayout: "⚠️ Mock funnel layout description. Our AI is currently busy. Please try again soon.",
      ebookDraft: "⚠️ Mock eBook outline. Please try again soon for a real outline tailored to your topic."
    }
  };
};

export const generateAd = async (
  businessDescription: string, 
  tone: string = 'professional',
  inputMode: 'description' | 'info' = 'description'
): Promise<AdResult> => {
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
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating ad:', error);
    return createMockAdResult();
  }
};

export const generateCampaign = async (
  businessDescription: string,
  tone: string = 'professional'
): Promise<CampaignDay[]> => {
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
    // Ensure we have a valid array of campaign days
    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
    // If the result is not in the expected format, return mock data
    console.warn('Campaign generation returned unexpected format:', result);
    return createMockCampaignDays();
  } catch (error) {
    console.error('Error generating campaign:', error);
    return createMockCampaignDays();
  }
};

export const rewriteAd = async (
  originalAd: string,
  tone: string = 'professional'
): Promise<string> => {
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
    
    return '⚠️ Unable to rewrite ad. Please try again later.';
  } catch (error) {
    console.error('Error rewriting ad:', error);
    return `⚠️ Our AI is currently busy. Here's your original ad with minor improvements:\n\n${originalAd}\n\n(Please try again in a few minutes for a complete rewrite.)`;
  }
};

export const callGeminiAPI = async (prompt: string): Promise<any> => {
  // Reset failed attempts for keys that haven't been used in a while
  resetFailedAttempts();
  
  const usedKeys = new Set<string>();
  const maxRetries = GEMINI_API_KEYS.length;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Get the best available key that hasn't been used in this request yet
    const availableKeys = keyStatuses.filter(ks => !usedKeys.has(ks.key));
    if (availableKeys.length === 0) {
      console.warn('All API keys have been tried in this request');
      break;
    }
    
    const keyStatus = availableKeys.sort((a, b) => {
      if (a.failedAttempts !== b.failedAttempts) {
        return a.failedAttempts - b.failedAttempts;
      }
      if (a.usageCount !== b.usageCount) {
        return a.usageCount - b.usageCount;
      }
      return a.lastUsed - b.lastUsed;
    })[0];
    
    const apiKey = keyStatus.key;
    usedKeys.add(apiKey);
    keyStatus.usageCount++;
    keyStatus.lastUsed = Date.now();
    
    try {
      console.log(`Attempt ${attempt + 1} using API key ${apiKey.slice(0, 5)}...`);
      
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
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`API request failed with key ${apiKey.slice(0, 5)}: ${response.status} - ${errorText}`);
        markKeyAsFailed(apiKey);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.warn(`Invalid response structure from Gemini API with key ${apiKey.slice(0, 5)}`);
        markKeyAsFailed(apiKey);
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
        console.warn(`No JSON found in response with key ${apiKey.slice(0, 5)}`);
        throw new Error('No JSON found in response');
      }

      try {
        const result = JSON.parse(jsonMatch[0]);
        // Reset failed attempts for this key since it worked
        keyStatus.failedAttempts = 0;
        return result;
      } catch (parseError) {
        // If JSON parsing fails but it's a rewrite request, return the text
        if (prompt.includes('Rewrite this ad')) {
          return generatedText.trim();
        }
        console.warn(`Failed to parse JSON response with key ${apiKey.slice(0, 5)}`);
        throw new Error('Failed to parse JSON response');
      }
      
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed with API key ${apiKey.slice(0, 5)}...`, error);
      
      // Add a small delay before trying the next key to avoid rate limiting
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
        continue;
      }
    }
  }

  console.error('All API keys failed. Returning mock response.');
  
  // Return appropriate mock response based on the prompt
  if (prompt.includes('Create a 7-day viral ad campaign')) {
    return createMockCampaignDays();
  } else if (prompt.includes('Create a complete viral ad package')) {
    return createMockAdResult();
  } else if (prompt.includes('Rewrite this ad')) {
    return `⚠️ Our AI is currently busy. Please try again in a few minutes for a rewritten ad.`;
  } else if (prompt.includes('Take this trending topic and adapt it for this niche')) {
    const trendMatch = prompt.match(/Trending Topic: "([^"]*)"/);
    const nicheMatch = prompt.match(/User's Niche: "([^"]*)"/);
    return createMockTrendRewrite(
      trendMatch ? trendMatch[1] : "trending topic", 
      nicheMatch ? nicheMatch[1] : "your niche"
    );
  } else if (prompt.includes('Create cold email')) {
    const emailTypeMatch = prompt.match(/Email Type: "([^"]*)"/);
    return createMockEmailResult(emailTypeMatch ? emailTypeMatch[1] : "outreach");
  } else if (prompt.includes('Create viral hooks, scripts, hashtags')) {
    const platformMatch = prompt.match(/Platform: ([^\n]*)/);
    const contentTypeMatch = prompt.match(/Content Type: ([^\n]*)/);
    return createMockSocialContent(
      platformMatch ? platformMatch[1] : "social media",
      contentTypeMatch ? contentTypeMatch[1] : "content"
    );
  } else if (prompt.includes('Combine these components into cohesive ads')) {
    const hookMatch = prompt.match(/Hook: "([^"]*)"/);
    const painMatch = prompt.match(/Pain: "([^"]*)"/);
    const solutionMatch = prompt.match(/Solution: "([^"]*)"/);
    const ctaMatch = prompt.match(/CTA: "([^"]*)"/);
    return createMockModularAd(
      hookMatch ? hookMatch[1] : "",
      painMatch ? painMatch[1] : "",
      solutionMatch ? solutionMatch[1] : "",
      ctaMatch ? ctaMatch[1] : ""
    );
  } else if (prompt.includes('Create a hyper-detailed persona profile')) {
    const audienceMatch = prompt.match(/Target Audience: "([^"]*)"/);
    return createMockHyperPersona(audienceMatch ? audienceMatch[1] : "target audience");
  } else if (prompt.includes('Build a complete funnel for this creator')) {
    const handleMatch = prompt.match(/Account Handle: "([^"]*)"/);
    return createMockCreatorFunnel(handleMatch ? handleMatch[1] : "");
  } else if (prompt.includes('Extract and expand comments from this post')) {
    const postMatch = prompt.match(/Viral Post: "([^"]*)"/);
    return createMockCommentExploder(postMatch ? postMatch[1] : "");
  } else if (prompt.includes('Predict optimal posting times')) {
    const contentTypeMatch = prompt.match(/Content Type: "([^"]*)"/);
    const timezoneMatch = prompt.match(/Timezone: "([^"]*)"/);
    const nicheMatch = prompt.match(/Niche: "([^"]*)"/);
    return createMockTimingForecaster(
      contentTypeMatch ? contentTypeMatch[1] : "",
      timezoneMatch ? timezoneMatch[1] : "",
      nicheMatch ? nicheMatch[1] : ""
    );
  } else if (prompt.includes('Create random ad styles with complete content')) {
    const businessTypeMatch = prompt.match(/Business Type: "([^"]*)"/);
    return createMockStyleRoulette(businessTypeMatch ? businessTypeMatch[1] : "");
  } else if (prompt.includes('Build a complete curriculum for this topic')) {
    const topicMatch = prompt.match(/Topic: "([^"]*)"/);
    return createMockCourseCurriculum(topicMatch ? topicMatch[1] : "");
  }

  // Generic fallback for other tools
  return {
    message: "⚠️ Our AI is currently busy processing many requests. Please try again in a few minutes.",
    mockResponse: true,
    timestamp: new Date().toISOString()
  };
};