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
    headline: "Stop Scrolling: This Is What You've Been Looking For",
    adCopy: "Tired of the same old solutions that don't deliver? Our innovative approach has helped thousands of customers achieve real results. Try it today and see the difference for yourself.",
    tiktokScript: "[Opening shot - direct to camera]\nHey, stop scrolling for a second. I need to show you something that's going to change how you think about this.\n\n[Middle section - show product/service]\nFor years, people have been struggling with this exact problem. But what if I told you there's a simpler way?\n\n[Closing - call to action]\nTap the link in my bio to learn more. Trust me, you'll thank me later.",
    captions: [
      "Game-changer alert! 🚨 This solution is revolutionizing the industry. Click to see why thousands are switching!",
      "I wish I'd found this sooner... 😮 The solution you've been searching for is finally here!",
      "Don't waste another day with outdated methods. This new approach is what you need! ⚡"
    ],
    businessType: "Service Business",
    tone: "professional",
    performanceEstimate: {
      engagementRate: 5.8,
      clickThroughRate: 2.3,
      conversionRate: 1.2
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
    headline: `Day ${i + 1}: ${themes[i]} - Compelling Headline`,
    adCopy: `This is compelling ad copy for day ${i + 1} focused on ${themes[i]}. It highlights key benefits and creates interest in your product or service.`,
    tiktokScript: `[Day ${i + 1} Opening]\nHey there! Today I want to talk about ${themes[i].toLowerCase()}.\n\n[Middle]\nHere's what you need to know about this important aspect of our solution.\n\n[Closing]\nTake action now to see the benefits!`,
    captions: [
      `${themes[i]} - Caption option 1: Engaging and attention-grabbing text for social media.`,
      `${themes[i]} - Caption option 2: Another compelling caption variation for your audience.`,
      `${themes[i]} - Caption option 3: A third caption alternative to test with your followers.`
    ]
  }));
};

const createMockTrendRewrite = (trendTopic: string, userNiche: string) => {
  return {
    originalTrend: trendTopic,
    tweetVersion: `Just saw the latest about ${trendTopic} and immediately thought about how this affects ${userNiche}. Here's what you need to know: [1/5]`,
    scriptVersion: `[Opening]\nHey, have you seen the trending news about ${trendTopic}? Let me break down what this means for ${userNiche}.\n\n[Middle]\nThis trend is significant because it directly impacts how we approach our work in ${userNiche}. Here's what you should know...\n\n[Closing]\nMake sure you're prepared for these changes by following these three steps...`,
    adVersion: `[${userNiche.toUpperCase()} ALERT] The ${trendTopic} trend is changing everything. Here's how our solution helps you stay ahead of the curve while others fall behind.`,
    niche: userNiche
  };
};

const createMockSocialContent = (platform: string, contentType: string) => {
  return {
    hook: "The one thing nobody tells you about success in this industry...",
    script: `[Opening]\nStop scrolling for a second. I'm about to share something about ${contentType} that most people miss.\n\n[Middle]\nThe secret that top performers know is that consistency beats perfection every time. Here's what I mean...\n\n[Closing]\nTry this approach for just one week and watch what happens!`,
    hashtags: ["trending", "success", "industry", "tips", "growth", "strategy", "business", "marketing", "socialmedia", "content"],
    captions: [
      "The strategy that transformed my business (and will transform yours too) 👇",
      "I wish someone had told me this when I started... would have saved me years of struggle 😮",
      "This counter-intuitive approach is what separates the top 1% from everyone else ⚡"
    ],
    platform: platform,
    contentType: contentType,
    trendingElements: ["Before/After format", "POV style", "Quick zoom transitions"]
  };
};

const createMockEmailResult = (emailType: string) => {
  return {
    subject: `Quick question about your ${emailType} goals`,
    emailBody: `Hi [Name],\n\nI noticed you're in the [Company] space and thought you might be interested in how we've been helping similar businesses achieve their ${emailType} objectives.\n\nWould you be open to a quick 15-minute call to discuss how we might be able to help you too?\n\nBest regards,\n[Your Name]`,
    followUps: [
      "Just following up on my previous email. I'd love to share some insights about how we could help with your goals.",
      "I wanted to make sure my previous message didn't get lost in your inbox. Are you available for a quick call this week?",
      "I'll keep this brief - I'm still interested in connecting about how we can help with your objectives. Let me know if you'd like to chat."
    ],
    spamScore: 3,
    openRatePrediction: 25,
    responseRatePrediction: 5
  };
};

