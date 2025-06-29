import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Generate Viral Ads Like a $10K Creative Agency';
  
  // For the typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // For the expandable feature containers
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const toggleFeature = (feature: string) => {
    if (expandedFeature === feature) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(feature);
    }
  };

  const features = [
    {
      id: 'viral-headlines',
      title: 'Viral Headlines',
      icon: TrendingUp,
      description: 'AI-crafted headlines that stop scrolling and drive clicks',
      details: [
        'Psychological triggers that capture attention instantly',
        'Optimized for maximum click-through rates',
        'Personalized to your specific business niche',
        'Tested formulas used by top marketing agencies',
        'Designed to boost engagement across all platforms'
      ]
    },
    {
      id: 'tiktok-scripts',
      title: 'TikTok Scripts',
      icon: Target,
      description: 'Ready-to-use video scripts optimized for viral content',
      details: [
        'Perfectly timed scripts with hook, problem, solution structure',
        'Trending formats that maximize algorithm performance',
        'Emotional triggers that keep viewers watching',
        'Clear call-to-actions that drive conversions',
        'Adaptable for multiple social platforms'
      ]
    },
    {
      id: 'ad-previews',
      title: 'Ad Previews',
      icon: Sparkles,
      description: 'Visual ad mockups ready for Facebook and Instagram',
      details: [
        'Professional-looking ad layouts without design skills',
        'Platform-specific optimizations for each network',
        'Performance predictions based on industry benchmarks',
        'Mobile and desktop preview capabilities',
        'Export options for immediate campaign use'
      ]
    }
  ];

  return (
    <section className="relative px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/20 
                      rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium">
            AI-POWERED AD GENERATION
          </span>
        </div>

        {/* Main Heading with Typing Effect */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="text-yellow-400">Hand-Picked</span> Viral Ads
          <br />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Transform your business description into viral ad copy, TikTok scripts, and Facebook ads 
          that convert - all in under 10 seconds.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            const isExpanded = expandedFeature === feature.id;
            
            return (
              <div key={feature.id} className="relative">
                <div 
                  className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-yellow-400/30 transition-all duration-300 cursor-pointer ${isExpanded ? 'border-yellow-400/50' : ''}`}
                  onClick={() => toggleFeature(feature.id)}
                >
                  <IconComponent className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                  
                  <div className="absolute bottom-3 right-3">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Expandable content */}
                <div 
                  className={`mt-2 bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0 border-0'
                  }`}
                >
                  <h4 className="text-yellow-400 font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;