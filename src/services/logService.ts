// This service ensures logs are batch-processed and persisted.

import type { AuditEvent, EventType } from '../types/assessment';

const STORAGE_KEY = 'secure_assessment_logs';

export const logService = {
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
  },

  getLogs: (): AuditEvent[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
};