import React from "react";
import { useSecureEnvironment } from "../../hooks/useSecureEnvironment";

export const AssessmentRoom: React.FC = () => {
  const TOLERANCE = 3;
  const { isFullscreen, violations, enterFullscreen, isExceeded } =
    useSecureEnvironment(TOLERANCE);

  if (isExceeded) {
    return (
      <div className="terminated">
        Test terminated due to security violations.
      </div>
    );
  }

  return (
    <div className="secure-room">
      {!isFullscreen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Fullscreen Required</h2>
            <p>
              Please re-enter fullscreen to continue. Attempt {violations}/
              {TOLERANCE}
            </p>
            <button onClick={enterFullscreen} className="btn-primary">
              Return to Test
            </button>
          </div>
        </div>
      )}

      <div className={isFullscreen ? "content-visible" : "content-blurred"}>
        <header>Secure Test Environment | Violations: {violations}</header>
        <main>
          {/* Assessment questions go here */}
          <h1>Secure Assessment Content</h1>
        </main>
      </div>
    </div>
  );
};
