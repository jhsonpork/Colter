import React, { useState } from 'react';
import { Send, Loader2, Lock, Download, Copy } from 'lucide-react';
import { AdResult } from '../types/ad';
import { generateAd } from '../services/gemini';
import AdPreview from './AdPreview';
import ToneSelector from './ToneSelector';
import { downloadAdPackage } from '../utils/download';

interface AdGeneratorProps {
  onAdGenerated: (ad: AdResult) => void;
  onUpgradeClick: () => void;
  hasUsedFreeTrial: boolean;
}

const AdGenerator: React.FC<AdGeneratorProps> = ({
  onAdGenerated,
  onUpgradeClick,
  hasUsedFreeTrial
}) => {
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessInfo, setBusinessInfo] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<AdResult | null>(null);

  const handleGenerate = async () => {
    if (!businessDescription.trim()) return;

    setIsGenerating(true);
    try {
      const ad = await generateAd(businessDescription, selectedTone);
      setGeneratedAd(ad);
      onAdGenerated(ad);
    } catch (err) {
      console.error('Error generating ad:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">7-Day Ad Generator</h1>

      <textarea
        placeholder="Describe your business..."
        value={businessDescription}
        onChange={(e) => setBusinessDescription(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <ToneSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
        Generate
      </button>

      {generatedAd && (
        <div className="mt-6">
          <AdPreview ad={generatedAd} />
        </div>
      )}
    </div>
  );
};

export default AdGenerator;
