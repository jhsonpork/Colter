import React, { useState } from 'react';
import { Send, Loader2, Lock, Download, Copy, Upload, Palette } from 'lucide-react';
import { AdResult } from '../types/ad';
import { generateAd } from '../services/gemini';
import AdPreview from './AdPreview';
import ToneSelector from './ToneSelector';
import { downloadAdPackage } from '../utils/download';

interface AdGeneratorProps {
  onAdGenerated: (ad: AdResult) => void;
  onUpgradeClick: () => void;
  hasUsedFreeTrial: boolean;
  generatedAd?: AdResult | null;
}

const AdGenerator: React.FC<AdGeneratorProps> = ({
  onAdGenerated,
  onUpgradeClick,
  hasUsedFreeTrial,
  generatedAd,
}) => {
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessInfo, setBusinessInfo] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [inputMode, setInputMode] = useState<'description' | 'info'>('description');
  const [adResult, setAdResult] = useState<AdResult | null>(null);

  const handleGenerate = async () => {
    const input = inputMode === 'description' ? businessDescription : businessInfo;
    if (!input.trim()) return;

    if (hasUsedFreeTrial) {
      onUpgradeClick();
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateAd(input, selectedTone, inputMode);
      setAdResult(result);          // ← store it locally
      onAdGenerated(result);        // ← still let parent save it
      setShowResults(true);         // ← now flip into results view
    } catch (error) {
      console.error('Error generating ad:', error);
      alert('There was an error generating your ad. Please try again shortly.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    if (adResult) downloadAdPackage(adResult);
  };

  const handleNewAd = () => {
    setShowResults(false);
    setBusinessDescription('');
    setBusinessInfo('');
    setAdResult(null);
  };

  // Use either the local state or the prop from parent
  const displayAd = adResult || generatedAd;

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {!showResults ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Create Your Viral Ad
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
              {/* Input Mode Toggle */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setInputMode('description')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                    inputMode === 'description'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Quick Description</span>
                </button>
                <button
                  onClick={() => setInputMode('info')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                    inputMode === 'info'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Business Info</span>
                </button>
              </div>

              {/* Tone Selector */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Palette className="w-4 h-4 text-yellow-400" />
                  <label className="text-white font-medium">Ad Tone</label>
                </div>
                <ToneSelector selectedTone={selectedTone} onToneChange={setSelectedTone} />
              </div>

              {/* Textarea */}
              {inputMode === 'description' ? (
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="e.g., I own a coffee shop in downtown..."
                  className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 outline-none resize-none"
                />
              ) : (
                <textarea
                  value={businessInfo}
                  onChange={(e) => setBusinessInfo(e.target.value)}
                  placeholder="Paste your full business info here..."
                  className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 outline-none resize-none"
                />
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!businessDescription.trim() && !businessInfo.trim())}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Your Viral Ad...</span>
                  </>
                ) : hasUsedFreeTrial ? (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Unlock More Ads – $9.99/mo</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Generate My Viral Ad</span>
                  </>
                )}
              </button>
              {!hasUsedFreeTrial && (
                <p className="text-center text-gray-400 text-sm mt-3">✨ Free trial • No credit card required</p>
              )}
            </div>
          </div>
        ) : (
          displayAd && (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
              {/* Header & Actions */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Viral Ad Package is Ready! 🚀
                </h2>
                <div className="flex justify-center space-x-4">
                  <button onClick={handleDownload} className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg font-semibold flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Package</span>
                  </button>
                  <button onClick={handleNewAd} className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Create New Ad</span>
                  </button>
                  <button onClick={onUpgradeClick} className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Generate More Ads</span>
                  </button>
                </div>
              </div>

              {/* Content + Preview */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ad Content */}
                <div className="space-y-6">
                  {/* Headline */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-yellow-400 font-bold text-lg">Viral Headline</h3>
                      <button onClick={() => handleCopy(displayAd.headline)} className="p-2 text-gray-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white text-xl font-semibold">{displayAd.headline}</p>
                  </div>
                  {/* Ad Copy */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-yellow-400 font-bold text-lg">Ad Copy</h3>
                      <button onClick={() => handleCopy(displayAd.adCopy)} className="p-2 text-gray-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{displayAd.adCopy}</p>
                  </div>
                  {/* TikTok Script */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-yellow-400 font-bold text-lg">TikTok Script</h3>
                      <button onClick={() => handleCopy(displayAd.tiktokScript)} className="p-2 text-gray-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap">{displayAd.tiktokScript}</pre>
                  </div>
                  {/* Captions */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-yellow-400 font-bold text-lg mb-4">Caption Variations</h3>
                    <div className="space-y-4">
                      {displayAd.captions.map((cap, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <p className="text-gray-300">#{i + 1} {cap}</p>
                          <button onClick={() => handleCopy(cap)} className="p-2 text-gray-400 hover:text-white">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <AdPreview ad={displayAd} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default AdGenerator;