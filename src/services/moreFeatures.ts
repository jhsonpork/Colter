import { 
  OfferAngleMatcher,
  HookFrameTester,
  CreatorFunnelBuilder,
  CourseSummaryGenerator,
  CommentExploder,
  ViralCTASequencer,
  PlatformTimingForecaster,
  ContentEthicsSanitizer,
  ValueLadderBuilder,
  MonetizationGenerator,
  ContentFrameworkBuilder,
  CourseCurriculumBuilder,
  // 10 NEW FEATURES
  ZeroToStartupEngine,
  ContentCalendarGenerator,
  PromptDebugger,
  OnePersonAgencyAutomator,
  ProductLaunchFlow,
  FailureAnalyzer,
  IncomeStreamGenerator,
  InfographicWizard,
  DigitalProductGenerator,
  CreatorCollabConnector
} from '../types/moreFeatures';
import { callGeminiAPI } from './gemini';

// 1. Offer Angle Matcher
export const matchOfferAngles = async (product: string): Promise<OfferAngleMatcher> => {
  const prompt = `
You are an offer optimization expert. Match this product to 7 proven offer types.

Product: "${product}"

Generate offer angle analysis in JSON format:
{
  "product": "${product}",
  "offerAngles": [
    {
      "type": "Free Trial/Limited-Time Guarantee/Bundle Stack/Price Anchor/Community Challenge/Scarcity Offer/Premium Positioning",
      "headline": "compelling headline for this offer type",
      "subheadline": "supporting subheadline",
      "primaryCTA": "main call-to-action",
      "hook": "opening hook for this offer",
      "effectiveness": score out of 10,
      "bestFor": "when to use this offer type"
    }
  ],
  "recommendations": {
    "virality": "best offer type for viral content",
    "conversion": "best offer type for conversions",
    "ltv": "best offer type for lifetime value"
  },
  "currentOfferDiagnosis": "analysis of why current offers might not be working"
}

Create all 7 offer types with complete copy for each.
`;

  return await callGeminiAPI(prompt);
};

// 2. Hook + Frame Split Tester
export const testHookFrames = async (hooks: string[]): Promise<HookFrameTester> => {
  const prompt = `
You are a TikTok performance expert. Test these hooks for scroll-stopping power.

Hooks to Test: ${hooks.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

Generate hook frame test in JSON format:
{
  "hooks": [
    {
      "text": "hook text exactly as provided",
      "thumbnail": "suggested thumbnail description",
      "ctrPotential": score out of 10,
      "curiosityGap": score out of 10,
      "scrollStickiness": score out of 10,
      "predictedScrollTime": seconds before scroll,
      "improvements": {
        "betterOpeningShot": "improved opening shot suggestion",
        "rewrittenHook": "rewritten hook for better retention"
      }
    }
  ],
  "bestPerformer": "best performing hook text",
  "worstPerformer": "worst performing hook text"
}

Focus on the critical first 1.5 seconds that determine retention.
`;

  return await callGeminiAPI(prompt);
};

