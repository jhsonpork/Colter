import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  onUpgradeClick: () => void;
}

const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({ children, onUpgradeClick }) => {
  const { isSubscribed, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-400/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-700 rounded mb-3"></div>
          <div className="h-3 w-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Feature</h2>
          <p className="text-gray-300 mb-6">
            This feature is available exclusively to Pro subscribers. Upgrade now to access all premium features.
          </p>
          <button
            onClick={onUpgradeClick}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 flex items-center space-x-2 mx-auto"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedFeature;