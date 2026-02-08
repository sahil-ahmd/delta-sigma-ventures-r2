import React, { useState } from "react";
import { mockQuestions } from "../../services/mockData";
import { logService } from "../../services/logService";
import type { UserResponse } from "../../types/assessment";
import { Button } from "../ui/Button";

interface TestInterfaceProps {
  onComplete: () => void;
}

export const TestInterface: React.FC<TestInterfaceProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [essayText, setEssayText] = useState(""); // Managed state for textareas
  const [isFinished, setIsFinished] = useState(false); // Confirmation state
  const [showFinalModal, setShowFinalModal] = useState(false);

  const currentQuestion = mockQuestions[currentIndex];

  const handleAnswer = (answer: string) => {
    logService.capture("QUESTION_SUBMITTED", {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
    });

    const updatedResponses = [
      ...responses,
      { questionId: currentQuestion.id, answer },
    ];
    setResponses(updatedResponses);
    setEssayText(""); // Reset for next potential essay

    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((v) => v + 1);
    } else {
      // Trigger the confirmation view
      setIsFinished(true);
    }
  };

  const submitAssessment = () => {
    logService.capture("ASSESSMENT_SUBMITTED");
    setShowFinalModal(true);
    onComplete();
    setIsFinished(true);
  };

  // ---- SUCCESS MODAL ----
  if (showFinalModal) {
    return (
      <div className="modal-overlay">
        <div className="success-modal">
          <div className="success-icon">✓</div>
          <h2 className="text-2xl font-bold mb-2">Test Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your responses and proctoring logs have been securely uploaded.
          </p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()} 
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- Confirmation View ---
  if (isFinished) {
    return (
      <div className="question-card confirmation-view">
        <div className="icon-circle success">✓</div>
        <h2>All Questions Answered</h2>
        <p>
          Your responses have been recorded. Please confirm to finalize your
          submission.
        </p>

        <div className="confirmation-actions">
          <Button variant="primary" size="lg" onClick={submitAssessment}>
            Finalize & Submit
          </Button>
          <Button
            variant="option"
            onClick={() => {
              setIsFinished(false);
              setCurrentIndex(mockQuestions.length - 1); // Go back to last question
            }}
          >
            Review Last Question
          </Button>
        </div>
      </div>
    );
  }

  // --- 2. Active Test View ---
  return (
    <div className="test-interface">
      <div className="progress-bar">
        Question {currentIndex + 1} of {mockQuestions.length}
      </div>

      <div className="question-card">
        <h3>{currentQuestion.text}</h3>

        {currentQuestion.type === "multiple-choice" ? (
          <div className="options-grid">
            {currentQuestion.options?.map((opt, index) => (
              <Button
                key={index}
                variant="option"
                onClick={() => handleAnswer(opt)}
              >
                <span className="option-indicator">
                  {String.fromCharCode(65 + index)}
                </span>
                {opt}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-response">
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Type your response here..."
              style={{
                width: "100%",
                height: "250px",
                padding: "15px",
                borderRadius: "8px",
              }}
              onBlur={() =>
                logService.capture("TAB_SWITCH_DETECTED", {
                  context: "textarea-blur",
                })
              }
            />
            <Button
              variant="primary"
              onClick={() => handleAnswer(essayText)}
              disabled={!essayText.trim()}
            >
              Next Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
