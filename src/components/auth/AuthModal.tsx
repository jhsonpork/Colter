import React, { useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultView = 'signIn'
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {currentView === 'signIn' && (
          <SignInForm 
            onSuccess={onClose}
            onSignUpClick={() => setCurrentView('signUp')}
            onForgotPasswordClick={() => setCurrentView('forgotPassword')}
          />
        )}
        
        {currentView === 'signUp' && (
          <SignUpForm 
            onSuccess={() => setCurrentView('signIn')}
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

export default AuthModal;