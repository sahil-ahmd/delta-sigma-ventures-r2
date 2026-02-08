import type { Question } from "../types/assessment";

export const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Which CSS property is used to create a flexible layout using a grid-based system?",
    type: "multiple-choice",
    options: [
      "display: flex",
      "display: block",
      "display: grid",
      "display: table",
    ],
  },
  {
    id: 2,
    text: "Describe the difference between a RESTful API and GraphQL.",
    type: "text-area",
  },
  {
    id: 3,
    text: "Which hook would you use in React to perform side effects like logging or data fetching?",
    type: "multiple-choice",
    options: ["useState", "useEffect", "useMemo", "useRef"],
  },
];
