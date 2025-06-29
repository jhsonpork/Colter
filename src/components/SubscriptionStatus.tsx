import React, { useEffect, useState } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import toast from 'react-hot-toast';

interface SubscriptionStatusProps {
  onUpgradeClick: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ onUpgradeClick }) => {
  const { user } = useAuth();
  const { subscription, isSubscribed, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30">
        <Crown className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 text-sm font-medium">Pro Plan</span>
      </div>
    );
  }

  return (
    <button
      onClick={onUpgradeClick}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-medium hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <Crown className="w-4 h-4" />
      <span>Upgrade to Pro</span>
    </button>
  );
};

export default SubscriptionStatus;