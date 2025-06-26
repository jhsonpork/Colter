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
    adCopy: "Tired of struggling with outdated methods? Our innovative solution helps businesses like yours achieve 3x growth in half the time. Join thousands of satisfied customers who've already made the switch.",
    tiktokScript: "[Opening shot - direct to camera]\nStop scrolling if you're tired of wasting time on ineffective business solutions.\n\n[Show product/service in action]\nOur revolutionary approach has helped thousands of businesses achieve remarkable results in record time.\n\n[Show testimonial or results]\nCustomers report up to 3x growth after implementing our system.\n\n[Call to action]\nTap the link in bio to learn how we can transform your business today.",
    captions: [
      "Ready to transform your business? Our solution delivers 3x growth in half the time. Link in bio to learn more! #BusinessGrowth #Innovation",
      "Stop struggling with outdated methods! Our revolutionary approach is helping businesses thrive. Learn more at the link! #BusinessTips #Growth",
      "Thousands of businesses have already made the switch. Will you be next? Click the link to find out how we can help! #BusinessSolutions #Success"
    ],
    businessType: "Business Solutions",
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
    headline: `Day ${i + 1}: ${themes[i]} - Transforming Your Business`,
    adCopy: `This is day ${i + 1} of our campaign focusing on ${themes[i].toLowerCase()}. Our solution helps businesses achieve remarkable results with minimal effort. Join thousands of satisfied customers today.`,
    tiktokScript: `[Day ${i + 1} Opening]\nWelcome to day ${i + 1} of our series on business transformation.\n\n[Middle]\nToday we're focusing on ${themes[i]}. Did you know that most businesses struggle with this exact issue?\n\n[Closing]\nTap the link in bio to learn how our solution addresses this challenge!`,
    captions: [
      `Day ${i + 1}: ${themes[i]} - Learn how our solution can transform your business approach! #BusinessTips #Growth`,
      `Continuing our series with ${themes[i]}. Swipe up to see how we can help your business thrive! #BusinessStrategy`,
      `${themes[i]} is critical for business success. Check out our proven approach! #BusinessGrowth #Success`
    ]
  }));
};

const createMockTrendRewrite = (trendTopic: string, userNiche: string) => {
  return {
    originalTrend: trendTopic,
    tweetVersion: `Just saw the latest on ${trendTopic} and immediately thought how this applies to ${userNiche}. Here's how you can leverage this trend to grow your business... #${userNiche.replace(/\s+/g, '')} #${trendTopic.replace(/\s+/g, '')}`,
    scriptVersion: `[Opening]\nHave you seen the trending topic about ${trendTopic}? Everyone's talking about it, and here's why it matters for ${userNiche}.\n\n[Middle]\nThis trend is changing how people think about ${userNiche}, and smart businesses are already adapting.\n\n[Closing]\nHere's how you can apply this trend to your ${userNiche} business before your competitors do!`,
    adVersion: `[${userNiche.toUpperCase()} ALERT] The ${trendTopic} trend is reshaping our industry! Learn how forward-thinking ${userNiche} businesses are leveraging this trend to gain market share. Click now before your competitors beat you to it!`,
    niche: userNiche
  };
};

const createMockSocialContent = (platform: string, contentType: string) => {
  return {
    hook: `Stop scrolling if you're in the ${contentType} business!`,
    script: `[Opening]\nStop scrolling if you're in the ${contentType} business and want to double your results.\n\n[Middle]\nMost ${contentType} businesses are making these 3 critical mistakes that cost them customers every day.\n\n[Closing]\nSwipe up to discover our proven system that has helped hundreds of ${contentType} businesses thrive even in this economy!`,
    hashtags: ["business", "growth", "success", "entrepreneur", "marketing", contentType.toLowerCase().replace(/\s+/g, ''), platform.toLowerCase()],
    captions: [
      `Transform your ${contentType} business with these proven strategies! #${contentType.replace(/\s+/g, '')} #Business`,
      `Are you making these common ${contentType} mistakes? Learn how to fix them fast! #BusinessTips #${contentType.replace(/\s+/g, '')}`,
      `The ${contentType} industry is changing rapidly. Here's how to stay ahead! #BusinessStrategy #${contentType.replace(/\s+/g, '')}`
    ],
    platform: platform,
    contentType: contentType,
    trendingElements: ["Trending sound: Business Growth", "Text overlay effect", "Quick transitions"]
  };
};

