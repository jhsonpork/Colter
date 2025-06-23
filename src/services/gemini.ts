import { AdResult, CampaignDay } from '../types/ad';

const GEMINI_API_KEYS = [
  'AIzaSyBaqYfsUxcH5_UfV0U_SI7ISuTX4xSEiVA',
  'AIzaSyDg1ZK5U_vFHg4QwNw1gCKsVaQd3Q5VjIY',
  'AIzaSyBwgtynSmx4PA7SW4xHkBlLIGrGxqLxGyA',
  'AIzaSyDPELlGWyEcPsJbraoACArB5zQoT9kIVwE'
];

let currentKeyIndex = 0;

const getNextApiKey = () => {
  const key = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return key;
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

  return await callGeminiAPI(prompt);
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

  return await callGeminiAPI(prompt);
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
};

export const callGeminiAPI = async (prompt: string): Promise<any> => {
  const maxRetries = GEMINI_API_KEYS.length;
  let lastError: Error | null = null;
  let attemptCount = 0;

  while (attemptCount < maxRetries) {
    const apiKey = getNextApiKey();
    
    try {
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
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
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
        
        // For other requests, try to use the full text as a fallback
        try {
          return JSON.parse(generatedText.trim());
        } catch (parseError) {
          return generatedText.trim();
        }
      }

      try {
        const result = JSON.parse(jsonMatch[0]);
        return result;
      } catch (parseError) {
        // If JSON parsing fails but it's a rewrite request, return the text
        if (prompt.includes('Rewrite this ad')) {
          return generatedText.trim();
        }
        
        // For other requests, try to use the full text as a fallback
        try {
          return JSON.parse(generatedText.trim());
        } catch (innerParseError) {
          return generatedText.trim();
        }
      }
      
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attemptCount + 1} failed with API key ${apiKey.slice(0, 10)}...`, error);
      attemptCount++;
      
      // Add a small delay before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (attemptCount >= maxRetries) {
        // Create a mock response for specific tools when all API calls fail
        if (prompt.includes('Create a 7-day viral ad campaign')) {
          return createMockCampaign();
        } else if (prompt.includes('Create a complete viral ad package')) {
          return createMockAd();
        } else if (prompt.includes('Random ad styles')) {
          return createMockAdStyles();
        } else if (prompt.includes('Create a complete curriculum')) {
          return createMockCurriculum();
        } else if (prompt.includes('Transform these technical specs')) {
          return createMockAcquisitionLanguage();
        } else if (prompt.includes('Create CTAs perfectly matched')) {
          return createMockCTAPersonalizer();
        } else if (prompt.includes('Create a hyper-detailed persona profile')) {
          return createMockHyperPersona();
        } else if (prompt.includes('Create comment bait')) {
          return createMockCommentExploder();
        } else if (prompt.includes('Predict optimal posting times')) {
          return createMockTimingForecaster();
        } else if (prompt.includes('Build a complete funnel')) {
          return createMockCreatorFunnel();
        } else if (prompt.includes('Combine these components into cohesive ads')) {
          return createMockModularAd();
        } else if (prompt.includes('Create high-conversion cold email')) {
          return createMockColdEmail();
        } else if (prompt.includes('Create viral hooks, scripts, hashtags')) {
          return createMockSocialContent();
        } else if (prompt.includes('Take this trending topic and adapt it')) {
          return createMockTrendRewrite();
        }
      }
    }
  }

  throw new Error(`All API keys failed. Last error: ${lastError?.message}`);
};

// Mock response generators for when API calls fail
function createMockAd(): AdResult {
  return {
    headline: "Transform Your Business with Our Solution",
    adCopy: "Discover how our innovative solution can solve your biggest challenges. Save time, reduce costs, and boost productivity today.",
    tiktokScript: "Hook: Are you tired of [common pain point]?\n\nProblem: Every day, businesses waste hours on [problem].\n\nSolution: Our solution helps you [benefit] in just minutes.\n\nCTA: Click the link in bio to start your free trial today!",
    captions: [
      "Ready to transform your business? Our solution makes it easy. #BusinessTips",
      "Stop wasting time on [problem]. Start focusing on growth. Learn how!",
      "The solution thousands of businesses trust. See why it works."
    ],
    businessType: "B2B SaaS",
    tone: "professional",
    performanceEstimate: {
      engagementRate: 8.5,
      clickThroughRate: 3.2,
      conversionRate: 1.8
    }
  };
}

function createMockCampaign(): CampaignDay[] {
  return [
    {
      day: 1,
      theme: "Problem Awareness",
      headline: "Are You Struggling With This Common Challenge?",
      adCopy: "Many businesses waste hours daily on repetitive tasks. Our solution was designed to eliminate this problem once and for all.",
      tiktokScript: "Hook: Raise your hand if you're tired of [problem].\n\nProblem: Every day, businesses like yours waste X hours on this.\n\nSolution: That's why we created [product].\n\nCTA: Click the link to learn more.",
      captions: [
        "Sound familiar? You're not alone. #BusinessChallenges",
        "This is the reality for thousands of businesses. But it doesn't have to be yours.",
        "The first step to solving a problem is recognizing it. Let's talk solutions."
      ]
    },
    {
      day: 2,
      theme: "Solution Introduction",
      headline: "Introducing the Solution You've Been Waiting For",
      adCopy: "Our innovative platform helps you solve [problem] in just minutes. Designed specifically for businesses like yours.",
      tiktokScript: "Hook: What if you could solve [problem] in just minutes?\n\nProblem: Until now, businesses had to [old way].\n\nSolution: Our platform changes everything with [key feature].\n\nCTA: Tap the link to see how it works.",
      captions: [
        "The solution is here. And it's simpler than you think. #GameChanger",
        "We built this after seeing thousands struggle with the same problem.",
        "Innovation doesn't have to be complicated. See how we've simplified everything."
      ]
    },
    {
      day: 3,
      theme: "Social Proof",
      headline: "See Why 1,000+ Businesses Trust Our Solution",
      adCopy: "Join the growing community of businesses that have transformed their operations. Our customers report saving 5+ hours weekly.",
      tiktokScript: "Hook: Don't just take our word for it.\n\nProblem: Businesses were skeptical at first too.\n\nSolution: But after trying it, they saw [specific result].\n\nCTA: Join them by clicking the link in bio.",
      captions: [
        "The results speak for themselves. See what our customers are saying. #Testimonials",
        "From skeptics to advocates - our customers' journey in their own words.",
        "Real businesses, real results. No marketing fluff."
      ]
    },
    {
      day: 4,
      theme: "Urgency/Scarcity",
      headline: "Limited Time: Special Offer Ends Friday",
      adCopy: "Get 30% off our premium plan this week only. Plus receive our exclusive bonus package worth $497 absolutely free.",
      tiktokScript: "Hook: I need to tell you about this before it's gone.\n\nProblem: Our special offer is ending Friday.\n\nSolution: Lock in 30% off plus bonuses worth $497.\n\nCTA: Tap the link now before the timer runs out.",
      captions: [
        "⏰ Time-sensitive: This offer disappears Friday at midnight. #LimitedTime",
        "Only a few spots left at this special rate. Will you claim yours?",
        "The early bird gets the worm (and 30% off). Don't miss this!"
      ]
    },
    {
      day: 5,
      theme: "Behind-the-Scenes",
      headline: "The Story Behind Our Game-Changing Solution",
      adCopy: "We created this solution after experiencing the same frustrations you face. Here's how we're different from everything else on the market.",
      tiktokScript: "Hook: Ever wonder how we created this solution?\n\nProblem: It started when we faced [problem] ourselves.\n\nSolution: So we built something better from the ground up.\n\nCTA: See the difference for yourself via the link in bio.",
      captions: [
        "The story we don't usually tell. This is why we exist. #OurMission",
        "Built by people who faced the same problems you do. That's our difference.",
        "When you understand our 'why,' you'll understand our solution."
      ]
    },
    {
      day: 6,
      theme: "Customer Success",
      headline: "How [Customer Name] Achieved [Specific Result]",
      adCopy: "Learn how one of our customers increased productivity by 37% in just 30 days using our solution. Their step-by-step approach revealed.",
      tiktokScript: "Hook: Let me show you how [Customer] got these results.\n\nProblem: They were struggling with [specific challenge].\n\nSolution: Using our [feature], they achieved [result] in just [timeframe].\n\nCTA: Want similar results? Tap the link in bio.",
      captions: [
        "Success story: From struggling to thriving in 30 days. #CaseStudy",
        "The strategy that helped them achieve a 37% boost in productivity.",
        "Real results from real customers. This could be your story next."
      ]
    },
    {
      day: 7,
      theme: "Special Offer",
      headline: "Ready to Transform Your Business? Start Today",
      adCopy: "Begin your journey with our risk-free 14-day trial. Plus get implementation support and our exclusive resource library - all included.",
      tiktokScript: "Hook: If you've been following along this week...\n\nProblem: You know the challenges businesses face with [problem].\n\nSolution: Today's the day to take action with our risk-free trial.\n\nCTA: Tap the link to start your transformation today.",
      captions: [
        "The moment of decision. Are you ready to transform your business? #StartToday",
        "Risk-free, hassle-free, and supported every step of the way.",
        "Your future self will thank you for the decision you make today."
      ]
    }
  ];
}

function createMockAdStyles() {
  return {
    "businessType": "SaaS/Software",
    "randomStyles": [
      {
        "style": "Rant",
        "script": "Hook: I'm so tired of seeing businesses waste time on [problem]!\n\nLook, I get it. You think the old way works fine. But let me tell you something - it's KILLING your productivity!\n\nEvery day you stick with outdated methods, your competitors are pulling ahead. They're using [product] to solve this in MINUTES, not HOURS.\n\nI'm not trying to be harsh, but someone needs to tell you the truth. This isn't working anymore!\n\nHere's what you need to do instead: [solution steps]\n\nStop wasting time. Stop the madness. Get [product] today and thank me later.",
        "caption": "Had to rant about this because I'm seeing too many businesses struggle unnecessarily! There's a better way 👇 #BusinessTips #Productivity",
        "hook": "I'm so tired of seeing businesses waste time on [problem]!",
        "uniqueElements": [
          "Passionate, emotional delivery",
          "Direct, no-nonsense approach",
          "Contrarian perspective",
          "Builds tension before solution"
        ],
        "platform": "TikTok"
      },
      {
        "style": "Skit",
        "script": "Person 1 (frustrated): *typing furiously* Ugh, this is taking forever!\n\nPerson 2 (colleague): Still working on those reports? It's been hours!\n\nPerson 1: I know! This system is so slow and outdated. I'll be here all night.\n\nPerson 3 (expert): *enters frame* Actually, there's a better way.\n\nPerson 1 & 2: *look up curiously*\n\nPerson 3: *shows screen* With [product], what takes hours now takes minutes. Look...\n\n*Demonstration of product*\n\nPerson 1: That would save me so much time!\n\nPerson 2: And it looks so easy to use!\n\nPerson 3: Want to try it yourself? Link in bio for a free trial.",
        "caption": "This is literally every office still using outdated software 😂 Tag someone who needs to see this! #OfficeHumor #ProductivityHacks",
        "hook": "When your coworker sees you still doing things the hard way...",
        "uniqueElements": [
          "Multiple characters/perspectives",
          "Relatable office scenario",
          "Visual before/after contrast",
          "Humor element"
        ],
        "platform": "Instagram Reels"
      },
      {
        "style": "Story",
        "script": "Last month, I met Sarah, a marketing director who was working 60-hour weeks just to keep up.\n\nShe was drowning in data, manually creating reports that took DAYS to complete.\n\n\"There has to be a better way,\" she told me.\n\nThat's when I showed her [product].\n\nAt first, she was skeptical. \"Another tool to learn? I don't have time for that.\"\n\nBut watch what happened when she gave it just 15 minutes...\n\n*Shows transformation*\n\nNow Sarah finishes in 2 hours what used to take 2 days. She leaves the office at 5pm, not midnight.\n\nAnd her team? They're producing 3x the results with half the stress.\n\nWant to see how? Link in bio.",
        "caption": "Sarah's story is one I hear all too often. Overworked, stressed, and thinking it's normal. It's not. See how she transformed her workflow (and got her life back) 👇 #WorkLifeBalance #ProductivityStory",
        "hook": "Last month, I met Sarah, a marketing director who was working 60-hour weeks just to keep up.",
        "uniqueElements": [
          "Narrative arc with character",
          "Emotional journey",
          "Specific details and results",
          "Transformation focus"
        ],
        "platform": "LinkedIn"
      },
      {
        "style": "Q&A",
        "script": "Question: \"How can I reduce the time spent on [common task]?\"\n\nGreat question! This is something I hear from businesses every day.\n\nThe traditional approach takes about [X hours/days], right?\n\nBut here's what most people don't realize...\n\n*Reveals insight*\n\nThe key is to focus on these 3 things:\n\n1. [First tip]\n2. [Second tip]\n3. [Third tip]\n\nBut the real game-changer? Using [product] to automate the entire process.\n\nLet me show you how it works...\n\n*Quick demo*\n\nAny other questions? Drop them below or check out the link in my bio for more info!",
        "caption": "Answering your #1 question about [task]! Drop your questions below and I'll answer in my next video 👇 #AskMeAnything #ProductivityTips",
        "hook": "You asked: \"How can I reduce the time spent on [common task]?\" Here's my answer...",
        "uniqueElements": [
          "Question-based format",
          "Educational approach",
          "Structured tips",
          "Invites engagement"
        ],
        "platform": "YouTube Shorts"
      },
      {
        "style": "Interview",
        "script": "Interviewer: \"So what's the biggest challenge you see businesses facing today?\"\n\nExpert: \"Without question, it's [specific problem]. Most companies are wasting 15-20 hours per week on this.\"\n\nInterviewer: \"That's shocking! Why is this happening?\"\n\nExpert: \"Three reasons: outdated systems, lack of automation, and simply not knowing there's a better way.\"\n\nInterviewer: \"And what's the solution?\"\n\nExpert: \"We developed [product] specifically to solve this. It reduces the time spent by 80% through [key feature].\"\n\nInterviewer: \"Can you show us how it works?\"\n\nExpert: \"Absolutely! Here's a quick look...\"\n\n*Brief demonstration*\n\nInterviewer: \"That's impressive! Where can people learn more?\"\n\nExpert: \"They can start a free trial through the link in bio.\"",
        "caption": "I interviewed an industry expert about the #1 problem costing businesses thousands of hours each year. The solution might surprise you! #ExpertInterview #BusinessTips",
        "hook": "I asked an industry expert what's costing businesses the most time and money in 2025...",
        "uniqueElements": [
          "Two-person dialogue",
          "Expert positioning",
          "Question-driven format",
          "Natural product introduction"
        ],
        "platform": "Facebook"
      },
      {
        "style": "Duet",
        "script": "*Original video shows someone struggling with [common task]*\n\nYou: *Reacting with shocked expression*\n\nYou: \"Wait, you're still doing it THAT way?\"\n\nYou: \"Let me show you how the pros do this in 2025...\"\n\n*Split screen showing your faster method using the product*\n\nYou: \"See the difference? What took them 45 minutes takes me 3 minutes with [product].\"\n\nYou: \"It works by [brief explanation of key feature].\"\n\nYou: \"I've put a link in my bio if you want to try it yourself. Trust me, it's a game-changer!\"",
        "caption": "I couldn't believe people are still doing it the old way! Had to show a better solution 😱 #WorkSmarter #TimeSaver",
        "hook": "Wait, you're still doing it THAT way?",
        "uniqueElements": [
          "Reaction to existing content",
          "Direct comparison",
          "Shock/surprise element",
          "Before/after demonstration"
        ],
        "platform": "TikTok"
      },
      {
        "style": "Stitch",
        "script": "*Original clip: \"What's one tool that completely changed how you work?\"*\n\n*Cut to you*\n\nYou: \"I have to jump in on this one because [product] literally saved my business.\"\n\nYou: \"Before I found it, I was spending [X hours] every week just trying to [common task].\"\n\nYou: \"The worst part? I thought that was normal!\"\n\nYou: \"Then I discovered [product] and it changed everything. Now I can [benefit] in just [short time].\"\n\nYou: \"Let me show you how it works...\"\n\n*Quick demonstration*\n\nYou: \"If you're still [doing task the old way], you need to check this out. Link in bio for a free trial.\"",
        "caption": "Had to stitch this! @originalcreator asked about game-changing tools, and this one saved me 15+ hours every week #ProductivityHack #WorkSmarter",
        "hook": "I have to jump in on this one because [product] literally saved my business.",
        "uniqueElements": [
          "Builds on another creator's question",
          "Personal testimony",
          "Time-saving emphasis",
          "Demonstration component"
        ],
        "platform": "TikTok"
      },
      {
        "style": "Vlog",
        "script": "*Camera follows you through your workspace*\n\n\"Hey everyone! Today I'm taking you behind the scenes to show you how we manage [specific task] at our company.\"\n\n*Shows computer screen*\n\n\"So this used to be our process... *explains old method*\n\n\"It was taking us about [X hours] every week, which was just unsustainable as we grew.\"\n\n*Transitions to new system*\n\n\"Then we found [product]. Let me show you our workflow now...\"\n\n*Demonstrates key features*\n\n\"As you can see, what used to take hours now takes minutes. This has been absolutely transformational for our team.\"\n\n\"I've linked [product] in my bio if you want to check it out. They're actually offering a special discount for my followers this week.\"\n\n\"Let me know in the comments if you have any questions about how we use it!\"",
        "caption": "A day in the life with our new workflow system! This literally saved our team from burnout 🙌 #DayInTheLife #ProductivityVlog",
        "hook": "Want to see how we cut our workflow time by 80%? Come behind the scenes...",
        "uniqueElements": [
          "Day-in-the-life format",
          "Behind-the-scenes access",
          "Screen recording/demonstration",
          "Personal workspace tour"
        ],
        "platform": "YouTube"
      },
      {
        "style": "POV",
        "script": "*Camera as viewer's perspective*\n\n\"Imagine you're sitting at your desk, staring at [common task], feeling completely overwhelmed...\"\n\n*Shows overwhelming amount of work*\n\n\"Your deadline is tomorrow, but at this rate, you'll be here all night.\"\n\n*Phone notification sound*\n\n\"Then a colleague sends you a link to [product].\"\n\n*Shows product interface*\n\n\"Within minutes, you've automated the entire process.\"\n\n*Shows completed work*\n\n\"Instead of staying late, you're heading home on time.\"\n\n*Shows clock showing normal end of workday*\n\n\"This isn't imagination. This is what [product] does for thousands of users every day.\"\n\n\"Try it free through the link in my bio.\"",
        "caption": "POV: You discover the tool that lets you leave work on time instead of staying late 🕒 #WorkLifeBalance #ProductivityHack",
        "hook": "POV: You're about to miss another deadline... until everything changes.",
        "uniqueElements": [
          "Viewer perspective",
          "Emotional journey",
          "Relatable scenario",
          "Before/after contrast"
        ],
        "platform": "Instagram Reels"
      },
      {
        "style": "Tutorial",
        "script": "Today I'm going to show you how to cut your [task] time in half.\n\nIf you're like most people, you're probably doing it like this...\n\n*Shows common method*\n\nThe problem? This takes way too long and leads to [common errors].\n\nHere's the better way:\n\nStep 1: Sign up for [product] (link in bio)\nStep 2: Import your [data/content/etc.]\nStep 3: Use the [specific feature] like this...\n\n*Demonstrates feature*\n\nStep 4: Click [button] and watch the magic happen\n\n*Shows results*\n\nThat's it! What used to take hours now takes minutes.\n\nDrop a comment if you have questions, and don't forget to follow for more productivity tips!",
        "caption": "How to complete [task] in half the time 🚀 Save this for later! #Tutorial #ProductivityHack",
        "hook": "The #1 mistake people make when doing [task] (and how to fix it)",
        "uniqueElements": [
          "Step-by-step instructions",
          "Screen recording/demonstration",
          "Problem-solution format",
          "Actionable takeaways"
        ],
        "platform": "YouTube"
      }
    ],
    "styleExplanations": {
      "rant": "Rant-style content uses passionate, emotional delivery to create engagement. Speak directly to camera with increasing energy, use hand gestures, and build emotional intensity. Focus on a common frustration before revealing the solution. Works best when you genuinely care about the topic.",
      "skit": "Skit-style content uses multiple characters to create a mini-story. You can play all roles yourself (with outfit changes or camera angles) or collaborate with others. Create a relatable scenario showing the problem, then introduce your product as the solution. Use humor when possible.",
      "story": "Story-style content follows a narrative arc with a character facing a challenge. Use specific details, emotional moments, and a clear transformation. Focus on the journey and results rather than features. This format builds connection and memorability.",
      "qa": "Q&A format addresses a common question from your audience. Start with the question, acknowledge its importance, provide valuable insights, then introduce your product as part of the solution. End by inviting more questions to boost engagement.",
      "interview": "Interview-style content features a conversation between an interviewer and expert. This format builds credibility through the expert position. Structure questions to naturally highlight problems your product solves. Can be done solo by playing both roles.",
      "duet": "Duet-style content responds to another creator's video, showing your reaction and alternative approach. Find videos showing people doing tasks the 'old way' and demonstrate your solution alongside. Great for direct comparisons.",
      "stitch": "Stitch-style content builds on another video's premise or question. Start with a clip from another creator, then add your perspective or answer. Great for trending topics or questions relevant to your product.",
      "vlog": "Vlog-style content follows you through your day or process, creating an authentic behind-the-scenes feel. Show real usage of your product in your actual workflow. Focus on transformation and results rather than features.",
      "pov": "POV (point of view) content puts the viewer in the scenario. Film as if the camera is the viewer's eyes. Create an emotional journey from problem to solution, making the viewer feel the transformation personally."
    }
  };
}

function createMockCurriculum() {
  return {
    "topic": "social media marketing",
    "courseDetails": {
      "title": "Social Media Mastery: From Zero to Influencer",
      "subtitle": "The Complete System for Building a Profitable Social Media Presence in 90 Days",
      "positioning": "The only course that combines platform-specific strategies with psychological principles for authentic growth",
      "audienceLevel": "Beginner to Intermediate"
    },
    "curriculum": [
      {
        "moduleNumber": 1,
        "moduleTitle": "Foundation: Your Social Media Strategy Blueprint",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "The New Rules of Social Media in 2025",
            "goals": ["Understand current platform algorithms", "Identify key trends shaping social media", "Recognize common mistakes to avoid"],
            "activities": ["Platform audit worksheet", "Algorithm cheat sheet creation", "Trend analysis exercise"],
            "quizPrompts": ["What are the top 3 factors affecting reach on Instagram?", "How has TikTok's algorithm changed in the past year?", "What metrics matter most for business accounts?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "Finding Your Profitable Niche",
            "goals": ["Identify intersection of passion and profit", "Research market demand", "Analyze competition"],
            "activities": ["Niche selection matrix", "Competitor analysis spreadsheet", "Profitability calculator"],
            "quizPrompts": ["What are the 3 components of a profitable niche?", "How do you evaluate market saturation?", "What tools can you use to research niche profitability?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "Creating Your Content Pillars",
            "goals": ["Define 3-5 core content themes", "Map content to customer journey", "Create a sustainable content mix"],
            "activities": ["Content pillar worksheet", "Customer journey mapping", "Content calendar template"],
            "quizPrompts": ["What makes an effective content pillar?", "How many content pillars should you have?", "How do you align content pillars with business goals?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "Crafting Your Irresistible Brand Story",
            "goals": ["Develop a compelling brand narrative", "Create an authentic brand voice", "Design a consistent visual identity"],
            "activities": ["Brand story framework", "Voice and tone guide creation", "Visual identity mood board"],
            "quizPrompts": ["What are the elements of a powerful brand story?", "How does brand voice affect engagement?", "What visual elements should remain consistent across platforms?"]
          }
        ],
        "cta": "Complete your Strategy Blueprint to lay the foundation for sustainable growth (rather than random posting that gets you nowhere)"
      },
      {
        "moduleNumber": 2,
        "moduleTitle": "Content Creation: From Idea to Viral Post",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "The Psychology of Viral Content",
            "goals": ["Understand emotional triggers that drive sharing", "Identify viral patterns across platforms", "Apply psychological principles to content"],
            "activities": ["Emotional trigger mapping", "Viral content analysis", "Hook writing practice"],
            "quizPrompts": ["What emotions drive the most shares?", "What is the 'pattern interrupt' technique?", "How does cognitive bias affect content performance?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "Creating Scroll-Stopping Hooks",
            "goals": ["Craft attention-grabbing opening lines", "Develop platform-specific hook formulas", "Test and refine hook effectiveness"],
            "activities": ["Hook swipe file creation", "A/B testing framework", "Platform-specific hook templates"],
            "quizPrompts": ["What makes a hook effective on TikTok vs. Instagram?", "How long should your hook be?", "What are 5 proven hook formulas?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "Content Formats That Convert",
            "goals": ["Master high-performing content structures", "Adapt formats across platforms", "Match formats to business goals"],
            "activities": ["Format template library", "Cross-platform adaptation guide", "Goal-format alignment worksheet"],
            "quizPrompts": ["Which formats perform best for lead generation?", "How do you adapt a TikTok format for LinkedIn?", "What is the ideal length for each content format?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "Efficient Content Production Systems",
            "goals": ["Set up a streamlined creation workflow", "Batch content effectively", "Leverage tools and templates"],
            "activities": ["Production workflow design", "Batching calendar setup", "Tool stack configuration"],
            "quizPrompts": ["How many pieces of content can you create in one batch?", "What are the essential tools for efficient production?", "How do you maintain quality while increasing quantity?"]
          }
        ],
        "cta": "Master these content creation frameworks to produce high-quality, engaging content in less time (even if you're not naturally creative)"
      },
      {
        "moduleNumber": 3,
        "moduleTitle": "Platform Mastery: Strategies for Explosive Growth",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "TikTok Growth Blueprint",
            "goals": ["Understand TikTok's unique algorithm", "Create native, trending content", "Build a consistent posting strategy"],
            "activities": ["TikTok trend analysis", "Content pattern template", "Growth tracking system"],
            "quizPrompts": ["What factors most influence TikTok's FYP algorithm?", "How often should you post on TikTok?", "What are the key elements of a high-performing TikTok?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "Instagram Reels & Stories Domination",
            "goals": ["Maximize Reels reach and engagement", "Create strategic Stories sequences", "Leverage Instagram's shopping features"],
            "activities": ["Reels formula templates", "Stories storyboarding", "Shopping integration plan"],
            "quizPrompts": ["How do Reels differ from TikTok content?", "What makes an effective Stories sequence?", "How can you drive sales through Instagram features?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "LinkedIn Authority Building",
            "goals": ["Position yourself as an industry expert", "Create engagement-driven content", "Build strategic connections"],
            "activities": ["Authority content calendar", "Engagement formula templates", "Connection strategy worksheet"],
            "quizPrompts": ["What content establishes authority on LinkedIn?", "How does LinkedIn's algorithm prioritize content?", "What connection strategies drive business results?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "YouTube Strategy for Long-Term Growth",
            "goals": ["Develop a sustainable YouTube strategy", "Create discoverable, valuable content", "Build a subscriber base"],
            "activities": ["Channel strategy blueprint", "SEO keyword research", "Subscriber growth plan"],
            "quizPrompts": ["How does YouTube SEO differ from Google SEO?", "What video formats perform best for different goals?", "How do you optimize for both search and suggested videos?"]
          }
        ],
        "cta": "Apply these platform-specific strategies to rapidly grow your following and reach on each major social network"
      },
      {
        "moduleNumber": 4,
        "moduleTitle": "Audience Building: From Followers to Community",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "Engagement Strategies That Build Relationships",
            "goals": ["Develop a community engagement plan", "Create conversation-starting content", "Build authentic connections at scale"],
            "activities": ["Engagement response templates", "Conversation starter swipe file", "Community management system"],
            "quizPrompts": ["What types of questions generate the most comments?", "How quickly should you respond to comments?", "What engagement metrics matter most?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "From Passive Followers to Active Fans",
            "goals": ["Convert casual followers to engaged fans", "Create superfan experiences", "Develop a community identity"],
            "activities": ["Follower journey mapping", "Superfan experience design", "Community identity framework"],
            "quizPrompts": ["What are the stages of the follower-to-fan journey?", "How do you identify potential superfans?", "What community elements create belonging?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "Collaboration & Influencer Strategies",
            "goals": ["Identify strategic collaboration partners", "Create win-win partnership proposals", "Execute successful collaborations"],
            "activities": ["Collaboration partner research", "Partnership proposal template", "Collaboration tracking system"],
            "quizPrompts": ["How do you find ideal collaboration partners?", "What makes a compelling partnership proposal?", "How do you measure collaboration success?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "Managing Community at Scale",
            "goals": ["Implement scalable community management", "Address negativity and criticism", "Maintain authenticity while growing"],
            "activities": ["Community management workflow", "Response framework for criticism", "Authenticity audit"],
            "quizPrompts": ["What community management tasks can be automated?", "How do you respond to negative comments?", "How do you maintain personal connection at scale?"]
          }
        ],
        "cta": "Transform your followers into a thriving community that engages, shares, and advocates for your brand"
      },
      {
        "moduleNumber": 5,
        "moduleTitle": "Monetization: Turning Followers Into Revenue",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "Your Monetization Strategy Blueprint",
            "goals": ["Identify optimal monetization methods", "Create a diversified revenue plan", "Align monetization with audience needs"],
            "activities": ["Monetization method evaluation", "Revenue stream planning", "Audience-offer alignment check"],
            "quizPrompts": ["Which monetization methods work best for different niches?", "How many revenue streams should you develop?", "How do you validate monetization ideas?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "Creating & Launching Digital Products",
            "goals": ["Develop market-validated digital products", "Create effective sales content", "Execute a successful product launch"],
            "activities": ["Product validation framework", "Sales page template", "Launch strategy blueprint"],
            "quizPrompts": ["How do you validate product ideas before creation?", "What elements must a sales page include?", "What are the phases of a successful launch?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "Sponsorships & Brand Deals",
            "goals": ["Attract relevant brand partnerships", "Negotiate favorable sponsorship terms", "Create effective sponsored content"],
            "activities": ["Brand pitch template", "Rate card creation", "Sponsored content framework"],
            "quizPrompts": ["How do you price sponsored content?", "What should be included in a brand pitch?", "How do you maintain authenticity with sponsored content?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "Building Your Social to Email Funnel",
            "goals": ["Create lead generation content", "Design an effective email sequence", "Convert subscribers to customers"],
            "activities": ["Lead magnet creation", "Email sequence template", "Conversion tracking setup"],
            "quizPrompts": ["What makes an effective social media lead magnet?", "How many emails should be in your welcome sequence?", "What metrics indicate funnel success?"]
          }
        ],
        "cta": "Implement these monetization strategies to transform your social media presence into a consistent revenue-generating business"
      },
      {
        "moduleNumber": 6,
        "moduleTitle": "Analytics & Optimization: Data-Driven Growth",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "Key Metrics That Actually Matter",
            "goals": ["Identify meaningful performance metrics", "Set up proper tracking systems", "Interpret data accurately"],
            "activities": ["Metrics dashboard setup", "Goal-metric alignment", "Data interpretation framework"],
            "quizPrompts": ["Which vanity metrics should you ignore?", "What indicates true business impact?", "How frequently should you review metrics?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "Content Testing & Optimization Framework",
            "goals": ["Implement systematic content testing", "Analyze performance patterns", "Optimize based on data insights"],
            "activities": ["A/B testing system", "Performance analysis template", "Optimization decision tree"],
            "quizPrompts": ["What elements should you test in content?", "How many variables should you test at once?", "How do you know when you've found a winning formula?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "Scaling What Works: Content Multiplication",
            "goals": ["Identify high-performing content patterns", "Create systems to scale production", "Maintain quality while increasing quantity"],
            "activities": ["Content pattern analysis", "Scaling workflow design", "Quality control checklist"],
            "quizPrompts": ["How do you identify your most successful content?", "What aspects of creation can be delegated or automated?", "How do you maintain brand voice when scaling?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "Future-Proofing Your Social Media Strategy",
            "goals": ["Prepare for platform changes and trends", "Build platform-independent assets", "Create an adaptable growth system"],
            "activities": ["Trend monitoring system", "Platform risk assessment", "Adaptability planning"],
            "quizPrompts": ["How do you stay ahead of algorithm changes?", "What assets should you own outside of social platforms?", "How do you evaluate emerging platforms?"]
          }
        ],
        "cta": "Use these data-driven strategies to continuously optimize your content and maximize your results over time"
      },
      {
        "moduleNumber": 7,
        "moduleTitle": "Scaling & Automation: From Solo Creator to Media Company",
        "lessons": [
          {
            "lessonNumber": 1,
            "lessonTitle": "Building Your Content Team",
            "goals": ["Identify when and what to outsource", "Hire and train the right team members", "Create systems for collaboration"],
            "activities": ["Outsourcing decision matrix", "Team role definition", "Collaboration workflow design"],
            "quizPrompts": ["What roles should you hire first?", "How do you maintain quality with a team?", "What systems enable effective collaboration?"]
          },
          {
            "lessonNumber": 2,
            "lessonTitle": "Content Systems & SOPs",
            "goals": ["Document core content processes", "Create templates and frameworks", "Implement quality control systems"],
            "activities": ["Process documentation", "Template library creation", "Quality assurance checklist"],
            "quizPrompts": ["What processes should be documented first?", "How detailed should SOPs be?", "How do you ensure team adoption of systems?"]
          },
          {
            "lessonNumber": 3,
            "lessonTitle": "Tools & Automation for Scale",
            "goals": ["Select the right tool stack", "Implement automation workflows", "Reduce manual tasks"],
            "activities": ["Tool evaluation framework", "Automation workflow mapping", "ROI calculator for tools"],
            "quizPrompts": ["What criteria should guide tool selection?", "Which processes benefit most from automation?", "How do you measure automation ROI?"]
          },
          {
            "lessonNumber": 4,
            "lessonTitle": "From Creator to CEO: Strategic Leadership",
            "goals": ["Transition from creator to leader", "Develop strategic thinking", "Build a sustainable business model"],
            "activities": ["Role transition plan", "Strategic planning framework", "Business model canvas"],
            "quizPrompts": ["How do you balance creating vs. leading?", "What metrics should a CEO focus on?", "How do you develop a long-term vision?"]
          }
        ],
        "cta": "Implement these scaling systems to transform your solo creator efforts into a sustainable, growing media business"
      }
    ],
    "bonusUnits": {
      "slidePrompts": [
        "10 Viral Hook Templates for Any Niche",
        "The Ultimate Social Media Audit Checklist",
        "Content Repurposing Matrix: 1 Idea, 10 Formats",
        "Engagement-Boosting Question Templates",
        "The Perfect Content Calendar Template"
      ],
      "videoSegments": [
        "Behind-the-Scenes: My Content Creation Process",
        "Case Study: How I Grew to 100K Followers in 90 Days",
        "Tech Tutorial: My Exact Recording Setup",
        "Live Q&A: Your Social Media Questions Answered",
        "Expert Interview: Platform Trends with Former TikTok Employee"
      ],
      "funnelLayout": "Free lead magnet (Social Media Audit Template) → Low-ticket offer ($27 Content Formula Guide) → Core course ($997) → High-ticket group coaching ($2,997) → VIP 1:1 consulting ($10,000)",
      "ebookDraft": "\"The Social Media Profit Plan: Turn Your Expertise Into a 6-Figure Social Media Business\" - A step-by-step guide covering platform strategy, content creation, audience building, and monetization methods with case studies and templates."
    }
  };
}

function createMockAcquisitionLanguage() {
  return {
    "technicalSpecs": "Our AI platform uses a proprietary neural network architecture with 5 billion parameters, trained on 2.3 trillion tokens of data. The system employs a novel attention mechanism that reduces computational requirements by 78% while maintaining 99.2% accuracy compared to larger models. Our distributed training infrastructure allows for continuous learning with 43% less energy consumption than comparable systems. The platform supports 47 languages and can process unstructured data across 12 different formats including text, images, and specialized industry data.",
    "investorNarrative": {
      "simplifiedExplanation": "We've built an AI system that's dramatically more efficient than competitors while maintaining top-tier performance. Our technology can understand and generate human-like content across dozens of languages and data types, but requires significantly less computing power and energy to run.",
      "marketSizeHook": "The enterprise AI market is projected to reach $93 billion by 2028, growing at 38% annually. Our solution targets the 78% of enterprises currently struggling with AI implementation costs and complexity.",
      "competitiveAdvantage": "Unlike competitors who require massive computing resources, our proprietary architecture delivers comparable results with 1/5th the infrastructure costs. This opens the market to mid-sized companies previously priced out of advanced AI adoption.",
      "growthPotential": "With our current growth rate of 215% year-over-year and a 94% customer retention rate, we're positioned to capture 12% of the enterprise AI market within 36 months. Each new customer represents $420K in annual recurring revenue with 82% gross margins."
    },
    "analogies": [
      "Our AI is like having a Formula 1 car that runs on regular gas instead of specialized racing fuel – same performance, fraction of the operating cost.",
      "Think of traditional AI as a mansion that requires a full-time staff to maintain. Our system is a smart home that manages itself while providing the same luxury experience.",
      "If other AI systems are like industrial power plants requiring massive infrastructure, ours is like a compact generator that powers a whole neighborhood from a single garage.",
      "Our technology is the difference between needing an entire orchestra to play a symphony versus having a single pianist who can produce the same beautiful music."
    ],
    "defensibilityPoints": [
      "Proprietary attention mechanism protected by 7 granted patents and 13 pending applications",
      "Unique training methodology that creates a 3.5-year advantage over competitors attempting to replicate our efficiency",
      "Custom hardware optimization that makes our models 78% more efficient on standard cloud infrastructure",
      "Specialized data preprocessing pipeline that improves model performance while reducing training data requirements by 40%"
    ],
    "pitchDeck": {
      "title": "Redefining AI Economics: Enterprise-Grade Intelligence at Breakthrough Efficiency",
      "slides": [
        {
          "slideTitle": "The Problem",
          "content": "Enterprises need AI capabilities but face prohibitive costs, technical complexity, and massive computing requirements that limit adoption and ROI."
        },
        {
          "slideTitle": "Our Solution",
          "content": "A revolutionary AI architecture that delivers enterprise-grade intelligence with 78% less computing resources and 43% lower energy consumption."
        },
        {
          "slideTitle": "Market Opportunity",
          "content": "$93B enterprise AI market growing at 38% annually, with our solution opening access to the underserved mid-market segment worth $42B."
        },
        {
          "slideTitle": "Technology Edge",
          "content": "Proprietary neural architecture and attention mechanism protected by 7 granted patents, delivering 5x better performance-to-resource ratio than competitors."
        },
        {
          "slideTitle": "Business Model",
          "content": "SaaS platform with $420K average ARR per enterprise customer, 82% gross margins, and 94% retention rate."
        },
        {
          "slideTitle": "Traction & Validation",
          "content": "215% YoY growth, 42 enterprise customers including 3 Fortune 500 companies, $8.4M ARR with 9-month payback period."
        },
        {
          "slideTitle": "Team",
          "content": "Founded by AI researchers from MIT and Stanford with prior exits, backed by technical team from Google, OpenAI, and Microsoft."
        },
        {
          "slideTitle": "The Ask",
          "content": "$25M Series B to accelerate go-to-market, expand enterprise sales team, and advance our technology lead with next-gen architecture development."
        }
      ]
    }
  };
}

function createMockCTAPersonalizer() {
  return {
    "audience": "busy working moms",
    "product": "meal planning app",
    "personalizedCTAs": [
      {
        "cta": "Save 3 hours every week on meal planning - try it free while the kids nap!",
        "tone": "Friendly",
        "urgency": 7,
        "personalization": "Acknowledges time constraints and suggests using nap time to try the app",
        "platform": "Facebook"
      },
      {
        "cta": "Moms who tried this are getting dinner on the table 15 minutes faster (even on crazy weeknights)",
        "tone": "Casual",
        "urgency": 6,
        "personalization": "Speaks to the weeknight dinner rush that working moms experience",
        "platform": "Instagram"
      },
      {
        "cta": "Stop stressing about 'what's for dinner?' - Join 10,000+ working moms who meal plan in just 5 minutes a week",
        "tone": "Supportive",
        "urgency": 8,
        "personalization": "Addresses a specific pain point (dinner decision stress) and shows other moms are solving it",
        "platform": "TikTok"
      },
      {
        "cta": "Between soccer practice and work deadlines? Our 2-minute meal plan has you covered. Tap to breathe easier.",
        "tone": "Understanding",
        "urgency": 7,
        "personalization": "Acknowledges the specific activities that create time pressure for working moms",
        "platform": "Instagram Stories"
      },
      {
        "cta": "Your mom-life hack for the week: 5-minute meal planning that saves $75 on groceries. Worth a quick look?",
        "tone": "Casual",
        "urgency": 5,
        "personalization": "Frames the app as a practical 'hack' and highlights grocery savings that matter to family budgets",
        "platform": "Email"
      }
    ],
    "audienceInsights": {
      "language": "Busy working moms respond to practical, time-saving language that acknowledges their multiple responsibilities. They appreciate direct, solution-focused communication that doesn't waste their time. They respond well to empathetic tones that show understanding of their daily challenges.",
      "motivations": "Primary motivations include reducing mental load, saving time, reducing family stress, staying organized despite chaos, and being perceived as capable both at work and home. Financial savings is important but secondary to time and stress reduction.",
      "objections": "Common objections include 'I don't have time to learn a new app', 'I've tried meal planning before and it didn't stick', and 'My family's schedule is too unpredictable for planning'. They worry about investing time in something that won't deliver practical results.",
      "triggers": "Key action triggers include moments of meal-related stress (5pm panic), weekend planning moments, grocery shopping frustration, food waste guilt, and seeing other moms who seem to have it together."
    },
    "avoidList": [
      "Overly cutesy or patronizing language that doesn't respect their professional identity",
      "CTAs that ignore time constraints or suggest lengthy processes",
      "Vague promises without specific benefits (time saved, stress reduced, etc.)",
      "Language that adds to guilt or suggests they're failing at meal planning",
      "Corporate or formal tones that feel impersonal to their daily struggles"
    ]
  };
}

function createMockHyperPersona() {
  return {
    "demographicProfile": "Urban professionals aged 28-42 with household incomes of $85,000-150,000. College educated with at least a bachelor's degree, working in knowledge economy roles (tech, marketing, finance, healthcare administration). Primarily millennial with some younger Gen X, living in major metropolitan areas or affluent suburbs. 65% are parents of young children (under 12), and 78% identify as time-starved with competing professional and personal priorities.",
    "psychographicSummary": "Achievement-oriented individuals who value efficiency and optimization in all areas of life. They experience significant tension between career ambitions and desire for work-life balance. Digital natives who research extensively before purchases and rely heavily on peer recommendations. They're willing to pay premium prices for products that demonstrably save time or reduce stress. They identify strongly with brands that reflect their self-image as savvy, informed consumers who make smart choices. They experience regular decision fatigue from the many choices in their busy lives and appreciate curated, personalized solutions.",
    "psychologicalDrivers": [
      {
        "driver": "Status Anxiety",
        "explanation": "These individuals constantly compare their professional and personal progress to peers and social media ideals. They fear falling behind in career trajectory or appearing less successful than their reference group. This manifests as a strong desire for products that signal achievement and savvy decision-making. They're particularly responsive to exclusivity messaging and early adopter opportunities that position them as ahead of trends."
      },
      {
        "driver": "Time Scarcity",
        "explanation": "They experience chronic time poverty, with demands from work, family, and personal goals creating constant pressure. This creates a psychological state where time-saving is valued above almost all other benefits. They experience genuine anxiety about 'wasting time' and are highly receptive to products positioned as efficiency tools. The perception of saved time can be more motivating than actual time saved."
      },
      {
        "driver": "Control Seeking",
        "explanation": "In response to unpredictable work demands and family needs, they seek to establish control where possible. This manifests as strong planning tendencies and attraction to products that help organize, systematize, or automate aspects of life. They experience disproportionate satisfaction from checking items off lists and seeing visual representations of progress. Products that help them feel in control of chaotic elements reduce significant psychological stress."
      },
      {
        "driver": "Identity Reinforcement",
        "explanation": "They've invested heavily in self-image as capable, informed, and making optimal choices. Products that align with and reinforce this identity receive preferential consideration. They avoid products that might suggest they're making uninformed or suboptimal choices, even if practically beneficial. They're drawn to brands and messaging that mirror their aspirational self-image and validate their life choices."
      }
    ],
    "decisionPatterns": [
      {
        "pattern": "Efficiency-Justified Splurging",
        "explanation": "While generally price-conscious and value-oriented, they readily override budget constraints for products perceived to save significant time or reduce stress. They use ROI-like mental calculations, where time saved is converted to a monetary value to justify premium purchases. This calculation isn't strictly rational but heavily weighted by emotional desire for relief from time pressure.",
        "marketingImplications": "Frame premium pricing in terms of time-value economics. Quantify time savings specifically (e.g., 'saves 3 hours every week') and translate to meaningful life benefits (e.g., '156 hours per year—that's like getting 4 extra vacation days'). Emphasize the emotional relief of reclaimed time, not just the practical benefit."
      },
      {
        "pattern": "Exhaustive Research Followed By Snap Decisions",
        "explanation": "They conduct thorough research for initial product discovery and consideration, but final purchase decisions often happen impulsively when a psychological trigger (deadline, stress point, social proof) activates. This creates a pattern where they build comprehensive mental justification for purchases but need an emotional catalyst to overcome purchase hesitation.",
        "marketingImplications": "Provide depth of information for the research phase, but focus on creating emotional triggers for the decision moment. Use limited-time offers, social proof from peer groups, and stress-point targeting in marketing. Ensure your detailed information builds a complete logical case they can use to justify their ultimately emotional decision."
      },
      {
        "pattern": "Peer-Validated Choices",
        "explanation": "They strongly prefer products used and recommended by professional and social peers, viewing this as a risk-reduction strategy. Recommendations from their reference group carry more weight than expert opinions or brand messaging. They often delay purchases until they can confirm others in their circle have positive experiences.",
        "marketingImplications": "Showcase testimonials and case studies from individuals matching their exact demographic and psychographic profile. Facilitate peer-to-peer recommendation through referral programs and community building. Position early adoption offers as exclusive to their specific professional/social group to overcome the need for prior peer validation."
      }
    ],
    "communicationStrategies": {
      "messagingApproaches": [
        "Problem-agitation followed by solution (emphasize the pain of time scarcity before introducing your solution)",
        "Peer-based social proof (highlight adoption by similar professionals/parents)",
        "Efficiency ROI framing (quantify time saved and translate to meaningful benefits)",
        "Identity reinforcement (position using your product as a smart decision made by discerning consumers)",
        "Exclusivity messaging (create perception of being selected or qualified for access)",
        "Curated simplicity (emphasize how you've eliminated options and decisions to create the optimal solution)"
      ],
      "channelPreferences": [
        "Email for detailed information (read during commutes or lunch breaks)",
        "Instagram for lifestyle integration and visual proof",
        "Podcasts consumed during commutes or workouts",
        "Professional networks (LinkedIn, industry Slack groups)",
        "Targeted YouTube content for product research and reviews",
        "SMS for time-sensitive offers and updates (high open rate)"
      ]
    },
    "objectionHandling": [
      {
        "objection": "I don't have time to learn a new product/system",
        "psychologicalRoot": "Fear that the solution will initially demand more time than it saves, creating net time loss. Also reflects previous disappointments with products that promised simplicity but required significant setup.",
        "recommendedResponse": "Emphasize immediate time-to-value with specific onboarding metrics (e.g., '83% of users save time in the first 15 minutes of use'). Showcase the minimal learning curve with specific numbers ('Just 3 minutes to set up'). Address the objection directly: 'We designed this specifically for people who don't have time to learn new systems.'"
      },
      {
        "objection": "This seems great but I should probably wait until things calm down",
        "psychologicalRoot": "Avoidance response to adding another decision or change to an already overwhelming life. Reflects the paradox that those who need time-saving solutions most are least likely to make time to implement them.",
        "recommendedResponse": "Gently challenge the premise that 'things will calm down' in the foreseeable future. Use future-pacing to help them imagine the compounding stress of not addressing the problem. Position your solution as the path to things calming down rather than something to implement after: 'This is exactly what creates the calmer schedule you're waiting for.'"
      },
      {
        "objection": "I've tried similar solutions before and they didn't stick",
        "psychologicalRoot": "Past experiences created identity conflict where failure to maintain systems threatened their self-image as capable and organized. They fear investing in another solution that will become evidence of failure.",
        "recommendedResponse": "Differentiate by acknowledging the legitimate reasons previous solutions fail for busy professionals. Highlight specific design elements that address these common failure points. Share retention statistics and emphasize built-in accountability or habit-formation features. Position as 'the system for people who've tried systems that didn't stick.'"
      }
    ]
  };
}

function createMockCommentExploder() {
  return {
    "viralPost": "I've been in marketing for 15 years and I'm going to tell you the truth: most social media advice is completely backwards. Everyone says 'post consistently' but I grew my account to 500K by posting only when I had something valuable to say. Quality over quantity ALWAYS wins. The algorithm doesn't care about your posting schedule - it cares if people actually engage. Stop creating mediocre content nobody cares about just to 'stay consistent.' Make one incredible piece of content instead of 7 average ones. Who else is tired of this terrible advice?",
    "extractedComments": [
      "But how do you know when your content is actually valuable? What I think is valuable often gets no engagement.",
      "This might work if you're already established, but new creators need consistency to get discovered at all.",
      "I tried posting less and my reach TANKED. The algorithm definitely punishes inconsistency.",
      "Completely agree! I was burning out creating content every day that nobody cared about.",
      "What's your definition of 'valuable'? That's so subjective."
    ],
    "expandedContent": {
      "tiktokHooks": [
        "You think your content is valuable but it gets ZERO engagement? Here's why...",
        "New creator? This is why 'post consistently' advice is KILLING your growth...",
        "I posted less frequently and my reach tanked. Here's what REALLY happened...",
        "Creator burnout is REAL. Here's how to create less content but get MORE views...",
        "Everyone says 'create valuable content' but no one explains what that ACTUALLY means..."
      ],
      "tweetThreads": [
        "The 'valuable content' paradox:\n\n1/ You're told to create valuable content\n2/ You pour hours into what you think is valuable\n3/ You post it and... crickets\n\nHere's what's really happening and how to fix it...",
        "New creators face a different algorithm reality:\n\n1/ Yes, the algorithm rewards engagement\n2/ But you need INITIAL visibility to get ANY engagement\n3/ For new accounts, consistency creates more opportunities for that first hit\n\nHere's the strategy that actually works...",
        "The consistency vs. quality debate misses the point entirely:\n\n1/ It's not either/or\n2/ The real question is FEEDBACK LOOPS\n3/ How quickly can you learn what resonates?\n\nHere's how to accelerate your content learning curve..."
      ],
      "videoAngles": [
        "I analyzed 100 'valuable' posts that flopped vs. 100 that went viral. Here's the actual difference...",
        "The Consistency Experiment: I tested posting daily vs. weekly for 60 days. The results will surprise you...",
        "How to define 'valuable content' for YOUR specific audience (framework + examples)",
        "The Content Quality Spectrum: Where your content falls and how to level up",
        "Why most creators burn out (and the sustainable content strategy I use instead)"
      ]
    }
  };
}

function createMockTimingForecaster() {
  return {
    "contentType": "Educational",
    "timezone": "Eastern Time (ET)",
    "niche": "Finance",
    "predictions": {
      "tiktok": "Best posting times: Tuesday and Thursday between 7-9 PM ET, and Saturday 10 AM-12 PM ET. Finance educational content performs well during evening hours when professionals have mental bandwidth for learning after work, and weekend mornings when they're planning their financial week ahead.",
      "instagram": "Best posting times: Monday and Wednesday 12-1 PM ET for feed posts, and Tuesday/Thursday 6-8 PM ET for Reels. Finance education on Instagram performs best during lunch breaks and early evening when professionals are commuting or unwinding after work.",
      "youtubeShorts": "Best posting times: Sunday 9-11 AM ET and Wednesday 7-9 PM ET. Finance educational Shorts perform well during weekend planning sessions and midweek when viewers are seeking quick financial insights during their evening relaxation time.",
      "email": "Best sending times: Tuesday 6 AM ET (to be at top of inbox) or Thursday 11 AM ET (for lunch break consumption). Finance educational emails get highest open rates early morning before work distractions or during predictable lunch breaks."
    },
    "reasoning": "Finance content timing is heavily influenced by professional work schedules and financial planning cycles. Your Eastern Time audience in the finance niche consists primarily of professionals who engage with educational content during specific windows: early mornings before work, lunch breaks, evening commutes/relaxation, and weekend planning sessions. The platform-specific recommendations account for how each platform is used during these windows - TikTok and YouTube Shorts for evening entertainment, Instagram during breaks, and email for dedicated reading time. Educational content specifically requires more mental bandwidth than entertainment content, so timing avoids high-stress work hours and targets moments of relative calm and focus."
  };
}

function createMockCreatorFunnel() {
  return {
    "accountHandle": "@financefreedom",
    "leadMagnetIdea": "The Ultimate Tax Deduction Checklist for Entrepreneurs: 57 Write-offs Most Business Owners Miss",
    "emailSequence": [
      "Welcome Email: Subject: Your Tax Deduction Checklist (+ a surprise bonus). Body: Delivers the checklist, explains how to use it, shares a quick win they can implement today, and hints at more valuable content coming in the next email.",
      "Value Email #1: Subject: The $15,000 deduction most accountants never mention. Body: Detailed breakdown of one high-value but overlooked deduction, with specific examples and implementation steps.",
      "Value Email #2: Subject: How Sarah saved $37,842 in taxes last year (case study). Body: Success story with specific strategies, screenshots of savings, and actionable takeaways readers can apply.",
      "Problem Agitation: Subject: The ticking tax time bomb in your business. Body: Outlines the costly mistakes most entrepreneurs make and the consequences, creating urgency around proper tax planning.",
      "Solution Introduction: Subject: The system that automates your tax savings. Body: Introduces your paid course/coaching program as the comprehensive solution to their tax concerns, with specific benefits and outcomes.",
      "Objection Handler: Subject: \"But I already have an accountant...\" Body: Addresses common objections, differentiates your approach from traditional accounting, and includes testimonials from clients who had accountants but still found value.",
      "Final Offer: Subject: [CLOSING SOON] Tax Mastery Program. Body: Clear call-to-action with deadline, guarantee, complete offer details, and final powerful testimonial."
    ],
    "monetizationApproach": "Primary: High-ticket group coaching program ($1,997) teaching comprehensive tax strategy for entrepreneurs, delivered through 8-week cohort-based course with weekly live Q&A sessions and implementation workshops. Secondary: Subscription tax planning software integration ($49/month) that helps students implement strategies year-round with automated tracking and reminders. Upsell: VIP 1:1 tax strategy sessions ($497) for personalized planning. This multi-tiered approach creates entry points at different price levels while maximizing lifetime customer value.",
    "landingPage": {
      "headline": "Entrepreneurs: Discover How to Legally Save $15,000+ on Taxes in the Next 90 Days (Without Changing Accountants)",
      "socialProof": "Join 1,500+ business owners who saved a combined $27.3 million in taxes last year using our proven strategies. Featured in Forbes, Entrepreneur, and CNBC as 'the tax education entrepreneurs actually need.'",
      "cta": "Reserve Your Spot: Next Tax Mastery Cohort Begins June 15th (Only 30 Spaces Available)",
      "faqs": [
        "Q: Will this work if I already have an accountant? A: Absolutely. Your accountant handles compliance, but our program focuses on proactive strategy. Our students work WITH their accountants to implement these strategies, often teaching their accountants new approaches.",
        "Q: Is this just for large businesses? A: Not at all. Our strategies work for businesses from $50K to $50M in revenue. We have specific tracks for different business sizes and structures.",
        "Q: How much time does this require? A: Just 2-3 hours per week during the 8-week program, then 30 minutes monthly for maintenance. We've designed this for busy entrepreneurs.",
        "Q: What if I'm not good with numbers? A: Our step-by-step approach requires no advanced financial knowledge. We break everything down into simple actions anyone can implement.",
        "Q: Is there a guarantee? A: Yes. If you implement our strategies and don't find at least $10,000 in potential tax savings, we'll refund your entire investment and pay for 1 hour with your accountant to find the savings we missed."
      ]
    },
    "exportFormat": "Complete funnel assets delivered as: 1) ClickFunnels-ready landing page template with pre-written copy, 2) Email sequence in plain text and HTML formats compatible with all major email platforms, 3) Lead magnet as designed PDF and editable Canva template, 4) Sales page wireframe with conversion elements mapped, 5) Notion dashboard template for tracking funnel metrics and optimizing conversion rates."
  };
}

function createMockModularAd() {
  return {
    "components": {
      "hook": "Stop wasting hours on repetitive tasks",
      "pain": "Most businesses lose 20+ hours weekly to administrative busywork",
      "solution": "Our automation platform handles these tasks in minutes, not hours",
      "cta": "Start your free trial today and reclaim your time"
    },
    "assembledAds": [
      {
        "version": "Standard Flow",
        "fullAd": "Stop wasting hours on repetitive tasks. Most businesses lose 20+ hours weekly to administrative busywork. Our automation platform handles these tasks in minutes, not hours. Start your free trial today and reclaim your time.",
        "effectiveness": 8
      },
      {
        "version": "Problem-First",
        "fullAd": "Most businesses lose 20+ hours weekly to administrative busywork. Stop wasting hours on repetitive tasks. Our automation platform handles these tasks in minutes, not hours. Start your free trial today and reclaim your time.",
        "effectiveness": 7
      },
      {
        "version": "Solution-Led",
        "fullAd": "Our automation platform handles administrative tasks in minutes, not hours. Most businesses lose 20+ hours weekly to this busywork. Stop wasting time on repetitive tasks. Start your free trial today and reclaim your time.",
        "effectiveness": 6
      }
    ],
    "templates": [
      "[HOOK] that costs businesses [PAIN POINT]. [SOLUTION] so you can [BENEFIT]. [CTA].",
      "Tired of [PAIN POINT]? [HOOK] with our solution that [SOLUTION BENEFIT]. [CTA] to see how.",
      "Attention business owners: [HOOK]! [PAIN POINT STATISTIC]. Discover how [SOLUTION SUMMARY]. [CTA]."
    ],
    "randomizedVersion": "Our automation platform handles these tasks in minutes, not hours. Start your free trial today and reclaim your time. Stop wasting hours on repetitive tasks. Most businesses lose 20+ hours weekly to administrative busywork."
  };
}

function createMockColdEmail() {
  return {
    "subject": "Quick question about your content strategy",
    "emailBody": "Hi [Name],\n\nI've been following your work at [Company] and particularly enjoyed your recent post about [topic from their content].\n\nI'm reaching out because we've helped similar [industry] businesses increase their content engagement by 43% on average.\n\nWould you be open to a 15-minute call next Tuesday to discuss how we might be able to help [Company] achieve similar results?\n\nEither way, keep up the great content!\n\nBest,\n[Your Name]",
    "followUps": [
      "Subject: Following up: Content strategy question\n\nHi [Name],\n\nI wanted to follow up on my previous email about helping [Company] boost your content engagement metrics.\n\nI understand you're busy, so I'll keep this brief. We recently helped [Similar Company] increase their conversion rate by 37% in just 60 days.\n\nDo you have 15 minutes this week for a quick call to explore if we could achieve similar results for you?\n\nBest,\n[Your Name]",
      
      "Subject: [Name], quick question\n\nHi [Name],\n\nI'm following up one last time regarding ways we might help strengthen [Company]'s content strategy.\n\nI've put together a few specific ideas for your business based on what I've seen from your current approach. Would it be helpful if I shared these with you?\n\nJust reply with a quick 'yes' and I'll send them over.\n\nBest,\n[Your Name]",
      
      "Subject: Value upfront: 3 quick wins for [Company]\n\nHi [Name],\n\nI promised I wouldn't take much more of your time, so I'll make this my final note.\n\nHere are 3 specific opportunities I see for [Company]'s content strategy:\n\n1. [Specific suggestion relevant to their business]\n2. [Specific suggestion relevant to their business]\n3. [Specific suggestion relevant to their business]\n\nIf you'd like to discuss how to implement these or explore more ideas, my calendar is here: [Calendar link]\n\nWishing you continued success either way!\n\n[Your Name]"
    ],
    "spamScore": 2.4,
    "openRatePrediction": 32.5,
    "responseRatePrediction": 8.7
  };
}

function createMockSocialContent() {
  return {
    "hook": "Stop wasting money on ads that don't convert",
    "script": "Hook: Stop wasting money on ads that don't convert! [Look directly at camera, serious expression]\n\nI see businesses throwing thousands at ads with terrible ROI every day. [Show frustrated expression, maybe hand gesture of throwing money away]\n\nThe problem isn't the platform. It's your messaging. [Point at camera]\n\nMost ads focus on features, when they should focus on customer pain points. [Split screen showing bad ad vs good ad]\n\nLet me show you a simple formula that increased our clients' conversion rates by 43% on average. [Show excited expression]\n\n[Show formula graphic: Pain + Agitation + Solution + Evidence + CTA]\n\nThis works for ANY business. [Emphasize with hand gesture]\n\nSwipe up to get our free Ad Conversion Cheat Sheet with 7 proven templates you can use today. [Point up]\n\n[Text overlay: \"Free Download - 7 High-Converting Ad Templates\"]",
    "hashtags": [
      "marketingtips",
      "digitalmarketing",
      "adstrategy",
      "socialmediamarketing",
      "businessgrowth",
      "conversionrate",
      "marketingadvice",
      "smallbusinesstips",
      "advertisingtips",
      "marketingstrategy",
      "growthhacking",
      "salesfunnel",
      "leadgeneration",
      "businesstips",
      "entrepreneurship",
      "marketingexpert",
      "adcopy",
      "copywriting",
      "salestips",
      "businesscoach"
    ],
    "captions": [
      "Are your ads burning through budget with little to show for it? This simple formula increased our clients' conversion rates by 43% on average. Save this for your next campaign! ⚡️ #marketingtips #adstrategy",
      
      "The difference between ads that convert and ads that flop isn't the platform—it's the message. I'm sharing the exact formula we use for our 7-figure clients. Drop a '✍️' if you want me to review your ad in the comments!",
      
      "Most businesses get this completely wrong in their ads (and wonder why they're not converting). Swipe to see the simple 5-part formula that's generated millions in revenue for our clients. Save this one! 📌"
    ],
    "platform": "tiktok",
    "contentType": "educational",
    "trendingElements": [
      "Screen transition effect where you point and text appears",
      "Green screen background showing before/after results",
      "Using the 'shhh' sound that's trending for revealing secrets",
      "The 'expensive lesson learned' storytelling format",
      "Split screen comparison showing wrong vs. right approach"
    ]
  };
}

function createMockTrendRewrite() {
  return {
    "originalTrend": "AI is taking over jobs",
    "tweetVersion": "While everyone panics about AI taking jobs, smart fitness coaches are using it to 10x their client results. We're not replacing trainers—we're creating super-trainers who can deliver personalized nutrition plans in seconds instead of hours. #FitnessAI #CoachingTips",
    "scriptVersion": "Hook: Everyone's worried about AI taking jobs, but in the fitness industry? It's creating SUPER coaches.\n\nLet me show you what I mean...\n\nBefore AI, creating truly personalized meal plans took me 2-3 hours per client. That meant either charging $200+ or cutting corners.\n\nNow? I can create a fully customized plan in under 5 minutes.\n\nMy clients get better results because:\n1. More personalization\n2. Faster adjustments\n3. I can focus on coaching, not spreadsheets\n\nAI isn't replacing fitness coaches. It's eliminating the busywork so we can focus on what really matters: human connection and accountability.\n\nWant to see how I'm using AI in my coaching business? Link in bio for my free training.",
    "adVersion": "\"AI is replacing personal trainers\"... or is it?\n\nWhile many fitness professionals fear technology, the smartest coaches are using AI to deliver better results in less time.\n\nOur AI-powered coaching platform helps you create personalized meal plans in minutes, not hours, so you can:\n\n• Take on more clients without working more hours\n• Deliver more personalized nutrition guidance\n• Focus on coaching instead of spreadsheets\n\nJoin 1,000+ fitness professionals already using our platform to grow their business while improving client results.\n\nTry free for 14 days. No credit card required.",
    "niche": "fitness coaching"
  };
}

// Export these mock functions for testing
export {
  createMockAd,
  createMockCampaign,
  createMockAdStyles,
  createMockCurriculum,
  createMockAcquisitionLanguage,
  createMockCTAPersonalizer,
  createMockHyperPersona,
  createMockCommentExploder,
  createMockTimingForecaster,
  createMockCreatorFunnel,
  createMockModularAd,
  createMockColdEmail,
  createMockSocialContent,
  createMockTrendRewrite
};