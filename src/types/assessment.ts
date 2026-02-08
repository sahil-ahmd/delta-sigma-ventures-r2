// Define the "Unified Event Schema" strictly.

export type EventType =
  | "FULLSCREEN_REQUESTED"
  | "FULLSCREEN_ENTERED"
  | "FULLSCREEN_EXITED"
  | "TAB_SWITCH_DETECTED"
  | "PREVENTED_COPY"
  | "PREVENTED_PASTE"
  | "PREVENTED_CONTEXTMENU"
  | "ASSESSMENT_STARTED"
  | "ASSESSMENT_SUBMITTED"
  | "QUESTION_SUBMITTED";

export interface AuditEvent {
  type: EventType;
  timestamp: string;
  attemptId: string;
  metadata: {
    browser: string;
    url: string;
    violationCount?: number;
    [key: string]: any;
  };
}

export type QuestionType = "multiple-choice" | "text-area";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[]; // Only for multiple-choice
}

export interface UserResponse {
  questionId: number;
  answer: string;
}