// 3. Instant Creator Funnel Builder
export const buildCreatorFunnel = async (accountHandle: string): Promise<CreatorFunnelBuilder> => {
  const prompt = `
You are a creator monetization expert. Build a complete funnel for this creator.

Account Handle: "${accountHandle}"

Generate creator funnel in JSON format:
{
  "accountHandle": "${accountHandle}",
  "leadMagnetIdea": "lead magnet idea based on typical audience for this type of account",
  "emailSequence": ["7 email sequence parts"],
  "monetizationApproach": "best monetization strategy (coaching/product/service/course)",
  "landingPage": {
    "headline": "compelling landing page headline",
    "socialProof": "social proof section",
    "cta": "main call-to-action",
    "faqs": ["5 common FAQs and answers"]
  },
  "exportFormat": "formatted layout description for ClickFunnels/Notion"
}

IMPORTANT: All fields must be strings or arrays of strings, not nested objects. Each field in the landingPage object must be a string, and faqs must be an array of strings.
Create a complete funnel that converts influence to income.
`;

  try {
    const result = await callGeminiAPI(prompt);
    console.log("buildCreatorFunnel raw result:", result);
    
    // Validate the result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format from API');
    }
    
    // Ensure all required fields are present and have the correct types
    const validatedResult: CreatorFunnelBuilder = {
      accountHandle: typeof result.accountHandle === 'string' ? result.accountHandle : accountHandle,
      
      leadMagnetIdea: typeof result.leadMagnetIdea === 'string' ? result.leadMagnetIdea : 
        `"The Ultimate ${accountHandle} Guide: 5 Strategies That Transformed My Business" - A comprehensive PDF guide that showcases your expertise while providing immediately actionable value to your audience.`,
      
      emailSequence: Array.isArray(result.emailSequence) ? result.emailSequence.map(email => 
        typeof email === 'string' ? email : JSON.stringify(email)
      ) : [
        "Welcome Email: Thank your subscriber for downloading the guide, introduce yourself briefly, and set expectations for what they'll receive from you. Include one quick win they can implement immediately.",
        "Value Email: Share a case study or success story related to your guide's topic. Focus entirely on providing value without any selling.",
        "Problem Email: Dig deeper into the main challenge your audience faces, agitating the pain points and showing you truly understand their situation.",
        "Solution Email: Introduce your paid offering as the comprehensive solution to the problems you've discussed. Include specific benefits and transformation points.",
        "Testimonial Email: Share 2-3 powerful testimonials from clients who've achieved results with your offering. Address common objections indirectly through these stories.",
        "Objection Email: Directly address the top 3 objections people have about your offering, with honest and thoughtful responses to each concern.",
        "Closing Email: Make your final offer with a specific deadline or special bonus that expires soon. Remind them of the transformation they'll experience."
      ],
      
      monetizationApproach: typeof result.monetizationApproach === 'string' ? result.monetizationApproach : 
        `Based on your content style and audience, a signature course or coaching program would be your optimal monetization path. Package your expertise into a structured learning experience with clear outcomes. Price it at a premium ($997-$1997) to attract serious students and position yourself as a high-value expert in your field.`,
      
      landingPage: {
        headline: typeof result.landingPage?.headline === 'string' ? result.landingPage.headline : 
          `Transform Your Results With The Proven ${accountHandle} Method`,
        
        socialProof: typeof result.landingPage?.socialProof === 'string' ? result.landingPage.socialProof : 
          `"Join over 1,000 successful students who have used the ${accountHandle} Method to achieve [specific result] in just [timeframe]." Include 3-5 testimonial snippets with photos and specific results.`,
        
        cta: typeof result.landingPage?.cta === 'string' ? result.landingPage.cta : 
          "Secure Your Spot: Join The Next Cohort Today (Limited to 50 Participants)",
        
        faqs: Array.isArray(result.landingPage?.faqs) ? result.landingPage.faqs.map(faq => 
          typeof faq === 'string' ? faq : JSON.stringify(faq)
        ) : [
          "How much time will I need to commit each week? The program requires approximately 3-5 hours per week for optimal results, but all materials are yours to keep and work through at your own pace.",
          "What if I'm just starting out? This program is designed for both beginners and experienced practitioners. We provide additional resources for newcomers to ensure everyone can implement the strategies effectively.",
          "How long until I see results? While everyone's journey is different, most students begin seeing measurable improvements within the first 30 days of implementing our framework.",
          "Do you offer a guarantee? Yes! We offer a 14-day satisfaction guarantee. If you complete the first two modules and don't feel the program is right for you, we'll refund your investment.",
          "Will I have direct access to you? Yes! The program includes bi-weekly group coaching calls where you can ask questions and get personalized feedback on your implementation."
        ]
      },
      
      exportFormat: typeof result.exportFormat === 'string' ? result.exportFormat : 
        "This funnel can be easily implemented using ClickFunnels, Kajabi, or even a simple combination of Convertkit (for emails) and Thinkific (for course hosting). All templates are provided in a Notion workspace for easy customization and deployment."
    };
    
    return validatedResult;
  } catch (error) {
    console.error('Error in buildCreatorFunnel:', error);
    
    // Return a fallback response with the correct structure
    return {
      accountHandle: accountHandle,
      leadMagnetIdea: `"The Ultimate ${accountHandle} Guide: 5 Strategies That Transformed My Business" - A comprehensive PDF guide that showcases your expertise while providing immediately actionable value to your audience.`,
      emailSequence: [
        "Welcome Email: Thank your subscriber for downloading the guide, introduce yourself briefly, and set expectations for what they'll receive from you. Include one quick win they can implement immediately.",
        "Value Email: Share a case study or success story related to your guide's topic. Focus entirely on providing value without any selling.",
        "Problem Email: Dig deeper into the main challenge your audience faces, agitating the pain points and showing you truly understand their situation.",
        "Solution Email: Introduce your paid offering as the comprehensive solution to the problems you've discussed. Include specific benefits and transformation points.",
        "Testimonial Email: Share 2-3 powerful testimonials from clients who've achieved results with your offering. Address common objections indirectly through these stories.",
        "Objection Email: Directly address the top 3 objections people have about your offering, with honest and thoughtful responses to each concern.",
        "Closing Email: Make your final offer with a specific deadline or special bonus that expires soon. Remind them of the transformation they'll experience."
      ],
      monetizationApproach: `Based on your content style and audience, a signature course or coaching program would be your optimal monetization path. Package your expertise into a structured learning experience with clear outcomes. Price it at a premium ($997-$1997) to attract serious students and position yourself as a high-value expert in your field.`,
      landingPage: {
        headline: `Transform Your Results With The Proven ${accountHandle} Method`,
        socialProof: `"Join over 1,000 successful students who have used the ${accountHandle} Method to achieve [specific result] in just [timeframe]." Include 3-5 testimonial snippets with photos and specific results.`,
        cta: "Secure Your Spot: Join The Next Cohort Today (Limited to 50 Participants)",
        faqs: [
          "How much time will I need to commit each week? The program requires approximately 3-5 hours per week for optimal results, but all materials are yours to keep and work through at your own pace.",
          "What if I'm just starting out? This program is designed for both beginners and experienced practitioners. We provide additional resources for newcomers to ensure everyone can implement the strategies effectively.",
          "How long until I see results? While everyone's journey is different, most students begin seeing measurable improvements within the first 30 days of implementing our framework.",
          "Do you offer a guarantee? Yes! We offer a 14-day satisfaction guarantee. If you complete the first two modules and don't feel the program is right for you, we'll refund your investment.",
          "Will I have direct access to you? Yes! The program includes bi-weekly group coaching calls where you can ask questions and get personalized feedback on your implementation."
        ]
      },
      exportFormat: "This funnel can be easily implemented using ClickFunnels, Kajabi, or even a simple combination of Convertkit (for emails) and Thinkific (for course hosting). All templates are provided in a Notion workspace for easy customization and deployment."
    };
  }
};

// 4. AI Course Summary Generator
export const generateCourseSummary = async (syllabus: string): Promise<CourseSummaryGenerator> => {
  const prompt = `
You are a content reverse-engineering expert. Create content from this course syllabus.

Syllabus: "${syllabus}"

Generate course summary content in JSON format:
{
  "syllabus": "${syllabus}",
  "summary": {
    "threeMinuteScript": "3-minute YouTube/TikTok summary script",
    "scriptHooks": ["5 hooks for short-form content based on course"],
    "leadMagnet": "1-page lead magnet based on core takeaway",
    "infoproductSuggestions": ["3 infoproduct ideas to monetize this angle"]
  }
}

Make the creator look like a seasoned educator instantly.
`;

  return await callGeminiAPI(prompt);
};

// 5. Comment Exploder
export const explodeComments = async (viralPost: string): Promise<CommentExploder> => {
  const prompt = `
You are a viral content analyst. Extract and expand comments from this post.

Viral Post: "${viralPost}"

Generate comment explosion in JSON format:
{
  "viralPost": "${viralPost}",
  "extractedComments": ["5 most engaging comment types this post would generate"],
  "expandedContent": {
    "tiktokHooks": ["5 TikTok hooks based on comment themes"],
    "tweetThreads": ["3 tweet thread outlines from comment insights"],
    "videoAngles": ["5 short-form video angles from comment patterns"]
  }
}

Turn viral engagement patterns into new content opportunities.
IMPORTANT: All fields must be strings or arrays of strings, not nested objects.
`;

  try {
    const result = await callGeminiAPI(prompt);
    console.log("explodeComments raw result:", result);
    
    // Validate the result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format from API');
    }
    
    // Ensure all required fields are present and have the correct types
    const validatedResult: CommentExploder = {
      viralPost: typeof result.viralPost === 'string' ? result.viralPost : viralPost,
      
      extractedComments: Array.isArray(result.extractedComments) ? result.extractedComments.map(comment => 
        typeof comment === 'string' ? comment : JSON.stringify(comment)
      ) : [
        "This completely changed how I think about [topic]! I've been doing it wrong for years!",
        "Wait, but what about [common objection]? Has anyone tried this approach with that situation?",
        "I tried something similar and got [specific result]. The key was consistency over time.",
        "Can you make a follow-up video about [related topic]? I need more details on that part!",
        "This is why I follow you! No one else explains [topic] this clearly. Saving this for later!"
      ],
      
      expandedContent: {
        tiktokHooks: Array.isArray(result.expandedContent?.tiktokHooks) ? result.expandedContent.tiktokHooks.map(hook => 
          typeof hook === 'string' ? hook : JSON.stringify(hook)
        ) : [
          "You've been doing [topic] all wrong - here's what the experts don't tell you...",
          "The most common objection to [approach] is [objection]. Here's how to overcome it...",
          "Want to get [specific result] like my followers? The secret isn't what you think...",
          "You asked for more details on [related topic] - here's the breakdown you need...",
          "Why my [topic] explanation went viral - and the part I didn't share until now..."
        ],
        
        tweetThreads: Array.isArray(result.expandedContent?.tweetThreads) ? result.expandedContent.tweetThreads.map(thread => 
          typeof thread === 'string' ? thread : JSON.stringify(thread)
        ) : [
          "I recently shared a post about [topic] that generated hundreds of comments. Here's what I learned from your responses and the 5 key insights you might have missed...",
          "Many of you asked about [common objection] after my viral post. Let me address this in detail and show you the 3 scenarios where this approach works best...",
          "After my post about [topic] blew up, I collected the results people shared in the comments. Here's what actually works based on real follower experiences..."
        ],
        
        videoAngles: Array.isArray(result.expandedContent?.videoAngles) ? result.expandedContent.videoAngles.map(angle => 
          typeof angle === 'string' ? angle : JSON.stringify(angle)
        ) : [
          "Addressing the top 5 objections from my viral [topic] post",
          "What I got wrong in my viral [topic] post - updated approach",
          "Case studies: 3 followers who implemented my [topic] advice and their results",
          "Behind the scenes: How I discovered the [topic] method that went viral",
          "The advanced version of my viral [topic] strategy (for experienced users only)"
        ]
      }
    };
    
    return validatedResult;
  } catch (error) {
    console.error('Error in explodeComments:', error);
    
    // Return a fallback response with the correct structure
    return {
      viralPost: viralPost,
      extractedComments: [
        "This completely changed how I think about [topic]! I've been doing it wrong for years!",
        "Wait, but what about [common objection]? Has anyone tried this approach with that situation?",
        "I tried something similar and got [specific result]. The key was consistency over time.",
        "Can you make a follow-up video about [related topic]? I need more details on that part!",
        "This is why I follow you! No one else explains [topic] this clearly. Saving this for later!"
      ],
      expandedContent: {
        tiktokHooks: [
          "You've been doing [topic] all wrong - here's what the experts don't tell you...",
          "The most common objection to [approach] is [objection]. Here's how to overcome it...",
          "Want to get [specific result] like my followers? The secret isn't what you think...",
          "You asked for more details on [related topic] - here's the breakdown you need...",
          "Why my [topic] explanation went viral - and the part I didn't share until now..."
        ],
        tweetThreads: [
          "I recently shared a post about [topic] that generated hundreds of comments. Here's what I learned from your responses and the 5 key insights you might have missed...",
          "Many of you asked about [common objection] after my viral post. Let me address this in detail and show you the 3 scenarios where this approach works best...",
          "After my post about [topic] blew up, I collected the results people shared in the comments. Here's what actually works based on real follower experiences..."
        ],
        videoAngles: [
          "Addressing the top 5 objections from my viral [topic] post",
          "What I got wrong in my viral [topic] post - updated approach",
          "Case studies: 3 followers who implemented my [topic] advice and their results",
          "Behind the scenes: How I discovered the [topic] method that went viral",
          "The advanced version of my viral [topic] strategy (for experienced users only)"
        ]
      }
    };
  }
};