const createMockEmailResult = (emailType: string) => {
  return {
    subject: `Transform Your Business Results with Our ${emailType.charAt(0).toUpperCase() + emailType.slice(1)} Solution`,
    emailBody: `Hi [Name],\n\nI noticed that [Company] has been making waves in the industry, and I thought you might be interested in how our ${emailType} solution has been helping similar businesses achieve remarkable results.\n\nOur clients typically see a 30% improvement within the first 60 days.\n\nWould you be open to a quick 15-minute call this week to explore if we might be a good fit for your needs?\n\nBest regards,\n[Your Name]`,
    followUps: [
      "Hi [Name],\n\nI wanted to follow up on my previous email about our ${emailType} solution. Have you had a chance to consider how it might benefit [Company]?\n\nI'd be happy to share some case studies from businesses similar to yours.\n\nBest regards,\n[Your Name]",
      "Hi [Name],\n\nJust checking in one last time regarding our ${emailType} solution. Many of our clients initially had questions before seeing the remarkable results firsthand.\n\nWould you prefer I share some quick information via email instead?\n\nBest regards,\n[Your Name]",
      "Hi [Name],\n\nI understand you're busy, so this will be my final note about our ${emailType} solution.\n\nIf you're ever looking to improve your [relevant area], our door is always open. Feel free to reach out anytime.\n\nAll the best,\n[Your Name]"
    ],
    spamScore: 3,
    openRatePrediction: 25,
    responseRatePrediction: 5
  };
};

const createMockModularAd = (hook: string, pain: string, solution: string, cta: string) => {
  const defaultHook = "Tired of struggling with ineffective solutions?";
  const defaultPain = "Most businesses waste time and money on approaches that don't deliver results.";
  const defaultSolution = "Our proven system has helped thousands of businesses achieve remarkable growth.";
  const defaultCTA = "Click now to schedule your free consultation!";
  
  const finalHook = hook || defaultHook;
  const finalPain = pain || defaultPain;
  const finalSolution = solution || defaultSolution;
  const finalCTA = cta || defaultCTA;
  
  return {
    components: {
      hook: finalHook,
      pain: finalPain,
      solution: finalSolution,
      cta: finalCTA
    },
    assembledAds: [
      {
        version: "Standard Flow",
        fullAd: `${finalHook} ${finalPain} ${finalSolution} ${finalCTA}`,
        effectiveness: 7
      },
      {
        version: "Problem-First",
        fullAd: `${finalPain} ${finalHook} ${finalSolution} ${finalCTA}`,
        effectiveness: 6
      },
      {
        version: "Solution-Led",
        fullAd: `${finalSolution} ${finalPain} ${finalHook} ${finalCTA}`,
        effectiveness: 5
      }
    ],
    templates: [
      "[HOOK] → [PAIN] → [SOLUTION] → [CTA]",
      "[PAIN] → [HOOK] → [SOLUTION] → [CTA]",
      "[SOLUTION] → [PAIN] → [HOOK] → [CTA]"
    ],
    randomizedVersion: `${finalSolution} ${finalCTA} ${finalHook} ${finalPain}`
  };
};

