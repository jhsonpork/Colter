import React from 'react';
import { X, Check, Zap, Crown, Star } from 'lucide-react';
import { stripeProducts, successUrl, cancelUrl } from '../stripe-config';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PricingModalProps {
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: stripeProducts.proSubscription.priceId,
          mode: stripeProducts.proSubscription.mode,
          successUrl,
          cancelUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Upgrade to Pro</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-gray-400" />
                <h3 className="text-xl font-bold text-white">Free Trial</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">$0</div>
              <p className="text-gray-400 mb-6">Perfect for testing</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">1 viral ad generation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Basic ad preview</span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-gray-500">Multiple ad styles</span>
                </li>
                <li className="flex items-center space-x-3">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-gray-500">Export to multiple formats</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-yellow-400/10 to-amber-500/10 border border-yellow-400/30 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-6">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>MOST POPULAR</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4 mt-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Pro Plan</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                $25.99
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-6">Unlimited viral ads</p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Unlimited ad generations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">10+ ad styles & formats</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Advanced AI prompts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Export to PDF, HTML, PNG</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Cancel anytime</span>
                </li>
              </ul>

              <button
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black 
                         font-bold rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 
                         shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Start Pro Plan - $25.99/mo'}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              🔒 Secure payment powered by Stripe • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;