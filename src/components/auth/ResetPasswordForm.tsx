import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the access token in the URL
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) {
      toast.error('Invalid or expired reset link');
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Password updated successfully');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Password Reset Complete</h2>
          <p className="text-gray-400 mb-6">
            Your password has been updated successfully. You'll be redirected to the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Reset Your Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white font-medium mb-2 block">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>
        
        <div>
          <label className="text-white font-medium mb-2 block">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black 
                   font-bold rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 
                   shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Reset Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;