const createMockModularAd = (hook: string, pain: string, solution: string, cta: string) => {
  return {
    components: {
      hook: hook || "Attention-grabbing hook",
      pain: pain || "Relatable pain point",
      solution: solution || "Compelling solution",
      cta: cta || "Clear call to action"
    },
    assembledAds: [
      {
        version: "Standard Flow",
        fullAd: `${hook || "Attention-grabbing hook"} ${pain || "Relatable pain point"} ${solution || "Compelling solution"} ${cta || "Clear call to action"}`,
        effectiveness: 7
      },
      {
        version: "Problem-First",
        fullAd: `${pain || "Relatable pain point"} ${hook || "Attention-grabbing hook"} ${solution || "Compelling solution"} ${cta || "Clear call to action"}`,
        effectiveness: 6
      },
      {
        version: "Solution-Led",
        fullAd: `${solution || "Compelling solution"} ${pain || "Relatable pain point"} ${hook || "Attention-grabbing hook"} ${cta || "Clear call to action"}`,
        effectiveness: 5
      }
    ],
    templates: [
      "[HOOK] → [PAIN] → [SOLUTION] → [CTA]",
      "[PAIN] → [HOOK] → [SOLUTION] → [CTA]",
      "[SOLUTION] → [PAIN] → [HOOK] → [CTA]"
    ],
    randomizedVersion: `${solution || "Compelling solution"} ${cta || "Clear call to action"} ${hook || "Attention-grabbing hook"} ${pain || "Relatable pain point"}`
  };
};

const createMockHyperPersona = (targetAudience: string) => {
  return {
    demographicProfile: `${targetAudience} typically ranges from 28-45 years old, with higher education and above-average income. They are tech-savvy, value-conscious consumers who research thoroughly before making decisions.`,
    psychographicSummary: `${targetAudience} is motivated by efficiency, status, and self-improvement. They value authenticity and expertise, and are willing to invest in quality solutions that save them time or enhance their personal/professional image.`,
    psychologicalDrivers: [
      {
        driver: "Fear of Missing Out (FOMO)",
        explanation: `${targetAudience} is highly susceptible to social proof and the fear of missing opportunities that peers are benefiting from.`
      },
      {
        driver: "Status Signaling",
        explanation: `${targetAudience} makes purchasing decisions that reflect their desired self-image and social position.`
      },
      {
        driver: "Efficiency Optimization",
        explanation: `${targetAudience} is constantly seeking ways to maximize productivity and minimize wasted time or resources.`
      }
    ],
    decisionPatterns: [
      {
        pattern: "Research-Heavy Evaluation",
        explanation: `${targetAudience} typically conducts extensive research, comparing multiple options before making decisions.`,
        marketingImplications: "Provide detailed comparison content, case studies, and transparent pricing to support their evaluation process."
      },
      {
        pattern: "Social Validation Seeking",
        explanation: `${targetAudience} looks for confirmation from peers and trusted authorities before committing.`,
        marketingImplications: "Leverage testimonials, expert endorsements, and user statistics prominently in marketing materials."
      }
    ],
    communicationStrategies: {
      messagingApproaches: [
        "Direct, data-backed claims with specific numbers",
        "Problem-solution frameworks that emphasize time/resource savings",
        "Exclusive, insider knowledge framing",
        "Future-focused benefits with concrete outcomes"
      ],
      channelPreferences: [
        "Professional social networks (LinkedIn)",
        "Industry-specific podcasts and newsletters",
        "Targeted webinars and educational content",
        "Peer recommendation platforms"
      ]
    },
    objectionHandling: [
      {
        objection: "Price sensitivity",
        psychologicalRoot: "Concern about ROI and value justification to stakeholders",
        recommendedResponse: "Frame pricing in terms of concrete ROI, time savings, and competitive advantage rather than cost."
      },
      {
        objection: "Implementation concerns",
        psychologicalRoot: "Fear of disruption to existing workflows and systems",
        recommendedResponse: "Emphasize seamless integration, support resources, and phased adoption approaches."
      }
    ]
  };
};