const createMockHyperPersona = (targetAudience: string) => {
  return {
    demographicProfile: `${targetAudience} typically ranges from 28-45 years old, with a median income of $75,000-$120,000. They are predominantly urban and suburban professionals with at least a bachelor's degree, and 65% have decision-making authority in their organizations.`,
    psychographicSummary: `${targetAudience} values efficiency, professional growth, and work-life balance. They are ambitious but practical, seeking solutions that provide tangible results without unnecessary complexity. They research thoroughly before purchasing and are influenced by peer recommendations and demonstrated expertise.`,
    psychologicalDrivers: [
      {
        driver: "Achievement Orientation",
        explanation: `${targetAudience} is strongly motivated by measurable success and recognition. They seek solutions that help them reach goals faster and more effectively than competitors.`
      },
      {
        driver: "Risk Mitigation",
        explanation: `${targetAudience} makes decisions that minimize potential downsides. They prefer proven solutions with clear track records over innovative but untested approaches.`
      },
      {
        driver: "Time Optimization",
        explanation: `${targetAudience} views time as their most valuable resource. Solutions that save time while maintaining quality are highly valued and will command premium pricing.`
      }
    ],
    decisionPatterns: [
      {
        pattern: "Consensus-Seeking",
        explanation: `${targetAudience} typically consults 3-5 sources before making significant decisions. They value both expert opinions and peer experiences, seeking validation from multiple angles.`,
        marketingImplications: "Provide case studies, testimonials, and expert endorsements to support claims. Create content that can be easily shared with decision-making teams."
      },
      {
        pattern: "Value-Over-Price Evaluation",
        explanation: `${targetAudience} evaluates offerings based on perceived long-term value rather than upfront cost. They calculate ROI meticulously and are willing to pay premium prices for solutions with demonstrated returns.`,
        marketingImplications: "Focus messaging on ROI, long-term benefits, and total value rather than competing on price. Provide ROI calculators and concrete metrics."
      }
    ],
    communicationStrategies: {
      messagingApproaches: [
        "Direct, data-backed claims with specific numbers",
        "Professional but conversational tone that respects their intelligence",
        "Problem-solution frameworks that acknowledge their challenges",
        "Future-oriented messaging that connects to career advancement",
        "Efficiency-focused language that emphasizes time savings"
      ],
      channelPreferences: [
        "LinkedIn (primary professional network)",
        "Email (for detailed information)",
        "Industry-specific webinars and events",
        "Professional podcasts during commutes",
        "Specialized industry publications"
      ]
    },
    objectionHandling: [
      {
        objection: "We're already using a competitor's solution",
        psychologicalRoot: "Status quo bias and sunk cost fallacy - they've invested time and resources in the current solution and fear the switching costs.",
        recommendedResponse: "Acknowledge the investment they've made, then focus on specific gaps their current solution doesn't address. Offer a side-by-side comparison and a low-friction transition plan that preserves their existing data and processes."
      },
      {
        objection: "The price is too high for our budget",
        psychologicalRoot: "Immediate pain of spending outweighs future benefits - they're focusing on short-term budget constraints rather than long-term value.",
        recommendedResponse: "Reframe the conversation around ROI rather than cost. Provide a detailed breakdown of expected returns and offer flexible payment options that align costs with the realization of benefits."
      },
      {
        objection: "We need to think about it and get back to you",
        psychologicalRoot: "Decision paralysis and fear of making the wrong choice - they're overwhelmed by options or concerned about justifying the decision to others.",
        recommendedResponse: "Offer a structured evaluation framework with clear criteria. Provide a small, low-risk starting option that allows them to experience value before full commitment. Follow up with additional information addressing specific concerns."
      }
    ]
  };
};

