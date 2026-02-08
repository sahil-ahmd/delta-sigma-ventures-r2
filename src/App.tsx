import React from "react";
import { AssessmentRoom } from "./components/secure-test/AssessmentRoom";
import "./App.css";

/**
 * App Component
 * Serves as the root of the Secure Test Environment.
 * CSS should include the professional styles provided earlier.
 */
const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Optional: Add a global navigation or breadcrumb here */}
      <nav
        style={{
          padding: "1rem",
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            fontWeight: "bold",
            color: "#2563eb",
          }}
        >
          SECURE-ASSESS v2026
        </div>
      </nav>

      <AssessmentRoom />

      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#64748b",
          fontSize: "0.875rem",
        }}
      >
        © 2026 Secure Assessment Systems. All activity is logged for proctoring.
      </footer>
    </div>
  );
};

export default App;
