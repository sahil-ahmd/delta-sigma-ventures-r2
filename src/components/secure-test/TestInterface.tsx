import React, { useState } from "react";
import { mockQuestions } from "../../services/mockData";
import { logService } from "../../services/logService";
import type { UserResponse } from "../../types/assessment";
import { Button } from "../ui/Button";

export const TestInterface: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const currentQuestion = mockQuestions[currentIndex];

  const handleAnswer = (answer: string) => {
    // Log that the user interacted with a question
    logService.capture("QUESTION_SUBMITTED", {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
    });

    setResponses([...responses, { questionId: currentQuestion.id, answer }]);

    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((v) => v + 1);
    } else {
      logService.capture("ASSESSMENT_SUBMITTED");
      alert("Assessment complete! Audit logs saved.");
    }
  };

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
              <span className="option-indicator">{String.fromCharCode(65 + index)}</span>
              {opt}
            </Button>
            ))}
          </div>
        ) : (
          <div className="text-response">
            <textarea
              id="essay-answer"
              placeholder="Type your response here..."
              onBlur={(e) =>
                logService.capture("TAB_SWITCH_DETECTED", {
                  context: "textarea-blur",
                })
              }
            />
            <button
              className="btn-primary"
              onClick={() => {
                const val = (
                  document.getElementById("essay-answer") as HTMLTextAreaElement
                ).value;
                handleAnswer(val);
              }}
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