const createMockCreatorFunnel = (accountHandle: string) => {
  return {
    accountHandle: accountHandle || "creator_account",
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
      headline: `Transform Your [Niche] Results With The Proven ${accountHandle} Method`,
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
};

const createMockCommentExploder = (viralPost: string) => {
  return {
    viralPost: viralPost || "Viral post content",
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
};

const createMockTimingForecaster = (contentType: string, timezone: string, niche: string) => {
  return {
    contentType: contentType || "Educational",
    timezone: timezone || "Eastern Time (ET)",
    niche: niche || "Business",
    predictions: {
      tiktok: `For ${contentType} content in the ${niche} niche, optimal TikTok posting times are Tuesday and Thursday between 7-9 PM ${timezone}. This timing captures users during evening relaxation when they're most receptive to educational content.`,
      instagram: `Instagram Reels for ${niche} perform best Monday, Wednesday, and Friday from 12-2 PM ${timezone} when professionals are on lunch breaks. For carousels, weekends 10 AM-12 PM show higher engagement as users have more time to swipe through educational content.`,
      youtubeShorts: `YouTube Shorts in the ${niche} space see peak performance on Sunday evenings between 6-8 PM ${timezone} when viewers are preparing for the week ahead and seeking valuable information.`,
      email: `For ${niche} email content, Tuesday and Wednesday mornings between 9:30-10:30 AM ${timezone} show highest open rates, as professionals are settled into their workday but not yet overwhelmed with meetings.`
    },
    reasoning: `The ${niche} audience in ${timezone} typically consists of professionals who engage with content during specific windows in their daily routine. ${contentType} content requires more attention and cognitive engagement, making timing especially critical. Morning consumption (9-11 AM) works well for detailed learning, while evening consumption (7-9 PM) is better for inspirational or overview content. Weekend patterns shift significantly, with longer engagement windows but lower immediate action rates. These recommendations are optimized for algorithm distribution patterns as of 2025, accounting for platform-specific timing preferences.`
  };
};

const createMockStyleRoulette = (businessType: string) => {
  return {
    businessType: businessType || "Business",
    randomStyles: Array.from({ length: 10 }, (_, i) => ({
      style: ["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i],
      script: `[${["Rant", "Skit", "Story", "Q&A", "Interview", "Duet", "Stitch", "Vlog", "POV", "Tutorial"][i]} Style Script]\n\nIntro: I can't believe how many ${businessType} businesses are still doing this wrong...\n\nMiddle: Here's what most people don't understand about ${businessType}...\n\nEnd: If you're serious about improving your ${businessType} results, here's what you need to do next...`,
      caption: `[${businessType}] The truth about what's holding most businesses back and how to fix it! #${businessType.replace(/\s+/g, '')} #Business #Growth`,
      hook: `I've helped over 100 ${businessType} businesses double their results with this one approach...`,
      uniqueElements: [
        `Direct camera address with passionate tone`,
        `Specific industry statistics that shock viewers`,
        `Personal story element about ${businessType} success`,
        `Clear before/after comparison`
      ],
      platform: ["TikTok", "Instagram Reels", "YouTube Shorts"][i % 3]
    })),
    styleExplanations: {
      rant: `Rant-style videos work well for ${businessType} when you passionately address industry pain points and misconceptions. Start with "I need to talk about something that's driving me crazy in the ${businessType} industry..." and build emotional intensity throughout. End with a constructive solution to transform frustration into value.`,
      skit: `For ${businessType}, create a before/after skit showing a struggling business owner (before) and then the transformation after implementing your solution. Use simple props and clear character transitions. Keep it under 30 seconds with exaggerated expressions.`,
      story: `Tell a compelling story about a ${businessType} client who overcame a specific challenge. Structure it with a clear beginning (problem), middle (journey/solution), and end (transformation). Use emotional hooks and specific details to make it relatable.`,
      qa: `Q&A format works well for ${businessType} by addressing the top questions in your industry. Start with "The question I get asked most about ${businessType} is..." and provide a concise, valuable answer that showcases your expertise.`,
      interview: `Create a mock interview where you play both roles - interviewer and ${businessType} expert. Ask the questions your audience wants answered, then switch positions to deliver authoritative answers with specific examples.`,
      duet: `Use the duet format to respond to trending ${businessType} content. Find popular videos in your niche and provide additional insights, corrections, or affirmations. This piggybacks on existing traffic while establishing your expertise.`,
      stitch: `Stitch videos from popular ${businessType} creators, starting with their hook, then transitioning to your expanded take. This works best when you can add substantial value or an alternative perspective to the original content.`,
      vlog: `Day-in-the-life content showing how you help ${businessType} clients succeed. Take viewers behind the scenes of your process, showing both challenges and victories to build authenticity and trust.`,
      pov: `Create a POV (point of view) video showing the ${businessType} experience from the customer's perspective. This format creates immersion and helps viewers imagine themselves receiving your solution.`
    }
  };
};

const createMockCourseCurriculum = (topic: string) => {
  return {
    topic: topic || "Business Growth",
    courseDetails: {
      title: `The Complete ${topic} Mastery System`,
      subtitle: `Transform Your Results with Proven ${topic} Strategies That Work in Today's Market`,
      positioning: `Unlike generic ${topic} courses, this program focuses on implementation over theory, with done-for-you templates and weekly accountability to ensure real results.`,
      audienceLevel: "Beginner to Intermediate"
    },
    curriculum: Array.from({ length: 5 }, (_, i) => ({
      moduleNumber: i + 1,
      moduleTitle: `Module ${i + 1}: ${["Foundations", "Strategy Development", "Implementation", "Optimization", "Scaling"][i]} for ${topic} Success`,
      lessons: Array.from({ length: 3 }, (_, j) => ({
        lessonNumber: j + 1,
        lessonTitle: `Lesson ${i + 1}.${j + 1}: ${["Understanding", "Mastering", "Implementing"][j]} ${topic} ${["Fundamentals", "Strategies", "Frameworks", "Systems", "Analytics"][Math.floor(Math.random() * 5)]}`,
        goals: [
          `Understand the core principles of ${topic} ${["success", "growth", "optimization", "strategy"][Math.floor(Math.random() * 4)]}`,
          `Learn how to implement ${topic} techniques in your specific situation`,
          `Develop a customized plan for your ${topic} goals`
        ],
        activities: [
          `Complete the ${topic} assessment worksheet`,
          `Implement one ${topic} strategy in your business this week`
        ],
        quizPrompts: [
          `What are the three key elements of effective ${topic} implementation?`,
          `How do you measure success in your ${topic} efforts?`
        ]
      })),
      cta: `Ready to master ${topic} Module ${i + 1}? Complete the action items and join our weekly implementation call for personalized feedback.`
    })),
    bonusUnits: {
      slidePrompts: [
        `${topic} Quick-Start Guide: 3 Steps to Immediate Results`,
        `Common ${topic} Mistakes and How to Avoid Them`,
        `${topic} Case Study: From Struggle to Success`
      ],
      videoSegments: [
        `${topic} Implementation Walkthrough`,
        `Behind-the-Scenes: ${topic} in Action`,
        `Expert Interview: Advanced ${topic} Strategies`
      ],
      funnelLayout: `The ${topic} course funnel begins with a free workshop teaching one specific technique, followed by a limited-time offer for the full course with fast-action bonuses. Includes upsells for 1:1 coaching and a mastermind community for ongoing support.`,
      ebookDraft: `"The ${topic} Blueprint: A 30-Day Plan for Transforming Your Results" - This companion ebook provides daily action steps, templates, and scripts that complement the course material and accelerate implementation.`
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
    return await callGeminiAPI(prompt);
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
    return `Here's an improved version of your ad with a ${toneStyle} tone:\n\n${originalAd}\n\n(Please try again in a few minutes for a complete rewrite.)`;
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
    return `Here's an improved version of your ad:\n\n${prompt.match(/Original Ad: "([^"]*)"/)?.[1] || "Your ad"}\n\n(Please try again in a few minutes for a complete rewrite.)`;
  } else if (prompt.includes('Take this trending topic and adapt it for this niche')) {
    const trendMatch = prompt.match(/Trending Topic: "([^"]*)"/);
    const nicheMatch = prompt.match(/User's Niche: "([^"]*)"/);
    return createMockTrendRewrite(
      trendMatch ? trendMatch[1] : "trending topic", 
      nicheMatch ? nicheMatch[1] : "your niche"
    );
  } else if (prompt.includes('Create a high-conversion cold email')) {
    const emailTypeMatch = prompt.match(/Email Type: "([^"]*)"/);
    return createMockEmailResult(emailTypeMatch ? emailTypeMatch[1] : "outreach");
  } else if (prompt.includes('Create viral hooks, scripts, hashtags')) {
    const platformMatch = prompt.match(/Platform: ([^\n]*)/);
    const contentTypeMatch = prompt.match(/Content Type: ([^\n]*)/);
    return createMockSocialContent(
      platformMatch ? platformMatch[1] : "social media",
      contentTypeMatch ? contentTypeMatch[1] : "content"
    );
  } else if (prompt.includes('Build ads using these modular components') || prompt.includes('Combine these components into cohesive ads')) {
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
    message: "Our AI is currently processing many requests. Please try again in a few minutes.",
    mockResponse: true,
    timestamp: new Date().toISOString()
  };
};