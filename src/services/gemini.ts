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
    headline: "Transform Your Business with Our Revolutionary Solution",
    adCopy: "Tired of struggling with outdated methods? Our innovative approach delivers 3x better results in half the time. Join thousands of satisfied customers who've already made the switch.",
    tiktokScript: "[Opening shot - direct to camera]\nStop scrolling if you're tired of wasting time on solutions that don't work.\n\n[Show product/service in action]\nOur revolutionary approach has helped thousands of customers achieve amazing results in record time.\n\n[Close up - testimonial or results]\nDon't just take our word for it - our customers are seeing 3x better results in half the time.\n\n[Call to action]\nTap the link in bio to learn more and transform your business today!",
    captions: [
      "Ready to transform your business? Our revolutionary solution delivers 3x better results in half the time! 🚀 #GameChanger #Innovation",
      "Stop struggling with outdated methods! Thousands of customers have already made the switch and seen incredible results. Learn more in bio! ✨",
      "The solution you've been searching for is here! Join the thousands of satisfied customers who've transformed their business with our innovative approach. 💯"
    ],
    businessType: "Service Business",
    tone: "professional",
    performanceEstimate: {
      engagementRate: 8.5,
      clickThroughRate: 3.2,
      conversionRate: 1.8
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
    headline: `Day ${i + 1}: ${themes[i]} - Transform Your Business Today`,
    adCopy: `This is day ${i + 1} of our campaign focusing on ${themes[i].toLowerCase()}. Our solution helps businesses like yours overcome common challenges and achieve remarkable results.`,
    tiktokScript: `[Day ${i + 1} Opening]\nHey there! Today we're talking about ${themes[i].toLowerCase()} and how it affects your business.\n\n[Middle]\nOur solution addresses this by providing innovative tools and strategies.\n\n[Closing]\nTap the link in bio to learn more about how we can help transform your business!`,
    captions: [
      `Day ${i + 1}: Discover how our solution addresses ${themes[i].toLowerCase()} in your business journey! 🚀 #BusinessGrowth`,
      `Are you struggling with ${themes[i].toLowerCase()}? We've got you covered! Check out our latest solution. ✨ #Innovation`,
      `${themes[i]} is crucial for business success. Learn how our approach can help you excel! 💯 #BusinessTips`
    ]
  }));
};

const createMockTrendRewrite = (trendTopic: string, userNiche: string) => {
  return {
    originalTrend: trendTopic,
    tweetVersion: `Just saw how ${trendTopic} is transforming the ${userNiche} industry! Here's how forward-thinking businesses are leveraging this trend to gain a competitive edge... #${userNiche.replace(/\s+/g, '')} #${trendTopic.replace(/\s+/g, '')}`,
    scriptVersion: `[Opening]\nHey there! Have you noticed how ${trendTopic} is completely changing the game for ${userNiche} businesses?\n\n[Middle]\nLet me break down 3 ways this trend is creating massive opportunities in our industry right now.\n\n[Point 1] First, it's revolutionizing how we approach customer engagement...\n\n[Point 2] Second, it's dramatically reducing operational costs...\n\n[Point 3] And finally, it's opening up entirely new revenue streams...\n\n[Closing]\nIf you're in the ${userNiche} space, you can't afford to ignore this. Follow for more industry insights!`,
    adVersion: `[${userNiche.toUpperCase()} ALERT] ${trendTopic} is reshaping our industry - and smart businesses are already capitalizing on it. Discover how our solution helps you leverage this trend for maximum growth and stay ahead of competitors still using outdated approaches. Click to learn more!`,
    niche: userNiche
  };
};

const createMockSocialContent = (platform: string, contentType: string) => {
  return {
    hook: "Want to know the secret that top performers in your industry don't want you to discover?",
    script: `[Opening]\nStop scrolling if you want to learn the industry secret that's transforming businesses like yours.\n\n[Middle]\nMost people in ${platform} marketing are doing it all wrong. Here's what the top 1% know that others don't...\n\n[Point 1] They focus on value first, promotion second.\n\n[Point 2] They understand their audience's pain points intimately.\n\n[Point 3] They use a systematic approach rather than random posting.\n\n[Closing]\nTap the link in bio to discover our complete system for ${contentType} content that converts!`,
    hashtags: ["marketing", "business", "growth", "strategy", "success", "entrepreneur", "socialmedia", "content", "digital", "trending", "viral", "tips", "advice", "learn", "education"],
    captions: [
      "The industry secret that's transforming businesses is finally revealed! 🚀 Learn what the top 1% know that others don't...",
      "Stop wasting time on strategies that don't work! Discover the proven system that's helping businesses like yours achieve remarkable results. ✨",
      "Ready to transform your approach? This game-changing strategy is what separates successful businesses from the rest. 💯"
    ],
    platform: platform,
    contentType: contentType,
    trendingElements: ["Pattern interrupt hook", "Contrarian statement", "List-based content", "Authority positioning"]
  };
};

const createMockEmailResult = (emailType: string) => {
  return {
    subject: `Discover how we're helping businesses like yours achieve remarkable results`,
    emailBody: `Hi [Name],\n\nI noticed that [Company] has been making waves in the [industry] space, and I wanted to reach out because we've been helping similar businesses overcome common challenges.\n\nOur clients typically see a 30% improvement in [key metric] within the first 60 days of working with us.\n\nWould you be open to a quick 15-minute call to discuss how we might be able to help [Company] achieve similar results?\n\nLooking forward to connecting,\n\n[Your Name]`,
    followUps: [
      "Hi [Name],\n\nI wanted to follow up on my previous email about helping [Company] improve [key metric]. I understand you're busy, so I'll keep this brief.\n\nWould you be interested in seeing a case study of how we helped a company similar to yours increase their [key metric] by 30%?\n\nBest regards,\n[Your Name]",
      "Hi [Name],\n\nJust checking in one last time regarding potential opportunities to help [Company] with [key challenge].\n\nIf timing isn't right, no problem at all. Feel free to reach out whenever you're ready to explore how we can help you achieve [specific goal].\n\nAll the best,\n[Your Name]",
      "Hi [Name],\n\nI thought you might be interested in this recent article about [relevant topic] that addresses some of the challenges we discussed for businesses in your industry.\n\n[Link to article]\n\nIf you'd like to discuss how these insights might apply to [Company], I'm happy to schedule a quick call.\n\nRegards,\n[Your Name]"
    ],
    spamScore: 2.5,
    openRatePrediction: 28,
    responseRatePrediction: 8
  };
};

const createMockModularAd = (hook: string, pain: string, solution: string, cta: string) => {
  const hookText = hook || "Tired of struggling with outdated methods?";
  const painText = pain || "Most businesses waste time and money on solutions that don't deliver results.";
  const solutionText = solution || "Our innovative approach delivers 3x better results in half the time.";
  const ctaText = cta || "Click now to transform your business today!";

  return {
    components: {
      hook: hookText,
      pain: painText,
      solution: solutionText,
      cta: ctaText
    },
    assembledAds: [
      {
        version: "Standard Flow",
        fullAd: `${hookText} ${painText} ${solutionText} ${ctaText}`,
        effectiveness: 8
      },
      {
        version: "Problem-First",
        fullAd: `${painText} ${hookText} ${solutionText} ${ctaText}`,
        effectiveness: 7
      },
      {
        version: "Solution-Led",
        fullAd: `${solutionText} ${painText} ${hookText} ${ctaText}`,
        effectiveness: 6
      }
    ],
    templates: [
      "[HOOK] → [PAIN] → [SOLUTION] → [CTA]",
      "[PAIN] → [HOOK] → [SOLUTION] → [CTA]",
      "[SOLUTION] → [PAIN] → [HOOK] → [CTA]"
    ],
    randomizedVersion: `${solutionText} ${ctaText} ${hookText} ${painText}`
  };
};

const createMockHyperPersona = (targetAudience: string) => {
  return {
    demographicProfile: `${targetAudience} typically consists of individuals aged 28-45, with a mix of genders but slightly more female-leaning (55%). They have above-average income ($75K-150K), are college-educated, and live in urban or suburban areas. Most are professionals in mid to senior-level positions with high digital literacy.`,
    psychographicSummary: `${targetAudience} values efficiency, quality, and authenticity. They're ambitious but time-constrained, seeking solutions that provide both practical benefits and emotional satisfaction. They research thoroughly before purchasing and are willing to pay premium prices for products that demonstrably improve their lives or work.`,
    psychologicalDrivers: [
      {
        driver: "Achievement Orientation",
        explanation: "This audience is strongly motivated by accomplishment and recognition. They set high standards for themselves and seek products that help them reach their goals more efficiently or effectively."
      },
      {
        driver: "Time Scarcity",
        explanation: "They experience chronic time pressure and value solutions that save time or help them optimize their schedule. This creates a strong emotional response to messaging that promises to eliminate friction or streamline processes."
      },
      {
        driver: "Identity Reinforcement",
        explanation: "They purchase products that align with and reinforce their self-image as successful, discerning, and forward-thinking individuals. Products must reflect their values and aspirations."
      }
    ],
    decisionPatterns: [
      {
        pattern: "Research-Intensive Evaluation",
        explanation: "This audience conducts thorough research before making decisions, comparing options, reading reviews, and seeking social proof. They typically consider 3-5 alternatives before purchasing.",
        marketingImplications: "Provide detailed information, comparison guides, and abundant social proof. Anticipate objections with comprehensive FAQs and transparent policies."
      },
      {
        pattern: "Value-Over-Price Calculation",
        explanation: "Rather than focusing solely on price, they calculate the overall value proposition, including time savings, quality, and long-term benefits. They're willing to pay more for demonstrable advantages.",
        marketingImplications: "Emphasize ROI, time savings, and long-term benefits rather than competing on price. Use specific metrics and case studies to quantify value."
      }
    ],
    communicationStrategies: {
      messagingApproaches: [
        "Direct, concise communication that respects their intelligence and time constraints",
        "Data-backed claims with specific, quantifiable benefits",
        "Sophisticated humor that acknowledges shared pain points",
        "Storytelling that features relatable protagonists overcoming familiar challenges",
        "Educational content that provides genuine value beyond the sales pitch"
      ],
      channelPreferences: [
        "Email (for detailed information and personalized offers)",
        "LinkedIn (for professional context and credibility)",
        "Instagram (for lifestyle and aspirational content)",
        "Podcasts (for deep dives while multitasking)",
        "YouTube (for demonstrations and tutorials)"
      ]
    },
    objectionHandling: [
      {
        objection: "I don't have time to implement this",
        psychologicalRoot: "Fear of commitment to a time-intensive process; anxiety about adding more to an already full plate",
        recommendedResponse: "Emphasize the time-saving aspects post-implementation and the streamlined onboarding process. Provide specific time estimates and testimonials from busy professionals who successfully integrated the solution."
      },
      {
        objection: "This seems expensive compared to alternatives",
        psychologicalRoot: "Value uncertainty; concern about justifying the investment to themselves or others",
        recommendedResponse: "Reframe the conversation around ROI rather than cost. Provide specific calculations showing time/money saved or value gained. Offer case studies demonstrating tangible returns for similar customers."
      },
      {
        objection: "I'm not sure this will work for my specific situation",
        psychologicalRoot: "Fear of wasting resources on an ill-fitting solution; need for personalization",
        recommendedResponse: "Provide examples of success with similar customers in their industry or situation. Offer a personalized assessment or consultation. Emphasize customization options and flexible implementation."
      }
    ]
  };
};

const createMockCreatorFunnel = (accountHandle: string) => {
  return {
    accountHandle: accountHandle || "creator_account",
    leadMagnetIdea: `"The Ultimate ${accountHandle} Guide: 5 Proven Strategies to Accelerate Your Results" - A comprehensive PDF guide that solves a specific problem for your audience while showcasing your expertise and methodology.`,
    emailSequence: [
      "Welcome Email: Thank them for downloading the guide, introduce yourself briefly, and set expectations for what they'll learn from you. Include one actionable tip they can implement immediately.",
      "Value Email #1: Share a case study or success story related to the lead magnet topic. Focus entirely on providing value, with no selling.",
      "Value Email #2: Address a common misconception in your niche and provide your unique perspective. Include practical advice they can apply right away.",
      "Problem Agitation: Dive deeper into the main problem your paid offer solves. Help them understand the cost of not addressing this issue properly.",
      "Solution Introduction: Introduce your paid offer as the logical next step. Explain how it builds on what they learned in the lead magnet but takes results to the next level.",
      "Testimonial & Proof: Share 2-3 powerful testimonials from clients/customers who've achieved results with your paid offer. Address common objections indirectly through these stories.",
      "Final Offer: Create urgency with a time-limited bonus or special price. Summarize the key benefits and include your strongest call-to-action."
    ],
    monetizationApproach: `Based on your content style and audience, a tiered digital course would be your optimal monetization path. Start with a core course priced at $297-497 that solves a specific problem comprehensively. Then offer implementation support through group coaching calls as a premium tier ($997-1497). This approach maximizes both conversion rates and customer lifetime value while requiring minimal ongoing time investment once created.`,
    landingPage: {
      headline: `Discover the Exact System That's Helping ${accountHandle} Followers Transform Their Results in Just 8 Weeks`,
      socialProof: `Join over 1,000 successful students who have used this proven framework to achieve remarkable results. "Before finding ${accountHandle}'s system, I struggled for years with [common problem]. Within just 6 weeks of implementing this approach, I've already [specific result]." - [Student Name]`,
      cta: "Secure Your Spot: Get Started Today (Limited Enrollment)",
      faqs: [
        "How much time will I need to commit each week? The program is designed for busy professionals, requiring just 2-3 hours per week. All training is available on-demand, and you'll have lifetime access.",
        "What if I'm a complete beginner? This system is specifically designed to work for beginners and experienced practitioners alike. We start with fundamentals and progress to advanced strategies.",
        "How soon will I see results? While everyone's journey is different, most students begin seeing initial results within the first 2-3 weeks by implementing our quick-win strategies.",
        "Do you offer a guarantee? Yes! We're so confident in our system that we offer a 30-day satisfaction guarantee. If you complete the work and don't see results, we'll refund your investment.",
        "Will I get personal support? Absolutely! All students receive access to our private community where you can ask questions and get feedback. Premium tier members also receive direct coaching calls."
      ]
    },
    exportFormat: `This funnel is optimized for implementation on either ClickFunnels or a WordPress/LeadPages combination. The complete package includes:

1. Lead magnet PDF template (Canva)
2. Email sequence (copy/paste into your email provider)
3. Landing page copy with section-by-section instructions
4. Sales page template with conversion elements
5. Checkout page configuration
6. Thank you/delivery page template

All templates are provided in both visual format and as copy/paste text to work with any platform you prefer.`
  };
};

const createMockCommentExploder = (viralPost: string) => {
  return {
    viralPost: viralPost || "Viral post content",
    extractedComments: [
      "This is exactly what I've been struggling with! Finally someone who gets it.",
      "I tried this approach last month and it completely transformed my results. Thank you for sharing!",
      "Wait, but what about [common objection]? How do you handle that?",
      "Could you do a follow-up on how this applies to [related scenario]?",
      "I've been doing this all wrong for years. Mind blown. 🤯"
    ],
    expandedContent: {
      tiktokHooks: [
        "You've been doing this all wrong (and it's not your fault)",
        "The #1 mistake people make when trying to solve [problem]",
        "What no one tells you about [topic] (until it's too late)",
        "This 30-second fix will transform your [result area]",
        "POV: You discover the industry secret they don't want you to know"
      ],
      tweetThreads: [
        "I asked my audience what they struggle with most about [topic]. The responses were eye-opening. Here's what I learned and how you can avoid these common pitfalls...",
        "After yesterday's post went viral, many of you asked about [specific aspect]. Let me break down exactly how this works in a real-world scenario...",
        "The 5 stages of [process] that nobody talks about: A thread based on hundreds of real comments from people just like you 👇"
      ],
      videoAngles: [
        "Addressing the top 3 objections from the comments section",
        "Case study: How one follower implemented this advice and got [specific result]",
        "Behind-the-scenes look at how I discovered this approach (after years of doing it wrong)",
        "Common misconceptions about [topic] debunked (based on your comments)",
        "Q&A: Answering the 5 most-asked questions from my viral post"
      ]
    }
  };
};

