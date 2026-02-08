import React from 'react';
import { useSecureEnvironment } from './hooks/useSecureEnvironment';
import { Button } from './components/ui/Button';
import { TestInterface } from './components/secure-test/TestInterface';

export const App: React.FC = () => {
  const TOLERANCE = 3;
  const { isFullscreen, violations, enterFullscreen, isExceeded } = useSecureEnvironment(TOLERANCE);

  // 1. Termination State: User exceeded allowed exits
  if (isExceeded) {
    return (
      <div className="terminated">
        <h1 style={{ color: '#dc2626' }}>Assessment Revoked</h1>
        <p>Security protocol breach: Multiple fullscreen exits detected.</p>
        <p>Please contact your administrator. Attempt ID: ATTEMPT_TS_001</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh]">
      {/* 2. Security Modal: Shown when NOT in fullscreen */}
      {!isFullscreen && (
        <div className="warning-overlay">
          <div className="modal">
            <h2 className="text-2xl font-bold mb-4">Security Lockdown Active</h2>
            <p className="mb-2">This assessment requires a dedicated fullscreen environment.</p>
            <p className="text-sm text-slate-500 mb-6">
              Exits detected: <span className="font-bold text-red-600">{violations} / {TOLERANCE}</span>
            </p>
            <Button onClick={enterFullscreen} variant="primary" size="lg">
              {violations === 0 ? "Start Assessment" : "Resume Assessment"}
            </Button>
            <p className="mt-4 text-xs text-slate-400">
              Note: Exceeding {TOLERANCE} exits will result in automatic disqualification.
            </p>
          </div>
        </div>
      )}

      {/* 3. The Actual Test Content */}
      <div className={`transition-all duration-500 ${!isFullscreen ? 'blur-xl pointer-events-none scale-95' : 'blur-0 scale-100'}`}>
        <div className="test-content">
          <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-800">Secure Connection: Active</span>
            </div>
            <div className="text-sm text-slate-600">
              Audit Logs: <span className="font-mono">Syncing...</span>
            </div>
          </div>

          <TestInterface />
        </div>
      </div>
    </div>
  );
};