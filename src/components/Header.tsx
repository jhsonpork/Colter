import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import AuthModal from './auth/AuthModal';
import UserProfileModal from './auth/UserProfileModal';
import SubscriptionStatus from './SubscriptionStatus';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

interface HeaderProps {
  onUpgradeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpgradeClick }) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for success or canceled params from Stripe redirect
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Payment successful! Welcome to Pro Plan!');
    } else if (canceled === 'true') {
      toast.error('Payment canceled. You can try again anytime.');
    }
  }, [searchParams]);

  return (
    <header className="relative z-20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg shadow-lg shadow-yellow-400/25">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">
            Nexus<span className="text-yellow-400">AI</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && <SubscriptionStatus onUpgradeClick={onUpgradeClick} />}
          
          {user ? (
            <UserMenu 
              onProfileClick={() => setIsProfileModalOpen(true)}
              onUpgradeClick={onUpgradeClick}
            />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold rounded-lg 
                       hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-yellow-400/25
                       hover:shadow-yellow-400/40 hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};

export default Header;