const createMockCreatorFunnel = (accountHandle: string) => {
  return {
    accountHandle: accountHandle || "creator_handle",
    leadMagnetIdea: `"The Ultimate ${accountHandle} Guide: 5 Strategies That Transformed My Business" - A comprehensive PDF guide that showcases your expertise while providing immediately actionable value.`,
    emailSequence: [
      "Welcome Email: Thank them for downloading the guide, introduce yourself briefly, and set expectations for future emails.",
      "Value Email: Share an additional tip not included in the guide, demonstrating ongoing value.",
      "Problem Email: Dig deeper into a specific challenge your audience faces, building empathy and connection.",
      "Solution Email: Introduce your solution/offer as the answer to the problem, with social proof.",
      "Testimonial Email: Share success stories from clients/customers who've used your solution.",
      "Objection Email: Address common concerns or objections about your offer.",
      "Closing Email: Final invitation to take action with clear next steps and deadline if applicable."
    ],
    monetizationApproach: `Based on your content style and audience, a tiered coaching program would be most effective. Start with a lower-priced group program and offer a premium 1:1 option. This leverages your expertise while creating multiple price points for different segments of your audience.`,
    landingPage: {
      headline: `Transform Your [Industry] Results With The Proven ${accountHandle} Method`,
      socialProof: "Join over 1,000+ professionals who have used these strategies to [specific result]. Featured in [Publication/Podcast], [Publication/Podcast], and [Publication/Podcast].",
      cta: "Get Instant Access: Download The Free Guide Now",
      faqs: [
        "How long will it take to see results? While everyone's journey is different, most of our community members see initial improvements within 2-3 weeks of implementing these strategies.",
        "Is this right for beginners? Absolutely! The guide is designed with step-by-step instructions suitable for all experience levels.",
        "Do I need special tools or software? No, the strategies can be implemented with basic tools you likely already have.",
        "Will this work for my specific situation? The principles in this guide have been successfully applied across various niches and industries.",
        "What happens after I enter my email? You'll immediately receive the guide in your inbox, along with occasional valuable tips (no spam, ever)."
      ]
    },
    exportFormat: "The funnel is structured for easy export to popular platforms like ClickFunnels, Kajabi, or even a simple WordPress + email provider setup. All copy is organized by section with clear headings for easy implementation."
  };
};

const createMockCommentExploder = (viralPost: string) => {
  return {
    viralPost: viralPost || "Viral post content",
    extractedComments: [
      "I've been struggling with this exact problem for years! Finally someone gets it.",
      "Wait, I never thought about it this way. Mind blown! 🤯",
      "Can you explain how this works for [specific situation]?",
      "This is why I follow you! Always bringing the value.",
      "I tried something similar but it didn't work. Any troubleshooting tips?"
    ],
    expandedContent: {
      tiktokHooks: [
        "You know that viral post about [topic]? Here's what everyone missed in the comments...",
        "The comment section revealed something shocking about [topic] that nobody's talking about",
        "When I posted about [topic], I never expected THIS reaction in the comments",
        "This comment on my viral post changed everything I thought about [topic]",
        "POV: You're reading the comments on that viral [topic] post and discover this hidden truth"
      ],
      tweetThreads: [
        "1/ After my post about [topic] went viral, the comments revealed 5 unexpected insights that deserve their own thread. Here's what I learned from the community...",
        "1/ The most interesting part of creating viral content? The COMMENTS. Here are 7 surprising reactions to my [topic] post and what they teach us about audience psychology...",
        "1/ My viral post on [topic] generated 100+ comments. I've analyzed the patterns and discovered these 3 audience segments you need to know about..."
      ],
      videoAngles: [
        "Addressing the top 3 questions from comments on my viral [topic] post",
        "Testing the controversial theory from the comments section of my [topic] post",
        "I asked my followers about [topic] and their responses revealed this pattern",
        "Comment deep-dive: The unexpected emotional reactions to [topic]",
        "From comments to content: How audience feedback shaped my approach to [topic]"
      ]
    }
  };
};

