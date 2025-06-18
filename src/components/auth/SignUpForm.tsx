import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSignInClick: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onSignInClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

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
      const { error } = await signUp(email, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Check your email to confirm your account.');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white font-medium mb-2 block">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>
        
        <div>
          <label className="text-white font-medium mb-2 block">Password</label>
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
          <label className="text-white font-medium mb-2 block">Confirm Password</label>
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <User className="w-5 h-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <button 
            onClick={onSignInClick}
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;