import React, { useState } from 'react';
import { Zap, Calendar, RefreshCw, Archive, Mail, Video, Users, Download, GitCompare, Target, Lightbulb, TrendingUp, Shuffle, Palette, Package, Search, BarChart3, Heart, AlertTriangle, Settings, Play, Camera, Brain, MessageSquare, RotateCcw, UserCheck, ArrowUpDown, Layers, MessageCircle, Blocks, BookOpen, Puzzle, Crosshair, Shield, Clock, UserPlus, TestTube, Monitor, Dice6, Magnet, Activity, Zap as ZapIcon, Target as TargetIcon, Play as PlayIcon, Fuel as Funnel, BookOpen as BookOpenIcon, MessageSquare as MessageSquareIcon, ListOrdered, Clock as ClockIcon, Shield as ShieldIcon, BarChartHorizontal, DollarSign, LayoutTemplate, GraduationCap, ChevronDown, Rocket, CalendarDays, Wrench, Briefcase, PackageOpen, AlertOctagon, Coins, FileImage, FileBox, HandshakeIcon, FileText, Globe, PresentationIcon } from 'lucide-react';
import MoreFeaturesDropdown from './MoreFeaturesDropdown';
import { useSubscription } from '../hooks/useSubscription';

type ActivePage = 'generator' | 'campaign' | 'rewriter' | 'saved' | 'email' | 'social' | 'influencer' | 'export' |
  'comparator' | 'personas' | 'angles' | 'trend-rewriter' | 'ab-variations' | 'tone-polisher' | 'campaign-pack' | 'hook-analyzer' |
  'headline-tester' | 'audience-analyzer' | 'pain-extractor' | 'offer-optimizer' | 'script-skit' | 'storyboard' | 
  'emotion-mapper' | 'controversial' | 'flip-script' | 'persona-cta' | 'before-after' | 'metaphor' | 'comment-bait' | 'ad-blocks' |
  // NEW FINAL 12 FEATURES
  'ad-explainer' | 'modular-assembler' | 'goal-matcher' | 'deviralizer' | 'first-3-seconds' | 'cta-personalizer' |
  'psych-test' | 'visual-builder' | 'style-roulette' | 'magnet-breakdown' | 'performance-predictor' | 'memory-test' |
  // MORE FEATURES
  'offer-angle-matcher' | 'hook-frame-tester' | 'creator-funnel-builder' | 'course-summary-generator' |
  'comment-exploder' | 'viral-cta-sequencer' | 'platform-timing-forecaster' | 'content-ethics-sanitizer' |
  'value-ladder-builder' | 'monetization-generator' | 'content-framework-builder' | 'course-curriculum-builder' |
  // 10 NEW ADDITIONAL FEATURES
  'startup-engine' | 'content-calendar' | 'prompt-debugger' | 'agency-automator' | 'product-launch' |
  'failure-analyzer' | 'income-streams' | 'infographic-wizard' | 'digital-product' | 'collab-connector' |
  // NEW BUSINESS FEATURES
  'contract-negotiator' | 'regulation-scanner' | 'monetization-multiplier' | 'crisis-comms' | 'acquisition-translator' |
  'churn-autopsy' | 'global-payroll' | 'ip-strategy' | 'board-meeting' | 'exit-multiplier' |
  // NEW BLUE FEATURES
  'idea-to-company' | 'auto-ghostwriter' | 'decision-clarity' | 'breakpoint-fixer' | 'hyperpersona' |
  'perfect-pricing' | 'audience-trigger' | 'startup-strategy' | 'mini-saas' | 'distribution-stack';

interface NavigationProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activePage, onPageChange }) => {
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const { isSubscribed } = useSubscription();
  
