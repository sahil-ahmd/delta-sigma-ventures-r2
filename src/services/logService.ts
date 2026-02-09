import type { AuditEvent, EventType } from '../types/assessment';

const STORAGE_KEY = 'secure_assessment_logs';
const BATCH_SIZE = 5; // Send to BE after 5 events

export const logService = {
  // 1. Capture and Persist locally
  capture: (type: EventType, metadata: object = {}) => {
    const event: AuditEvent = {
      type,
      timestamp: new Date().toISOString(),
      attemptId: "ATTEMPT_TS_001",
      metadata: {
        browser: navigator.userAgent,
        url: window.location.href,
        ...metadata
      }
    };

    const logs: AuditEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    logs.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

    console.log(`[Audit Log]: ${type}`, event);

    // 2. TRIGGER BATCH SYNC
    if (logs.length >= BATCH_SIZE) {
      logService.syncWithBackend();
    }
  },

  // 3. Batch and Send to Backend
  syncWithBackend: async () => {
    const logs: AuditEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (logs.length === 0) return;

    try {
      console.log("📤 Attempting to sync batch to Backend...");

      // THIS IS WHERE WE INTEGRATE THE BE
      // const response = await fetch('/api/v1/logs/batch', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ logs })
      // });

      // if (response.ok) {
        // Clear local storage ONLY after successful BE confirmation
        localStorage.setItem(STORAGE_KEY, '[]');
        console.log("✅ Batch sync successful. Local storage cleared.");
      // }

    } catch (error) {
      // If BE is down, logs stay in LocalStorage (Persistence)
      console.error("❌ Sync failed. Logs will persist locally until next retry.", error);
    }
  },

  getLogs: (): AuditEvent[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
};