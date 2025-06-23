import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }

    // Check for success or canceled params from Stripe redirect
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Payment successful! Welcome to Pro Plan!');
    } else if (canceled === 'true') {
      toast.error('Payment canceled. You can try again anytime.');
    }

    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for upgrading to the Pro Plan! You now have full access to all premium features.
        </p>
        <p className="text-gray-400 mb-8">
          You'll be redirected to the dashboard in a few seconds...
        </p>
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;