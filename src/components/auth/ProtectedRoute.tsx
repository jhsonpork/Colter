import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Only show loading spinner after a short delay to avoid flashing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 300);
    } else {
      setShowLoading(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  // Show error if loading takes too long
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (loading) {
      timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000); // 10 seconds
    } else {
      setLoadingTimeout(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  // Show error message if loading times out
  useEffect(() => {
    if (loadingTimeout) {
      setShowError(true);
    }
  }, [loadingTimeout]);

  // If loading timed out, show error with retry button
  if (showError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Loading Timed Out</h2>
          <p className="text-gray-300 mb-6">
            We're having trouble loading your account information. This could be due to network issues or authentication problems.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg"
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/auth';
              }}
              className="w-full px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg"
            >
              Sign Out & Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
          <p className="text-gray-300">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If logged in, show protected content
  return <>{children}</>;
};

export default ProtectedRoute;