import React, { useEffect, useState } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SubscriptionStatusProps {
  onUpgradeClick: () => void;
}

interface Subscription {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ onUpgradeClick }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
          // Don't show error toast for subscription fetch errors to avoid confusion
        } else {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error in subscription fetch:', error);
        // Don't show error toast for subscription fetch errors to avoid confusion
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
    
    // Set up a subscription refresh interval
    const interval = setInterval(() => {
      if (user) {
        fetchSubscription();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  const isActive = subscription?.subscription_status === 'active';

  if (isActive) {
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