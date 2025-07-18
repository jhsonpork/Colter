import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export interface Subscription {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  payment_method_last4: string | null;
  payment_method_brand: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Special case for admin account
        if (user.email === 'nafismahim123@gmail.com' || user.email?.includes('nafismahim123')) {
          setSubscription({
            subscription_status: 'active',
            price_id: 'price_1RYfLQACZYrdFwrXSy38VoEl',
            current_period_end: Math.floor(Date.now() / 1000) + 31536000, // 1 year from now
            payment_method_last4: null,
            payment_method_brand: null
          });
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const isSubscribed = subscription?.subscription_status === 'active';

  return {
    subscription,
    isSubscribed,
    loading,
    error,
  };
}