// 6. Viral CTA Sequencer
export const createCTASequence = async (): Promise<ViralCTASequencer> => {
  const prompt = `
You are a conversion psychology expert. Create a 7-day viral CTA sequence.

Generate CTA sequence in JSON format:
{
  "sequencePlan": [
    {
      "day": 1,
      "ctaType": "Direct Offer/Community CTA/Scarcity CTA/Problem Reminder/Testimonial CTA/FOMO CTA/Hard Close",
      "content": "complete CTA copy for this day",
      "psychology": "psychological principle being used"
    }
  ]
}

Create 7 days of psychological sequencing: trust → desire → action.
`;

  return await callGeminiAPI(prompt);
};

// 7. Platform Timing Forecaster
export const forecastTiming = async (
  contentType: string,
  timezone: string,
  niche: string
): Promise<PlatformTimingForecaster> => {
  const prompt = `
You are a social media timing expert. Predict optimal posting times.

Content Type: "${contentType}"
Timezone: "${timezone}"
Niche: "${niche}"

Generate timing forecast in JSON format:
{
  "contentType": "${contentType}",
  "timezone": "${timezone}",
  "niche": "${niche}",
  "predictions": {
    "tiktok": "optimal TikTok posting time with reasoning",
    "instagram": "optimal Instagram posting time for Reels and Carousel",
    "youtubeShorts": "optimal YouTube Shorts posting time",
    "email": "optimal email send time based on niche"
  },
  "reasoning": "detailed explanation of timing logic for this niche and content type"
}

Base predictions on audience behavior patterns and platform algorithms.
`;

  return await callGeminiAPI(prompt);
};

// 8. Content Ethics Sanitizer
export const sanitizeContent = async (content: string): Promise<ContentEthicsSanitizer> => {
  const prompt = `
You are a content compliance expert. Sanitize this content for platform safety.

Content: "${content}"

Generate ethics sanitization in JSON format:
{
  "originalContent": "${content}",
  "flags": [
    {
      "issue": "specific issue identified",
      "severity": "High/Medium/Low",
      "platform": "which platform this affects",
      "explanation": "why this could cause problems"
    }
  ],
  "sanitizedContent": "rewritten content that preserves edge while staying compliant",
  "complianceScore": score out of 10
}

Keep creators viral and safe from takedowns.
`;

  return await callGeminiAPI(prompt);
};

// 9. Value Ladder Builder
export const buildValueLadder = async (currentOffer: string): Promise<ValueLadderBuilder> => {
  const prompt = `
You are a revenue optimization expert. Build a complete value ladder.

Current Offer: "${currentOffer}"

Generate value ladder in JSON format:
{
  "currentOffer": "${currentOffer}",
  "revenueLadder": [
    {
      "price": "$9/$49/$199/$1K",
      "offer": "offer description",
      "emailCopy": "email copy for this tier",
      "adCopy": "ad copy for this tier",
      "target": "target customer for this tier"
    }
  ]
}

Create 4 tiers that monetize every audience segment.
`;

  return await callGeminiAPI(prompt);
};

// 10. 2-Minute Monetizer
export const generateMonetization = async (
  contentTopic: string,
  audienceSize: string,
  currentProduct: string
): Promise<MonetizationGenerator> => {
  const prompt = `
You are a monetization strategist. Recommend the best monetization path.

Content Topic: "${contentTopic}"
Audience Size: "${audienceSize}"
Current Product: "${currentProduct}"

Generate monetization recommendation in JSON format:
{
  "contentTopic": "${contentTopic}",
  "audienceSize": "${audienceSize}",
  "currentProduct": "${currentProduct}",
  "recommendation": {
    "path": "ideal monetization path (ebook/service/cohort/SaaS)",
    "hook": "hook for this monetization approach",
    "cta": "call-to-action copy",
    "landingCopy": "landing page copy",
    "reasoning": "why this path is optimal for this creator"
  }
}

Perfect for beginners or confused creators.
`;

  return await callGeminiAPI(prompt);
};

// 11. Content Framework Builder
export const buildContentFramework = async (niche: string): Promise<ContentFrameworkBuilder> => {
  const prompt = `
You are a content structure expert. Create a viral framework for this niche.

Niche: "${niche}"

Generate content framework in JSON format:
{
  "niche": "${niche}",
  "framework": {
    "structure": ["5-part viral structure (e.g., PROBLEM → REFRAME → VISUAL → CTA → HOOK)"],
    "postPlan": [
      {
        "day": 1,
        "topic": "post topic",
        "hook": "opening hook",
        "content": "content outline"
      }
    ],
    "scriptSkeletons": {
      "shorts": "short-form video script skeleton",
      "carousels": "carousel post skeleton",
      "email": "email script skeleton"
    }
  }
}

Create 7-day plug-and-play content plan that eliminates creator block.
`;

  return await callGeminiAPI(prompt);
};

