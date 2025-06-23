import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import LoadingDebug from '../LoadingDebug';

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
    return <LoadingDebug />;
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