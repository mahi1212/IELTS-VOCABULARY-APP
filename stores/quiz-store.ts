import { create } from "zustand";
import { QuizStep } from "@/lib/quiz-helpers";

type QuizState = {
  isOpen: boolean;
  currentStep: number;
  currentWordId: number | null;
  steps: QuizStep[];
  userAnswers: string[];
  setIsOpen: (isOpen: boolean) => void;
  startQuiz: (steps: QuizStep[], wordId?: number) => void;
  submitAnswer: (answer: string) => void;
  moveToNextStep: () => void;
  reset: () => void;
  skipQuiz: () => void;
};

export const useQuizStore = create<QuizState>((set) => ({
  isOpen: false,
  currentStep: 0,
  currentWordId: null,
  steps: [],
  userAnswers: [],
  setIsOpen: (isOpen) => {
    set((state) => ({ 
      ...state,
      isOpen,
      // Reset state when closing
      ...((!isOpen && {
        currentStep: 0,
        currentWordId: null,
        steps: [],
        userAnswers: []
      }))
    }));
  },
  startQuiz: (steps, wordId) => {
    set({ 
      steps,
      currentWordId: wordId || null,
      currentStep: 0,
      userAnswers: [],
      isOpen: true
    });
  },
  submitAnswer: (answer) => set((state) => {
    const newAnswers = [...state.userAnswers];
    newAnswers[state.currentStep] = answer;
    return {
      ...state,
      userAnswers: newAnswers,
    };
  }),
  moveToNextStep: () => set((state) => ({
    ...state,
    currentStep: state.currentStep < state.steps.length - 1 
      ? state.currentStep + 1 
      : state.currentStep
  })),
  skipQuiz: () => set({
    isOpen: false,
    currentStep: 0,
    currentWordId: null,
    steps: [],
    userAnswers: []
  }),
  reset: () => set({
    currentStep: 0,
    currentWordId: null,
    steps: [],
    userAnswers: []
  })
}));