  const navItems = [
    // Core Features (3)
    { id: 'generator' as ActivePage, label: 'Ad Generator', icon: Zap, category: 'core' },
    { id: 'campaign' as ActivePage, label: '7-Day Campaign', icon: Calendar, category: 'core' },
    { id: 'rewriter' as ActivePage, label: 'Ad Rewriter', icon: RefreshCw, category: 'core' },
    
    // Analysis Tools (5)
    { id: 'comparator' as ActivePage, label: 'Ad Comparator', icon: GitCompare, category: 'analysis', badge: 'NEW' },
    { id: 'hook-analyzer' as ActivePage, label: 'Hook Analyzer', icon: Search, category: 'analysis', badge: 'NEW' },
    { id: 'personas' as ActivePage, label: 'Persona Profiler', icon: Target, category: 'analysis', badge: 'NEW' },
    { id: 'headline-tester' as ActivePage, label: 'Headline Tester', icon: BarChart3, category: 'analysis', badge: 'NEW' },
    { id: 'audience-analyzer' as ActivePage, label: 'Audience Analyzer', icon: Heart, category: 'analysis', badge: 'NEW' },
    
    // Content Generation (5)
    { id: 'angles' as ActivePage, label: 'Content Angles', icon: Lightbulb, category: 'content', badge: 'NEW' },
    { id: 'trend-rewriter' as ActivePage, label: 'Trend Rewriter', icon: TrendingUp, category: 'content', badge: 'NEW' },
    { id: 'ab-variations' as ActivePage, label: 'A/B Variations', icon: Shuffle, category: 'content', badge: 'NEW' },
    { id: 'tone-polisher' as ActivePage, label: 'Tone Polisher', icon: Palette, category: 'content', badge: 'NEW' },
    { id: 'campaign-pack' as ActivePage, label: 'Campaign Pack', icon: Package, category: 'content', badge: 'NEW' },
    
    // Specialized Tools (3)
    { id: 'email' as ActivePage, label: 'Cold Email', icon: Mail, category: 'specialized' },
    { id: 'social' as ActivePage, label: 'Social Blitz', icon: Video, category: 'specialized' },
    { id: 'influencer' as ActivePage, label: 'Influencer Pitch', icon: Users, category: 'specialized' },
    
    // Management (2)
    { id: 'export' as ActivePage, label: 'Campaign Export', icon: Download, category: 'management' },
    { id: 'saved' as ActivePage, label: 'Saved Campaigns', icon: Archive, category: 'management' },

    // ADVANCED FEATURES (12)
    { id: 'pain-extractor' as ActivePage, label: 'Pain Point Extractor', icon: AlertTriangle, category: 'advanced', badge: 'PRO' },
    { id: 'offer-optimizer' as ActivePage, label: 'Offer Optimizer', icon: Settings, category: 'advanced', badge: 'PRO' },
    { id: 'script-skit' as ActivePage, label: 'Script to Skit', icon: Play, category: 'advanced', badge: 'PRO' },
    { id: 'storyboard' as ActivePage, label: 'Storyboard Builder', icon: Camera, category: 'advanced', badge: 'PRO' },
    { id: 'emotion-mapper' as ActivePage, label: 'Emotion Mapper', icon: Brain, category: 'advanced', badge: 'PRO' },
    { id: 'controversial' as ActivePage, label: 'Controversial Takes', icon: MessageSquare, category: 'advanced', badge: 'PRO' },
    { id: 'flip-script' as ActivePage, label: 'Flip Script', icon: RotateCcw, category: 'advanced', badge: 'PRO' },
    { id: 'persona-cta' as ActivePage, label: 'Persona CTA', icon: UserCheck, category: 'advanced', badge: 'PRO' },
    { id: 'before-after' as ActivePage, label: 'Before/After Ads', icon: ArrowUpDown, category: 'advanced', badge: 'PRO' },
    { id: 'metaphor' as ActivePage, label: 'Metaphor Magic', icon: Layers, category: 'advanced', badge: 'PRO' },
    { id: 'comment-bait' as ActivePage, label: 'Comment Bait', icon: MessageCircle, category: 'advanced', badge: 'PRO' },
    { id: 'ad-blocks' as ActivePage, label: 'Ad Block Builder', icon: Blocks, category: 'advanced', badge: 'PRO' },

    // NEW FINAL 12 FEATURES (12)
    { id: 'ad-explainer' as ActivePage, label: 'Ad Version Explainer', icon: BookOpen, category: 'premium', badge: 'PRO' },
    { id: 'modular-assembler' as ActivePage, label: 'Modular Assembler 2.0', icon: Puzzle, category: 'premium', badge: 'PRO' },
    { id: 'goal-matcher' as ActivePage, label: 'Ad Goal Matcher', icon: Crosshair, category: 'premium', badge: 'PRO' },
    { id: 'deviralizer' as ActivePage, label: 'Deviralizer', icon: Shield, category: 'premium', badge: 'PRO' },
    { id: 'first-3-seconds' as ActivePage, label: 'First 3 Seconds', icon: Clock, category: 'premium', badge: 'PRO' },
    { id: 'cta-personalizer' as ActivePage, label: 'CTA Personalizer', icon: UserPlus, category: 'premium', badge: 'PRO' },
    { id: 'psych-test' as ActivePage, label: 'Psych Test', icon: TestTube, category: 'premium', badge: 'PRO' },
    { id: 'visual-builder' as ActivePage, label: 'Visual Ad Builder', icon: Monitor, category: 'premium', badge: 'PRO' },
    { id: 'style-roulette' as ActivePage, label: 'Style Roulette', icon: Dice6, category: 'premium', badge: 'PRO' },
    { id: 'magnet-breakdown' as ActivePage, label: 'Ad Magnet Breakdown', icon: Magnet, category: 'premium', badge: 'PRO' },
    { id: 'performance-predictor' as ActivePage, label: 'Performance Predictor', icon: Activity, category: 'premium', badge: 'PRO' },
    { id: 'memory-test' as ActivePage, label: 'Hook Memory Test', icon: ZapIcon, category: 'premium', badge: 'PRO' },
    
    // BLUE FEATURES (10)
    { id: 'idea-to-company' as ActivePage, label: 'Idea-to-Company', icon: Rocket, category: 'blue', badge: 'PRO' },
    { id: 'auto-ghostwriter' as ActivePage, label: 'Auto-Ghostwriter', icon: FileText, category: 'blue', badge: 'PRO' },
    { id: 'decision-clarity' as ActivePage, label: 'Decision Clarity', icon: Target, category: 'blue', badge: 'PRO' },
    { id: 'breakpoint-fixer' as ActivePage, label: 'Breakpoint Fixer', icon: Wrench, category: 'blue', badge: 'PRO' },
    { id: 'hyperpersona' as ActivePage, label: 'HyperPersona', icon: Users, category: 'blue', badge: 'PRO' },
    { id: 'perfect-pricing' as ActivePage, label: 'Perfect Pricing', icon: DollarSign, category: 'blue', badge: 'PRO' },
    { id: 'audience-trigger' as ActivePage, label: 'Audience Trigger', icon: Target, category: 'blue', badge: 'PRO' },
    { id: 'startup-strategy' as ActivePage, label: 'Startup Strategy', icon: Rocket, category: 'blue', badge: 'PRO' },
    { id: 'mini-saas' as ActivePage, label: 'Mini SaaS', icon: Package, category: 'blue', badge: 'PRO' },
    { id: 'distribution-stack' as ActivePage, label: 'Distribution Stack', icon: Layers, category: 'blue', badge: 'PRO' },
  ];

