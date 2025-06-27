import React, { useState } from 'react';
import { Calendar, Loader2, Send } from 'lucide-react';
import { generateCampaign } from '../services/gemini';
import { SavedCampaign, CampaignDay } from '../types/ad';
import ToneSelector from './ToneSelector';
import { downloadCampaignPackage } from '../utils/download';

interface CampaignGeneratorProps {
  onCampaignGenerated: (campaign: SavedCampaign) => void;
  onUpgradeClick: () => void;
  hasUsedFreeTrial: boolean;
}

const CampaignGenerator: React.FC<CampaignGeneratorProps> = ({
  onCampaignGenerated,
  onUpgradeClick,
  hasUsedFreeTrial,
}) => {
  const [businessDescription, setBusinessDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignDays, setCampaignDays] = useState<CampaignDay[] | null>(null);

  const handleGenerate = async () => {
    if (!businessDescription.trim()) return;

    setIsGenerating(true);
    try {
      const days = await generateCampaign(businessDescription, selectedTone);
      setCampaignDays(days);
      const campaign: SavedCampaign = {
        id: Date.now().toString(),
        name: '7-Day Campaign',
        type: '7day',
        createdAt: new Date().toISOString(),
        ad: null,
        days,
      };
      onCampaignGenerated(campaign);
    } catch (err) {
      console.error('Error generating campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">7-Day Campaign Generator</h1>

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

      {campaignDays && (
        <div className="mt-6 space-y-4">
          {campaignDays.map((day, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded shadow">
              <h2 className="text-lg font-semibold">Day {index + 1}</h2>
              <p className="mt-2">{day.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignGenerator;
