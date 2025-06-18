import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToSignIn }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message);
      } else {
        setIsSubmitted(true);
        toast.success('Password reset link sent to your email');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
        <div className="text-center">
          <KeyRound className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400 mb-6">
            We've sent a password reset link to <span className="text-white">{email}</span>
          </p>
          <button
            onClick={onBackToSignIn}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 
                     transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h2>
      <p className="text-gray-400 mb-6 text-center">
        Enter your email and we'll send you a link to reset your password
      </p>
      
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
              <span>Sending Reset Link...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-5 h-5" />
              <span>Send Reset Link</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button 
          onClick={onBackToSignIn}
          className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center space-x-1 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;