  // MORE FEATURES (11)
  const moreFeatures = [
    { id: 'offer-angle-matcher' as ActivePage, label: 'Offer Angle Matcher', icon: TargetIcon, badge: 'PRO' },
    { id: 'hook-frame-tester' as ActivePage, label: 'Hook Frame Tester', icon: PlayIcon, badge: 'PRO' },
    { id: 'creator-funnel-builder' as ActivePage, label: 'Creator Funnel Builder', icon: Funnel, badge: 'PRO' },
    { id: 'course-summary-generator' as ActivePage, label: 'Course Summary Generator', icon: BookOpenIcon, badge: 'PRO' },
    { id: 'comment-exploder' as ActivePage, label: 'Comment Exploder', icon: MessageSquareIcon, badge: 'PRO' },
    { id: 'viral-cta-sequencer' as ActivePage, label: 'Viral CTA Sequencer', icon: ListOrdered, badge: 'PRO' },
    { id: 'platform-timing-forecaster' as ActivePage, label: 'Timing Forecaster', icon: ClockIcon, badge: 'PRO' },
    { id: 'content-ethics-sanitizer' as ActivePage, label: 'Ethics Sanitizer', icon: ShieldIcon, badge: 'PRO' },
    { id: 'value-ladder-builder' as ActivePage, label: 'Value Ladder Builder', icon: BarChartHorizontal, badge: 'PRO' },
    { id: 'monetization-generator' as ActivePage, label: 'Monetizer', icon: DollarSign, badge: 'PRO' },
    { id: 'content-framework-builder' as ActivePage, label: 'Content Framework', icon: LayoutTemplate, badge: 'PRO' },
    { id: 'course-curriculum-builder' as ActivePage, label: 'Course Curriculum', icon: GraduationCap, badge: 'PRO' },
  ];
  