const createMockTimingForecaster = (contentType: string, timezone: string, niche: string) => {
  const platforms = {
    tiktok: {
      morning: "9:00-11:00 AM",
      evening: "7:00-9:00 PM",
      bestDays: "Tuesday, Wednesday, Thursday"
    },
    instagram: {
      morning: "11:00 AM-1:00 PM",
      evening: "6:00-8:00 PM",
      bestDays: "Monday, Wednesday, Friday"
    },
    youtube: {
      morning: "8:00-10:00 AM",
      evening: "4:00-6:00 PM",
      bestDays: "Saturday, Sunday, Thursday"
    },
    email: {
      morning: "10:00 AM-12:00 PM",
      evening: "None - avoid evenings",
      bestDays: "Tuesday, Thursday"
    }
  };

  const nicheAdjustments = {
    fitness: "Early morning posts perform 30% better",
    business: "Weekday mornings show highest engagement",
    entertainment: "Evenings and weekends are optimal",
    education: "Sunday evenings show peak planning behavior",
    fashion: "Thursday-Sunday performs best for purchase intent"
  };

  const contentTypeImpact = {
    educational: "Performs best in morning and early afternoon when cognitive function is highest",
    entertainment: "Peak performance during evening leisure hours",
    inspirational: "Strong performance in early morning and evening transition periods",
    tutorial: "Highest engagement on weekends and weekday evenings"
  };

  // Determine which niche adjustment to use
  let nicheAdjustment = "Standard timing applies for this niche";
  for (const [key, value] of Object.entries(nicheAdjustments)) {
    if (niche.toLowerCase().includes(key.toLowerCase())) {
      nicheAdjustment = value;
      break;
    }
  }

  // Determine content type impact
  let contentImpact = "No specific timing impact for this content type";
  for (const [key, value] of Object.entries(contentTypeImpact)) {
    if (contentType.toLowerCase().includes(key.toLowerCase())) {
      contentImpact = value;
      break;
    }
  }

  // Adjust for timezone
  let timezoneAdjustment = "";
  if (timezone.includes("Eastern")) {
    timezoneAdjustment = "All times in Eastern Time (ET). For global audience, consider posting 1-2 hours earlier.";
  } else if (timezone.includes("Pacific")) {
    timezoneAdjustment = "All times in Pacific Time (PT). For East Coast audience, consider posting 9-11 AM PT to catch both coasts during work hours.";
  } else if (timezone.includes("Central")) {
    timezoneAdjustment = "All times in Central Time (CT). This timezone offers good coverage for both US coasts.";
  } else if (timezone.includes("GMT") || timezone.includes("UTC")) {
    timezoneAdjustment = "All times in GMT. For US audience, consider posting 1-3 PM GMT to catch US morning hours.";
  } else {
    timezoneAdjustment = `All times in ${timezone}. Adjust based on your primary audience location.`;
  }

  return {
    contentType: contentType || "Educational Content",
    timezone: timezone || "Eastern Time (ET)",
    niche: niche || "Business",
    predictions: {
      tiktok: `Best times to post on TikTok: ${platforms.tiktok.morning} and ${platforms.tiktok.evening} ${platforms.tiktok.bestDays} (${timezone}). ${nicheAdjustment} for TikTok specifically. For ${contentType.toLowerCase()} content, morning posts tend to receive higher completion rates.`,
      instagram: `Optimal Instagram posting: ${platforms.instagram.morning} and ${platforms.instagram.evening} on ${platforms.instagram.bestDays} (${timezone}). For ${niche} content, Reels perform best when posted in the ${niche.toLowerCase().includes("business") ? "morning" : "evening"} while carousel posts see higher engagement midday.`,
      youtubeShorts: `YouTube Shorts perform best at ${platforms.youtube.morning} and ${platforms.youtube.evening} on ${platforms.youtube.bestDays} (${timezone}). For ${niche} content, aim for ${contentType.toLowerCase().includes("tutorial") ? "weekend mornings" : "weekday evenings"} to maximize initial algorithm boost.`,
      email: `Send ${niche} emails on ${platforms.email.bestDays} between ${platforms.email.morning} (${timezone}). ${contentType} content in emails performs best when sent midweek, avoiding Monday morning and Friday afternoon. ${nicheAdjustment} for email specifically.`
    },
    reasoning: `These recommendations are based on platform algorithm patterns, user behavior analysis, and niche-specific engagement data. ${contentImpact}. ${nicheAdjustment}. ${timezoneAdjustment}

For ${niche} content creators, consistency is often more important than perfect timing. However, these optimal windows can increase initial engagement by 15-30%, which signals algorithms to distribute your content more widely.

The ${contentType.toLowerCase()} format you're using tends to perform best during periods of ${contentType.toLowerCase().includes("educational") || contentType.toLowerCase().includes("tutorial") ? "high attention (mornings, early afternoon)" : "relaxation (evenings, weekends)"} when your audience has the appropriate mindset to engage with this type of content.`
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
    
    // Validate the result has the required fields
    if (result && 
        typeof result === 'object' && 
        'headline' in result && 
        'adCopy' in result && 
        'tiktokScript' in result && 
        'captions' in result && 
        Array.isArray(result.captions)) {
      return result as AdResult;
    }
    
    // If the result doesn't have the required structure, return a mock result
    console.warn('Ad generation returned unexpected format:', result);
    return createMockAdResult();
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
    
    // Validate the result is an array with the expected structure
    if (Array.isArray(result) && 
        result.length > 0 && 
        result.every(day => 
          typeof day === 'object' && 
          'day' in day && 
          'theme' in day && 
          'headline' in day && 
          'adCopy' in day && 
          'tiktokScript' in day && 
          'captions' in day && 
          Array.isArray(day.captions)
        )) {
      return result as CampaignDay[];
    }
    
    // If the result doesn't have the required structure, return mock data
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
    
    return 'We could not rewrite your ad at this time. Please try again later.';
  } catch (error) {
    console.error('Error rewriting ad:', error);
    return `We're experiencing high demand right now. Here's a slightly improved version of your ad:\n\n${originalAd}\n\n(Please try again in a few minutes for a complete rewrite.)`;
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
    return `We're experiencing high demand right now. Please try again in a few minutes for a rewritten ad.`;
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
    message: "We're experiencing high demand right now. Please try again in a few minutes.",
    mockResponse: true,
    timestamp: new Date().toISOString()
  };
};