// 12. Course Curriculum Builder
export const buildCourseCurriculum = async (topic: string): Promise<CourseCurriculumBuilder> => {
  const prompt = `
You are a course creation expert. Build a complete curriculum for this topic.

Topic: "${topic}"

Generate course curriculum in JSON format:
{
  "topic": "${topic}",
  "courseDetails": {
    "title": "compelling course title",
    "subtitle": "supporting subtitle",
    "positioning": "unique positioning statement",
    "audienceLevel": "Beginner/Intermediate/Advanced"
  },
  "curriculum": [
    {
      "moduleNumber": 1,
      "moduleTitle": "module title",
      "lessons": [
        {
          "lessonNumber": 1,
          "lessonTitle": "lesson title",
          "goals": ["lesson goals"],
          "activities": ["lesson activities"],
          "quizPrompts": ["quiz questions"]
        }
      ],
      "cta": "module call-to-action"
    }
  ],
  "bonusUnits": {
    "slidePrompts": ["slide deck prompts"],
    "videoSegments": ["scriptable video segments"],
    "funnelLayout": "course monetization funnel layout",
    "ebookDraft": "companion eBook outline"
  }
}

Create 5-7 modules with 3-6 lessons each. Transform a TikTok educator into a $997 course seller.
`;

  return await callGeminiAPI(prompt);
};

// 13. Zero-to-Startup Engine
export const buildStartupEngine = async (problem: string, niche: string): Promise<ZeroToStartupEngine> => {
  const prompt = `
You are a startup expert. Create a complete startup blueprint from this idea.

Problem: "${problem}"
Niche/Industry: "${niche}"

Generate startup blueprint in JSON format:
{
  "problem": "${problem}",
  "niche": "${niche}",
  "businessModel": "recommended business model (freemium/SaaS/service/marketplace)",
  "monetizationStrategy": "detailed monetization approach",
  "mvpScope": {
    "features": ["prioritized feature list for MVP"],
    "prioritization": "explanation of feature prioritization"
  },
  "techStack": ["recommended technologies and tools"],
  "landingPageCopy": {
    "headline": "compelling headline",
    "subheadline": "supporting subheadline",
    "valueProps": ["3-5 key value propositions"],
    "cta": "primary call-to-action"
  },
  "coldEmails": ["3 cold outreach emails for different stakeholders"],
  "launchPlan": [
    {
      "day": 1,
      "tasks": ["specific tasks for this day"],
      "goals": "goals for this day"
    }
  ]
}

Create a 7-day launch plan with specific tasks and goals for each day.
`;

  return await callGeminiAPI(prompt);
};

// 14. 100-Year Content Calendar Generator
export const generateContentCalendar = async (niche: string, goal: string, platform: string): Promise<ContentCalendarGenerator> => {
  const prompt = `
You are a content strategy expert. Create an evergreen content library for this niche.

Niche: "${niche}"
Goal: "${goal}"
Platform: "${platform}"

Generate content calendar in JSON format:
{
  "niche": "${niche}",
  "goal": "${goal}",
  "platform": "${platform}",
  "contentLibrary": {
    "perennialTopics": ["365 evergreen content topics"],
    "weeklyThemes": [
      {
        "theme": "weekly theme name",
        "postCategories": ["post categories for this theme"]
      }
    ],
    "monthlyCampaigns": [
      {
        "month": "month name",
        "campaign": "campaign theme",
        "content": ["content ideas for this campaign"]
      }
    ],
    "anchorContent": ["lifetime anchor content pieces"],
    "seasonalIdeas": [
      {
        "season": "season or holiday name",
        "ideas": ["content ideas for this season"]
      }
    ]
  }
}

Focus on creating a mix of evergreen, seasonal, and trending content ideas.
`;

  return await callGeminiAPI(prompt);
};

// 15. Gemini-Powered Prompt Debugger
export const debugPrompt = async (failedPrompt: string): Promise<PromptDebugger> => {
  const prompt = `
You are a prompt engineering expert. Debug and fix this failed AI prompt.

Failed Prompt: "${failedPrompt}"

Generate prompt debugging in JSON format:
{
  "failedPrompt": "${failedPrompt}",
  "analysis": {
    "toneIssues": "analysis of tone problems",
    "vagueness": "analysis of vague elements",
    "ambiguity": "analysis of ambiguous instructions",
    "structuralProblems": "analysis of structural issues"
  },
  "optimizedPrompts": [
    {
      "variant": "variant name/focus",
      "prompt": "optimized prompt version",
      "improvements": "explanation of improvements made"
    }
  ],
  "explanation": "overall explanation of why the prompt failed and how to write better prompts"
}

Provide 3-5 optimized prompt variants that would work better.
`;

  return await callGeminiAPI(prompt);
};

