import React from 'react';
import { Button } from '../ui/Button';

interface ViolationModalProps {
  violations: number;
  maxViolations: number;
  onReEnter: () => void;
}

export const ViolationModal: React.FC<ViolationModalProps> = ({ 
  violations, 
  maxViolations, 
  onReEnter 
}) => {
  return (
    <div className="warning-overlay">
      <div className="modal">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            {/* Simple Warning Icon using CSS/SVG */}
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800">Security Lockdown</h2>
        <p className="text-slate-600 mt-2">
          Your assessment has been paused because you exited fullscreen mode.
        </p>

        <div className="my-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
            Violation Status
          </p>
          <p className="text-3xl font-mono font-bold text-red-600">
            {violations} <span className="text-slate-300">/</span> {maxViolations}
          </p>
        </div>

        <Button onClick={onReEnter} variant="primary" size="lg" className="w-full">
          {violations === 0 ? "Begin Assessment" : "Resume Assessment"}
        </Button>

        <p className="mt-4 text-xs text-slate-400">
          Note: Closing this tab or exceeding the limit will result in an automatic "Fail" status.
        </p>
      </div>
    </div>
  );
};