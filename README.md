# 🛡️ Secure Assessment Proctoring System
A robust, React-based secure testing environment designed to prevent academic dishonesty through real-time browser enforcement, activity tracking, and an immutable audit trail.

## 🚀 Key Features
### 1. Browser Enforcement (Lockdown Mode)
- Forced Fullscreen: Automatically requests fullscreen mode upon starting the assessment.
- Violation Detection: Monitors and limits "Exits" from fullscreen.
- Tab/Focus Tracking: Detects when a user switches tabs or minimizes the window using the visibilitychange API.
- Input Protection: Prevents Copy, Paste, and Right-Click (Context Menu) to stop external resource usage.

### 2. Unified Event Logging & Audit Trail
- Centralized Schema: All events (violations, heartbeats, submissions) follow a strict TypeScript union type for data integrity.
- Activity Heartbeats: Logs "TIMER_HEARTBEAT" every 2 minutes to verify candidate presence.
- Metadata Capture: Logs context for every event (e.g., which HTML element was right-clicked).

### 3. Resilience & Synchronization
- Local Persistence: All logs are saved to localStorage immediately to prevent data loss on page refresh or crash.
- Smart Batching: Events are batched and synced to the backend in groups of 5 to optimize network performance.
- Immutable Final Sync: Ensures a final push of all pending logs upon assessment completion.

4. Developer & Proctor Tools
- Debug Mode: Bypass security restrictions by adding ?debug=true to the URL for testing.
- Violation Threshold: Configurable tolerance levels (e.g., 3 strikes) before the assessment is automatically revoked.

## 📂 Folder Structure
```bash
src/
├── components/
│   ├── secure-test/
│   │   ├── TestInterface.tsx    # Main assessment content
│   │   ├── ViolationModal.tsx   # Warning UI for security breaches
│   │   └── ProctorCamera.tsx    # Webcam monitoring component
│   └── ui/
│       └── Button.tsx           # Reusable styled buttons
├── hooks/
│   └── useSecureEnvironment.ts  # Logic for fullscreen & event listeners
├── services/
│   └── logService.ts            # Logic for batching, storage, and syncing
├── types/
│   └── assessment.ts            # Unified EventType and log interfaces
└── App.tsx                      # Root component & state orchestration
```

## 🛠️ Technical Stack
- Frontend: React 18 with TypeScript.
- State Management: React Hooks (useState, useEffect, Custom Hooks).
- Security APIs: Fullscreen API, Page Visibility API, Clipboard API.
- Styling: Minimal Plain CSS.

## 🚦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Testing Security
- Open `http://localhost:5173` to experience the locked-down environment.
- Open `http://localhost:5173?debug=true` to enable Developer Tools for inspection.


## 📝 Event Schema Example
```js
{
  type: "TAB_SWITCH_DETECTED",
  timestamp: "2026-02-09T21:15:00.000Z",
  attemptId: "ATTEMPT_001",
  metadata: {
    state: "hidden",
    violationCount: 2
  }
}
```

## Some Screenshots for the Application
- Home Screen
<img width="2844" height="1556" alt="ss1" src="https://github.com/user-attachments/assets/30421602-203c-4b1b-b5e4-b788b76c040d" />

- Sample Question 1
<img width="2880" height="1800" alt="ss2" src="https://github.com/user-attachments/assets/098e714b-e83c-424a-b1ba-c9fdd9f1e1c9" />

- Sample Question 2
<img width="2880" height="1800" alt="ss3" src="https://github.com/user-attachments/assets/05ba2b40-e2db-494a-adfb-2518cbe47cb3" />

- Submit Assessment
<img width="2880" height="1800" alt="ss4" src="https://github.com/user-attachments/assets/fa98afaa-8fae-41d0-87c4-2ecbcaf99956" />

- Submit Successfully (Go To Dashboard)
<img width="2880" height="1800" alt="ss5" src="https://github.com/user-attachments/assets/8ca23c1c-3f03-4579-9256-5fc71a3e63b6" />

- Warning Screen
<img width="2880" height="1549" alt="ss6" src="https://github.com/user-attachments/assets/0011e5b1-f17a-4696-a9b5-89e8659288a8" />

- Revoke Screen (If violations exceeds it's limit)
<img width="2847" height="1544" alt="ss7" src="https://github.com/user-attachments/assets/cc122141-cb71-4ad1-8704-04ffdde8166b" />