// 16. One-Person Agency Automator
export const automateAgency = async (service: string, targetClient: string): Promise<OnePersonAgencyAutomator> => {
  const prompt = `
You are a freelance business expert. Create a complete agency system for this service.

Service: "${service}"
Target Client: "${targetClient}"

Generate agency automation in JSON format:
{
  "service": "${service}",
  "targetClient": "${targetClient}",
  "pricingTiers": [
    {
      "tier": "tier name",
      "price": "price point",
      "deliverables": ["what's included"],
      "timeframe": "delivery timeframe"
    }
  ],
  "portfolioOutline": {
    "sections": ["portfolio page sections"],
    "caseStudies": ["case study ideas"],
    "testimonials": ["testimonial templates"]
  },
  "coldPitchStrategy": {
    "prospectingMethod": "how to find clients",
    "outreachSequence": ["outreach message sequence"],
    "followUpStrategy": "follow-up approach"
  },
  "clientOnboarding": {
    "steps": ["onboarding process steps"],
    "questionnaire": ["client questionnaire questions"],
    "welcomeEmail": "welcome email template"
  },
  "sops": [
    {
      "title": "SOP title",
      "process": ["step-by-step process"],
      "tools": ["tools needed"]
    }
  ],
  "emailSequences": [
    {
      "purpose": "sequence purpose",
      "emails": ["email templates"]
    }
  ]
}

Create a complete system that helps freelancers become agencies.
`;

  return await callGeminiAPI(prompt);
};

// 17. Idea → Product → Launch AutoFlow
export const buildProductLaunch = async (idea: string): Promise<ProductLaunchFlow> => {
  const prompt = `
You are a product launch expert. Create a complete launch plan for this idea.

Idea: "${idea}"

Generate product launch flow in JSON format:
{
  "idea": "${idea}",
  "valuePropositionMap": {
    "customerPains": ["customer pain points"],
    "customerGains": ["customer desired gains"],
    "painRelievers": ["how product relieves pains"],
    "gainCreators": ["how product creates gains"]
  },
  "brandingDirection": {
    "name": "product name suggestion",
    "tagline": "tagline suggestion",
    "voiceTone": "brand voice description",
    "colorPalette": "color scheme suggestion"
  },
  "pricingModel": {
    "strategy": "pricing strategy",
    "tiers": [
      {
        "name": "tier name",
        "price": "price point",
        "features": ["features included"]
      }
    ]
  },
  "websiteCopy": {
    "headline": "main headline",
    "subheadline": "supporting subheadline",
    "features": [
      {
        "title": "feature title",
        "description": "feature description"
      }
    ],
    "faq": [
      {
        "question": "FAQ question",
        "answer": "FAQ answer"
      }
    ]
  },
  "waitlistPage": "waitlist landing page HTML",
  "launchTweets": ["tweet thread for launch"]
}

Create a complete product validation and launch plan.
`;

  return await callGeminiAPI(prompt);
};

// 18. The 'Why It Didn't Work' Analyzer
export const analyzeFailure = async (failedItem: string): Promise<FailureAnalyzer> => {
  const prompt = `
You are a marketing failure analysis expert. Analyze why this item didn't work.

Failed Item: "${failedItem}"

Generate failure analysis in JSON format:
{
  "failedItem": "${failedItem}",
  "analysis": {
    "positioning": {
      "issues": ["positioning problems identified"],
      "score": score out of 10
    },
    "hookStrength": {
      "issues": ["hook weaknesses"],
      "score": score out of 10
    },
    "visualStructure": {
      "issues": ["visual structure problems"],
      "score": score out of 10
    },
    "toneMismatch": {
      "issues": ["tone mismatch issues"],
      "score": score out of 10
    },
    "offerClarity": {
      "issues": ["offer clarity problems"],
      "score": score out of 10
    },
    "audienceFit": {
      "issues": ["audience fit problems"],
      "score": score out of 10
    }
  },
  "fixedVersion": "improved version of the item",
  "actionPlan": ["specific steps to fix and improve"]
}

Provide detailed analysis of why it failed and how to fix it.
`;

  return await callGeminiAPI(prompt);
};