  // 10 NEW ADDITIONAL FEATURES
  const additionalFeatures = [
    { id: 'startup-engine' as ActivePage, label: 'Startup Engine', icon: Rocket, badge: 'PRO' },
    { id: 'content-calendar' as ActivePage, label: 'Content Calendar', icon: CalendarDays, badge: 'PRO' },
    { id: 'prompt-debugger' as ActivePage, label: 'Prompt Debugger', icon: Wrench, badge: 'PRO' },
    { id: 'agency-automator' as ActivePage, label: 'Agency Automator', icon: Briefcase, badge: 'PRO' },
    { id: 'product-launch' as ActivePage, label: 'Product Launch', icon: PackageOpen, badge: 'PRO' },
    { id: 'failure-analyzer' as ActivePage, label: 'Failure Analyzer', icon: AlertOctagon, badge: 'PRO' },
    { id: 'income-streams' as ActivePage, label: 'Income Streams', icon: Coins, badge: 'PRO' },
    { id: 'infographic-wizard' as ActivePage, label: 'Infographic Wizard', icon: FileImage, badge: 'PRO' },
    { id: 'digital-product' as ActivePage, label: 'Digital Product', icon: FileBox, badge: 'PRO' },
    { id: 'collab-connector' as ActivePage, label: 'Collab Connector', icon: HandshakeIcon, badge: 'PRO' },
  ];

  // 10 NEW BUSINESS FEATURES
  const businessFeatures = [
    { id: 'contract-negotiator' as ActivePage, label: 'Contract Negotiator', icon: FileText, badge: 'PRO' },
    { id: 'regulation-scanner' as ActivePage, label: 'Regulation Scanner', icon: ShieldIcon, badge: 'PRO' },
    { id: 'monetization-multiplier' as ActivePage, label: 'Monetization Multiplier', icon: DollarSign, badge: 'PRO' },
    { id: 'crisis-comms' as ActivePage, label: 'Crisis Comms', icon: AlertOctagon, badge: 'PRO' },
    { id: 'acquisition-translator' as ActivePage, label: 'Acquisition Translator', icon: FileText, badge: 'PRO' },
    { id: 'churn-autopsy' as ActivePage, label: 'Churn Autopsy', icon: BarChartHorizontal, badge: 'PRO' },
    { id: 'global-payroll' as ActivePage, label: 'Global Payroll', icon: Globe, badge: 'PRO' },
    { id: 'ip-strategy' as ActivePage, label: 'IP Strategy', icon: ShieldIcon, badge: 'PRO' },
    { id: 'board-meeting' as ActivePage, label: 'Board Meeting', icon: PresentationIcon, badge: 'PRO' },
    { id: 'exit-multiplier' as ActivePage, label: 'Exit Multiplier', icon: DollarSign, badge: 'PRO' },
  ];

  const newFeatures = [
    'comparator', 'hook-analyzer', 'personas', 'angles', 'trend-rewriter', 
    'ab-variations', 'tone-polisher', 'campaign-pack', 'headline-tester', 'audience-analyzer'
  ];

  const advancedFeatures = [
    'pain-extractor', 'offer-optimizer', 'script-skit', 'storyboard', 'emotion-mapper',
    'controversial', 'flip-script', 'persona-cta', 'before-after', 'metaphor', 'comment-bait', 'ad-blocks'
  ];

  const premiumFeatures = [
    'ad-explainer', 'modular-assembler', 'goal-matcher', 'deviralizer', 'first-3-seconds', 'cta-personalizer',
    'psych-test', 'visual-builder', 'style-roulette', 'magnet-breakdown', 'performance-predictor', 'memory-test'
  ];

  const blueFeatures = [
    'idea-to-company', 'auto-ghostwriter', 'decision-clarity', 'breakpoint-fixer', 'hyperpersona',
    'perfect-pricing', 'audience-trigger', 'startup-strategy', 'mini-saas', 'distribution-stack'
  ];

  const isMoreFeature = moreFeatures.some(f => f.id === activePage);
  const isAdditionalFeature = additionalFeatures.some(f => f.id === activePage);
  const isBusinessFeature = businessFeatures.some(f => f.id === activePage);
  const isBlueFeature = blueFeatures.some(f => f.id === activePage);

  return (
    <nav className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Headers */}
        <div className="text-center mb-6">
          <h3 className="text-yellow-400 font-bold text-lg mb-2">🚀 All Features Available</h3>
          <p className="text-gray-400 text-sm">73 powerful AI tools for viral marketing and business growth</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isPro = advancedFeatures.includes(id) || premiumFeatures.includes(id) || 
                         blueFeatures.includes(id) || moreFeatures.some(f => f.id === id) || 
                         additionalFeatures.some(f => f.id === id) || businessFeatures.some(f => f.id === id);
            
            return (
              <button
                key={id}
                onClick={() => onPageChange(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-xs relative ${
                  activePage === id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
                {/* Badge for features */}
                {badge && (
                  <span className={`absolute -top-1 -right-1 ${
                    badge === 'NEW' ? 'bg-red-500' : 
                    badge === 'ADV' ? 'bg-purple-500' : 
                    badge === 'PRO' ? (isSubscribed ? 'bg-green-500' : 'bg-gradient-to-r from-yellow-400 to-amber-500') :
                    badge === 'BIZ' ? 'bg-blue-500' :
                    'bg-blue-500'
                  } text-${badge === 'PRO' && !isSubscribed ? 'black' : 'white'} text-xs px-1 rounded-full font-bold`}>
                    {isSubscribed && badge === 'PRO' ? 'PRO' : badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Button */}
          <MoreFeaturesDropdown 
            moreFeatures={moreFeatures}
            businessFeatures={businessFeatures}
            onFeatureSelect={onPageChange}
            activeFeature={activePage}
          />
        </div>
        
        {/* Feature Categories */}
        <div className="mt-6 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>🎯 <strong>Analysis:</strong> Comparator, Hook Analyzer, Personas, Headlines, Audience</span>
            <span>✨ <strong>Content:</strong> Angles, Trend Rewriter, A/B Variations, Tone Polisher, Campaign Pack</span>
            <span>🚀 <strong>Specialized:</strong> Email, Social, Influencer</span>
            <span>🧠 <strong>Advanced:</strong> Pain Points, Offers, Scripts, Emotions, CTAs + 7 more</span>
            <span>💎 <strong>Premium:</strong> Ad Explainer, Modular Builder, Goal Matcher + 9 more</span>
            <span>🔍 <strong>More:</strong> Offer Matcher, Hook Tester, Funnel Builder + 18 more</span>
            <span>💼 <strong>Business:</strong> Contract Negotiator, Regulation Scanner + 8 more</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;