const createMockTimingForecaster = (contentType: string, timezone: string, niche: string) => {
  return {
    contentType: contentType || "Educational",
    timezone: timezone || "Eastern Time (ET)",
    niche: niche || "Business",
    predictions: {
      tiktok: `For ${contentType} content in the ${niche} niche, optimal TikTok posting times are 9-11 AM and 7-9 PM ${timezone} on weekdays. The morning slot catches professionals during commute/coffee breaks, while evening slots target relaxation time. Weekends show 15% lower engagement for business content.`,
      instagram: `Instagram Reels for ${contentType} content in ${niche} perform best at 12-2 PM and 8-10 PM ${timezone}. Carousels perform better during lunch hours (12-1 PM) when users have time to swipe through multiple slides. Sunday evening shows surprisingly strong performance for educational content.`,
      youtubeShorts: `YouTube Shorts in the ${niche} niche perform best when posted at 3-5 PM and 8-10 PM ${timezone}. The algorithm typically promotes new Shorts within 24-48 hours, so Thursday/Friday posting maximizes weekend visibility.`,
      email: `For ${niche} educational content, optimal email sending times are Tuesday-Thursday between 10 AM and 1 PM ${timezone}. Avoid Monday mornings (too busy) and Friday afternoons (weekend mindset). Open rates are typically 23% higher mid-week versus weekend sends.`
    },
    reasoning: `The ${niche} audience in ${timezone} typically engages with ${contentType} content during specific windows: morning preparation (7-9 AM), lunch breaks (12-2 PM), commute home (5-7 PM), and evening relaxation (8-10 PM). Platform algorithms also factor in, with TikTok favoring recency, Instagram prioritizing engagement velocity in the first hour, YouTube promoting content that maintains watch time, and email requiring strategic timing to avoid inbox crowding. The specific recommendations balance these factors for maximum visibility and engagement.`
  };
};

const createMockStyleRoulette = (businessType: string) => {
  const styles = ["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"];
  const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts"];
  
  return {
    businessType: businessType || "Business",
    randomStyles: Array.from({ length: 10 }, (_, i) => ({
      style: styles[i],
      script: `[${styles[i]} Style Script for ${businessType}]\n\nOpening: Start with a compelling hook about ${businessType} that grabs attention immediately.\n\nMiddle: Explain the key problem or opportunity in the ${businessType} industry and how your solution addresses it.\n\nClosing: Clear call to action telling viewers exactly what to do next.`,
      caption: `${styles[i]} style content that reveals the truth about ${businessType} nobody's talking about. #${businessType.replace(/\s+/g, '')} #content #viral`,
      hook: `The ${styles[i]} approach to ${businessType} that's changing everything...`,
      uniqueElements: [
        `Unique element 1 for ${styles[i]} style`,
        `Unique element 2 for ${styles[i]} style`,
        `Unique element 3 for ${styles[i]} style`
      ],
      platform: platforms[i % platforms.length]
    })),
    styleExplanations: {
      rant: `Rant style creates engagement through passionate, emotionally-charged delivery about a problem in the ${businessType} industry. Start with "I can't believe..." or "Here's what nobody's telling you about..." and build intensity throughout. Works best when addressing a genuine frustration your audience experiences.`,
      skit: `Skit style uses character-based scenarios to demonstrate problems/solutions in ${businessType}. Create 2-3 distinct characters (customer, expert, skeptic) and use simple transitions between them. This format excels at showing before/after scenarios and objection handling.`,
      story: `Story style follows a narrative arc with a clear beginning (problem), middle (journey), and end (resolution) related to ${businessType}. Start with "Let me tell you what happened when..." and create an emotional journey. This format builds deep connection and memorability.`,
      qa: `Q&A style presents common questions about ${businessType} and provides concise, valuable answers. Start with the question on screen, then deliver a direct answer with supporting points. This format positions you as an expert and performs well with educational content.`,
      interview: `Interview style creates a conversation format about ${businessType}, even when filming solo. Use questions as text overlays, then answer them as the expert. This creates a dynamic feel and allows you to address specific audience pain points directly.`,
      duet: `Duet style responds to another creator's content about ${businessType}, adding your expertise or perspective. Find trending content in your niche, then film your reaction and insights alongside it. This leverages existing audiences and trending topics.`,
      stitch: `Stitch style incorporates a brief clip from another video about ${businessType}, then continues with your own content. Use the original clip to set up a problem or misconception, then deliver your solution or correction. This creates instant context and relevance.`,
      vlog: `Vlog style follows a day-in-the-life format showing behind-the-scenes of ${businessType}. Film authentic moments that demonstrate your process, challenges, and results. This builds trust through transparency and creates a personal connection.`,
      pov: `POV (Point of View) style puts the viewer directly in a scenario related to ${businessType}. Start with "POV: You're..." and create a first-person experience. This format creates immediate relevance and emotional connection with your audience.`
    }
  };
};

