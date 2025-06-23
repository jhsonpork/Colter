import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingDebug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Capture console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      setLogs(prev => [...prev, `LOG: ${args.map(arg => JSON.stringify(arg)).join(' ')}`]);
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev, `ERROR: ${args.map(arg => JSON.stringify(arg)).join(' ')}`]);
      originalConsoleError(...args);
    };

    console.warn = (...args) => {
      setLogs(prev => [...prev, `WARN: ${args.map(arg => JSON.stringify(arg)).join(' ')}`]);
      originalConsoleWarn(...args);
    };

    // Check for common issues
    const checkAuth = async () => {
      try {
        // Check localStorage for auth tokens
        const hasSession = localStorage.getItem('supabase.auth.token');
        setLogs(prev => [...prev, `Auth session found: ${Boolean(hasSession)}`]);
        
        // Check network requests
        const networkLogs = performance.getEntriesByType('resource');
        const failedRequests = networkLogs.filter(entry => {
          // @ts-ignore
          return entry.responseStatus >= 400;
        });
        
        if (failedRequests.length > 0) {
          setLogs(prev => [...prev, `Failed network requests detected: ${failedRequests.length}`]);
        }
        
        // Check for memory issues
        if (window.performance && 'memory' in window.performance) {
          const memoryInfo = (window.performance as any).memory;
          setLogs(prev => [...prev, `Memory usage: ${Math.round(memoryInfo.usedJSHeapSize / 1048576)}MB / ${Math.round(memoryInfo.jsHeapSizeLimit / 1048576)}MB`]);
        }
      } catch (error) {
        setLogs(prev => [...prev, `Error during checks: ${error}`]);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
          <h2 className="text-xl font-bold text-white">Loading Diagnostics</h2>
        </div>
        
        {isChecking ? (
          <p className="text-gray-400">Running diagnostics...</p>
        ) : (
          <>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-xs font-mono mb-1 ${
                      log.startsWith('ERROR') 
                        ? 'text-red-400' 
                        : log.startsWith('WARN') 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No logs captured</p>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-semibold">Common Issues:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Auth token expiration or refresh issues</li>
                <li>• API request failures (check network tab)</li>
                <li>• Infinite render loops in React components</li>
                <li>• Missing error handling in async operations</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingDebug;