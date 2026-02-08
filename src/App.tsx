import React, { useState } from "react";
import { useSecureEnvironment } from "./hooks/useSecureEnvironment";
import { TestInterface } from "./components/secure-test/TestInterface";
import { ViolationModal } from "./components/secure-test/ViolationModal";
import { ProctorCamera } from "./components/secure-test/ProctorCamera"; // Optional but recommended

export const App: React.FC = () => {
  const TOLERANCE = 3;
  const { isFullscreen, violations, enterFullscreen, isExceeded } =
    useSecureEnvironment(TOLERANCE);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  // 1. Final Termination State
  if (isExceeded) {
    return (
      <div className="terminated flex h-screen items-center justify-center">
        <h1 className="text-red-600 text-3xl font-bold">Assessment Revoked</h1>
        <p>Protocol breach: Maximum exits reached.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* 2. Security Modal: The ONLY thing shown when not in fullscreen */}
      {!isFullscreen && !hasFinished && (
        <ViolationModal
          violations={violations}
          maxViolations={TOLERANCE}
          onReEnter={enterFullscreen}
        />
      )}

      {/* 3. Optional: Live Proctoring View (Only when test is active) */}
      {isFullscreen && <ProctorCamera />}

      {/* 4. Assessment Content: Managed by CSS classes for security blurring */}
      <div
        className={`transition-all duration-700 p-8 ${
          !isFullscreen
            ? "blur-2xl pointer-events-none scale-95 opacity-0"
            : "blur-0 scale-100 opacity-100"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Status Header */}
          {/* HIDE STATUS HEADER: Only show if not finished */}
          {!hasFinished && (
            <div className="flex justify-between items-center mb-6 p-4 bg-white shadow-sm rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">
                  Environment: SECURE
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                AUDIT_TRAIL_ACTIVE | EXITS: {violations}
              </div>
            </div>
          )}

          {/* PASS THE SETTER: Tell the interface how to update the app state */}
          <TestInterface onComplete={() => setHasFinished(true)} />
        </div>
      </div>
    </div>
  );
};

export default App;