const createMockCourseCurriculum = (topic: string) => {
  return {
    topic: topic || "Course Topic",
    courseDetails: {
      title: `The Complete ${topic} Mastery System`,
      subtitle: `Transform your understanding and implementation of ${topic} with this comprehensive, step-by-step program`,
      positioning: `Unlike other ${topic} courses that focus only on theory, this program delivers practical, implementable strategies with templates, frameworks, and real-world applications.`,
      audienceLevel: "Beginner to Intermediate"
    },
    curriculum: Array.from({ length: 5 }, (_, i) => ({
      moduleNumber: i + 1,
      moduleTitle: `Module ${i + 1}: ${["Foundations", "Core Strategies", "Advanced Techniques", "Implementation", "Mastery & Scaling"][i]} of ${topic}`,
      lessons: Array.from({ length: 3 }, (_, j) => ({
        lessonNumber: j + 1,
        lessonTitle: `Lesson ${i + 1}.${j + 1}: ${["Understanding", "Implementing", "Mastering"][j]} ${topic} ${["Fundamentals", "Strategies", "Systems"][j]}`,
        goals: [
          `Understand the core principles of ${topic} ${["basics", "strategies", "advanced concepts"][j]}`,
          `Learn how to implement ${topic} ${["foundations", "techniques", "systems"][j]} in real-world scenarios`,
          `Develop confidence in applying ${topic} ${["knowledge", "skills", "expertise"][j]} to your specific situation`
        ],
        activities: [
          `Complete the ${topic} ${["assessment", "worksheet", "implementation plan"][j]}`,
          `Practice the ${topic} ${["basics", "techniques", "advanced strategies"][j]} with the provided exercises`
        ],
        quizPrompts: [
          `What are the three key principles of ${topic} covered in this lesson?`,
          `How would you apply the ${topic} framework to [specific scenario]?`,
          `What's the difference between [concept A] and [concept B] in ${topic}?`
        ]
      })),
      cta: `Ready to master ${["the fundamentals", "core strategies", "advanced techniques", "implementation", "scaling"][i]} of ${topic}? Complete this module and move on to the next level!`
    })),
    bonusUnits: {
      slidePrompts: [
        `${topic} Quick-Start Guide: 10 slides summarizing the essential first steps`,
        `${topic} Case Study: Real-world success story with before/after results`,
        `${topic} Troubleshooting: Common challenges and solutions`
      ],
      videoSegments: [
        `${topic} in Action: 5-minute demonstration of key techniques`,
        `Expert Interview: Insights from ${topic} industry leader`,
        `${topic} Client Transformation: Before and after results`
      ],
      funnelLayout: `The course funnel starts with a free workshop on "The 3 Biggest Mistakes in ${topic}" leading to the main course offer, with upsells for 1:1 coaching and an advanced implementation program.`,
      ebookDraft: `"The Ultimate ${topic} Handbook" - A comprehensive guide covering the core principles, implementation strategies, and optimization techniques for ${topic} success.`
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
    const result = await callGeminiAPI(prompt);
    return result;
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
    return result;
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
    
    return 'Unable to rewrite ad. Please try again later.';
  } catch (error) {
    console.error('Error rewriting ad:', error);
    return `Our AI is currently busy. Here's your original ad with minor improvements:\n\n${originalAd}\n\n(Please try again in a few minutes for a complete rewrite.)`;
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
    return `Our AI is currently busy. Please try again in a few minutes for a rewritten ad.`;
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
    message: "Our AI is currently busy processing many requests. Please try again in a few minutes.",
    mockResponse: true,
    timestamp: new Date().toISOString()
  };
};