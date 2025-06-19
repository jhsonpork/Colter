import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, ChevronDown, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import toast from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserMenuProps {
  onProfileClick: () => void;
  onUpgradeClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onProfileClick, onUpgradeClick }) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      getProfile();
      checkSubscription();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status')
        .single();
      
      if (!error && data) {
        setIsSubscribed(data.subscription_status === 'active' || 
                       data.subscription_status === 'trialing');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <span className="text-white text-sm hidden md:block">
          {profile?.full_name || user.email?.split('@')[0] || 'User'}
        </span>
        {isSubscribed && (
          <Crown className="w-4 h-4 text-yellow-400" />
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-gray-700">
            <p className="text-white font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
            {isSubscribed && (
              <div className="flex items-center space-x-1 mt-1 text-xs text-yellow-400">
                <Crown className="w-3 h-3" />
                <span>Pro Subscriber</span>
              </div>
            )}
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onProfileClick();
              }}
              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
            {!isSubscribed && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onUpgradeClick();
                }}
                className="w-full text-left px-3 py-2 text-yellow-400 hover:bg-gray-700 rounded flex items-center space-x-2"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Pro</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;