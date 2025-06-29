import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Zap } from 'lucide-react';

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('signIn');
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the previous location from state, or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user && !loading) {
      // Redirect back to the page they were trying to access
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-yellow-400">
          <Zap className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg shadow-lg shadow-yellow-400/25 mr-3">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold text-white">
            Nexus<span className="text-yellow-400">AI</span>
          </span>
        </div>

        {currentView === 'signIn' && (
          <SignInForm 
            onSignUpClick={() => setCurrentView('signUp')}
            onForgotPasswordClick={() => setCurrentView('forgotPassword')}
          />
        )}
        
        {currentView === 'signUp' && (
          <SignUpForm 
            onSignInClick={() => setCurrentView('signIn')}
          />
        )}
        
        {currentView === 'forgotPassword' && (
          <ForgotPasswordForm 
            onBackToSignIn={() => setCurrentView('signIn')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;