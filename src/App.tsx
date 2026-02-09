import React, { useEffect, useState } from "react";
import { useSecureEnvironment } from "./hooks/useSecureEnvironment";
import { TestInterface } from "./components/secure-test/TestInterface";
import { ViolationModal } from "./components/secure-test/ViolationModal";
import { ProctorCamera } from "./components/secure-test/ProctorCamera";
import { logService } from "./services/logService";

export const App: React.FC = () => {
  const TOLERANCE = 3;
  const [isStarted, setIsStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const { isFullscreen, violations, enterFullscreen, isExceeded } =
    useSecureEnvironment(TOLERANCE);

  // OBJECTIVE: Capture Timer Activity & Heartbeats
  useEffect(() => {
    if (!isStarted || hasFinished || isExceeded) return;

    // Log a heartbeat every 2 minutes to prove active participation
    const heartbeat = setInterval(() => {
      logService.capture("TIMER_HEARTBEAT", { status: "running" });
    }, 120000);

    return () => clearInterval(heartbeat);
  }, [isStarted, hasFinished, isExceeded]);

  const handleStartTest = () => {
    setIsStarted(true);
    enterFullscreen(); // Forces fullscreen as soon as they click start
    // OBJECTIVE: Unified Schema - Session Start
    logService.capture("ASSESSMENT_STARTED", {
      device: navigator.platform,
      startTime: new Date().toISOString(),
    });
  };

  const handleComplete = () => {
    setHasFinished(true);
    // 3. OBJECTIVE: Immutable Sync post-submission
    logService.capture("ASSESSMENT_SUBMITTED");
    logService.syncWithBackend(); // Force final push to server
  };

  // Final Termination State (If they cheat too much)
  if (isExceeded) {
    return (
      <div className="error-page-container">
        <div className="error-card">
          <h1>Assessment Revoked</h1>

          <p>
            Your test session has been terminated due to multiple security
            violations detected in your environment.
          </p>

          <div className="error-details">
            <div>
              <strong>Reason:</strong> Maximum exit tolerance exceeded
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
            </div>
            <div>
              <strong>Status:</strong> Logged & Reported
            </div>
          </div>

          <button
            style={{
              marginTop: "24px",
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline",
            }}
            onClick={() => window.location.reload()}
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  // Home Page / Instructions View
  if (!isStarted) {
    return (
      <div className="home-page-container">
        <div className="instruction-card">
          <h1>Final Examination</h1>

          <div className="instruction-list">
            <p>Important Instructions:</p>
            <ul>
              <li>This is a secure, proctored environment.</li>
              <li>
                Switching tabs or exiting fullscreen triggers a{" "}
                <strong>violation</strong>.
              </li>
              <li>
                You have <strong>{TOLERANCE} attempts</strong>. Exceeding this
                will lock the test.
              </li>
              <li>Ensure your webcam is centered and your room is well-lit.</li>
            </ul>
          </div>

          <button className="start-btn" onClick={handleStartTest}>
            Start Secure Assessment
          </button>

          <p
            style={{
              marginTop: "20px",
              fontSize: "12px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            By starting, you agree to the automated proctoring terms.
          </p>
        </div>
      </div>
    );
  }

  // Active Test Environment
  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Violation Modal: Only shows if started, not finished, and not in fullscreen */}
      {!isFullscreen && !hasFinished && isStarted && (
        <ViolationModal
          violations={violations}
          maxViolations={TOLERANCE}
          onReEnter={enterFullscreen}
        />
      )}

      {/* Security Features */}
      {isFullscreen && !hasFinished && <ProctorCamera />}

      {/* Blur the content if the user is currently violating (not in fullscreen) */}
      <div
        className={`transition-all duration-700 p-8 ${
          !isFullscreen && !hasFinished
            ? "blur-3xl pointer-events-none opacity-0"
            : "blur-0 opacity-100"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Status Header */}
          {!hasFinished && (
            <div className="flex justify-between items-center mb-6 p-4 bg-white shadow-sm rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">
                  Environment: SECURE
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 italic">
                EXITS: {violations} / {TOLERANCE}
              </div>
            </div>
          )}

          <TestInterface onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};

export default App;
