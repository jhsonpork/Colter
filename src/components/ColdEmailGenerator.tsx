import React, { useState } from 'react';
import { Mail, Loader2, Lock, Send, Copy, Download } from 'lucide-react';
import { generateColdEmail } from '../services/email';
import { ColdEmailResult } from '../types/email';

interface ColdEmailGeneratorProps {
  onUpgradeClick: () => void;
  hasUsedFreeTrial: boolean;
}

const ColdEmailGenerator: React.FC<ColdEmailGeneratorProps> = ({ onUpgradeClick, hasUsedFreeTrial }) => {
  const [businessDescription, setBusinessDescription] = useState('');
  const [targetNiche, setTargetNiche] = useState('');
  const [emailType, setEmailType] = useState('outreach');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmails, setGeneratedEmails] = useState<ColdEmailResult | null>(null);

  const emailTypes = [
    { id: 'outreach', label: 'Cold Outreach', emoji: '📧' },
    { id: 'partnership', label: 'Partnership', emoji: '🤝' },
    { id: 'sales', label: 'Sales Pitch', emoji: '💰' },
    { id: 'followup', label: 'Follow-up', emoji: '🔄' },
  ];

  const handleGenerate = async () => {
    if (!businessDescription.trim() || !targetNiche.trim()) return;
    
    if (hasUsedFreeTrial) {
      onUpgradeClick();
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateColdEmail(businessDescription, targetNiche, emailType);
      setGeneratedEmails(result);
    } catch (error) {
      console.error('Error generating emails:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setGeneratedEmails(null);
    setBusinessDescription('');
    setTargetNiche('');
    setEmailType('outreach');
  };

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Cold Email Generator
          </h2>
          <p className="text-gray-400">
            Generate high-conversion outreach emails for your business
          </p>
        </div>

        {!generatedEmails ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
              {/* Email Type Selector */}
              <div className="mb-6">
                <label className="text-white font-medium mb-3 block">Email Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {emailTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEmailType(type.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        emailType === type.id
                          ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.emoji}</div>
                      <div>{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Your Business</label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe your business, what you offer, and your unique value proposition..."
                    className="w-full h-24 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white 
                             placeholder-gray-400 focus:border-yellow-400 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Target Niche</label>
                  <input
                    type="text"
                    value={targetNiche}
                    onChange={(e) => setTargetNiche(e.target.value)}
                    placeholder="e.g., SaaS founders, e-commerce store owners, fitness coaches..."
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white 
                             placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !businessDescription.trim() || !targetNiche.trim()}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black 
                         font-bold rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 
                         shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Emails...</span>
                  </>
                ) : hasUsedFreeTrial ? (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Unlock Email Generator - $9.99/mo</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Generate Cold Emails</span>
                  </>
                )}
              </button>
              
              {!hasUsedFreeTrial && (
                <p className="text-center text-gray-400 text-sm mt-3">
                  ✨ Free trial • No credit card required
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Generated Content */}
              <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-yellow-400 font-bold text-lg">Subject Line</h3>
                    <button
                      onClick={() => handleCopy(generatedEmails.subject)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white text-lg font-semibold">{generatedEmails.subject}</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-yellow-400 font-bold text-lg">Email Body</h3>
                    <button
                      onClick={() => handleCopy(generatedEmails.emailBody)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line bg-gray-900/50 rounded-lg p-4">
                    {generatedEmails.emailBody}
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-yellow-400 font-bold text-lg mb-4">Follow-up Sequence</h3>
                  <div className="space-y-4">
                    {generatedEmails.followUps.map((followUp, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">Follow-up #{index + 1}</h4>
                          <button
                            onClick={() => handleCopy(followUp)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm">{followUp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email Stats & Strategy */}
              <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-yellow-400 font-bold text-lg mb-4">Email Performance Metrics</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <span className="text-gray-300">Spam Score</span>
                      <span className="text-green-400 font-semibold">{generatedEmails.spamScore}/10</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <span className="text-gray-300">Estimated Open Rate</span>
                      <span className="text-green-400 font-semibold">{generatedEmails.openRatePrediction}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <span className="text-gray-300">Estimated Response Rate</span>
                      <span className="text-green-400 font-semibold">{generatedEmails.responseRatePrediction}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-yellow-400 font-bold text-lg mb-4">Cold Email Strategy</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <h4 className="text-white font-semibold mb-2">Best Practices</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Personalize each email with recipient's name and company</li>
                        <li>• Send between 8am-10am or 3pm-4pm local time</li>
                        <li>• Follow up 3-5 days after initial email</li>
                        <li>• Keep subject lines under 50 characters</li>
                        <li>• Include only one clear call-to-action</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <h4 className="text-white font-semibold mb-2">Follow-up Strategy</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• First follow-up: 3-4 days after initial email</li>
                        <li>• Second follow-up: 7 days after first follow-up</li>
                        <li>• Final follow-up: 14 days after second follow-up</li>
                        <li>• Vary your approach in each follow-up</li>
                        <li>• End sequence with a "break-up" email</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
                  <h3 className="text-yellow-400 font-bold text-lg mb-4">Actions</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => handleCopy(`Subject: ${generatedEmails.subject}\n\n${generatedEmails.emailBody}`)}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg font-semibold flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Complete Email</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Create New Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ColdEmailGenerator;