// 19. Income Stream Generator 360
export const generateIncomeStreams = async (interests: string, skills: string, niche: string): Promise<IncomeStreamGenerator> => {
  const prompt = `
You are an income diversification expert. Create 5 income stream paths for this person.

Interests: "${interests}"
Skills: "${skills}"
Niche: "${niche}"

Generate income streams in JSON format:
{
  "interests": "${interests}",
  "skills": "${skills}",
  "niche": "${niche}",
  "incomeStreams": [
    {
      "type": "income stream type (service/course/SaaS/affiliate/etc.)",
      "description": "detailed description of this income stream",
      "actionPlan": ["step-by-step action plan"],
      "tools": ["recommended tools and platforms"],
      "timeVsReward": {
        "setupTime": "time needed to set up",
        "maintenanceTime": "ongoing time commitment",
        "potentialIncome": "income potential range",
        "scalability": scalability score out of 10
      },
      "rampUpChecklist": ["30-day ramp-up checklist items"]
    }
  ]
}

Create 5 diverse income streams with complete action plans for each.
`;

  return await callGeminiAPI(prompt);
};

// 20. Monetizable Infographic Wizard
export const createInfographic = async (topic: string): Promise<InfographicWizard> => {
  const prompt = `
You are an infographic design expert. Create a viral-style infographic for this topic.

Topic: "${topic}"

Generate infographic design in JSON format:
{
  "topic": "${topic}",
  "infographic": {
    "layout": "visual layout description",
    "headline": "attention-grabbing headline",
    "subheadline": "supporting subheadline",
    "sections": [
      {
        "title": "section title",
        "content": "section content",
        "iconSuggestion": "icon idea for this section"
      }
    ],
    "colorScheme": "recommended color scheme",
    "fontPairings": "recommended font pairings"
  },
  "caption": "social media caption for the infographic",
  "cta": "call-to-action for monetization",
  "monetizationAngle": "how to monetize this infographic",
  "leadMagnetIdea": "related lead magnet idea"
}

Create a visually appealing and monetizable infographic design.
`;

  return await callGeminiAPI(prompt);
};

// 21. Ultimate Digital Product Generator
export const generateDigitalProduct = async (niche: string): Promise<DigitalProductGenerator> => {
  const prompt = `
You are a digital product creation expert. Create a complete digital product for this niche.

Niche: "${niche}"

Generate digital product in JSON format:
{
  "niche": "${niche}",
  "product": {
    "type": "product type (eBook/course/template/etc.)",
    "title": "compelling product title",
    "description": "product description",
    "outline": ["detailed product outline/table of contents"],
    "uniqueSellingPoints": ["unique selling points"]
  },
  "ebook": {
    "chapters": ["chapter titles and descriptions"],
    "pageCount": estimated page count,
    "coverConcept": "cover design concept"
  },
  "leadMagnets": ["3 lead magnet ideas related to the product"],
  "templates": ["printable templates to include"],
  "slidedeckContent": {
    "sections": ["slide deck sections"],
    "slideCount": estimated slide count
  },
  "salesPage": {
    "headline": "sales page headline",
    "painPoints": ["pain points to address"],
    "benefits": ["key benefits to highlight"],
    "testimonialTemplates": ["testimonial templates"],
    "pricingStrategy": "pricing strategy recommendation"
  },
  "pricingTiers": [
    {
      "tier": "tier name",
      "price": price in dollars,
      "includes": ["what's included"],
      "licenseTerms": "license terms description"
    }
  ]
}

Create a complete, sellable digital product package.
`;

  return await callGeminiAPI(prompt);
};

// 22. Creator Collab Connector
export const connectCreatorCollabs = async (
  niche: string,
  followingSize: string,
  platform: string
): Promise<CreatorCollabConnector> => {
  const prompt = `
You are a creator collaboration expert. Design perfect-fit collaborations for this creator.

Niche: "${niche}"
Following Size: "${followingSize}"
Platform: "${platform}"

Generate collaboration plan in JSON format:
{
  "niche": "${niche}",
  "followingSize": "${followingSize}",
  "platform": "${platform}",
  "collaborations": [
    {
      "creatorType": "type of creator to collaborate with",
      "collaborationFormat": "format (duet/podcast/shoutout/etc.)",
      "scriptOutline": "collaboration script outline",
      "valueSplit": "how value is shared between creators",
      "crossPromoCTA": "cross-promotion call-to-action"
    }
  ],
  "outreachTemplates": ["outreach message templates"],
  "collaborationBenefits": ["specific benefits of these collaborations"],
  "successMetrics": ["metrics to track success"]
}

Design 3 perfect collaboration opportunities with detailed execution plans.
`;

  return await callGeminiAPI(prompt);
};