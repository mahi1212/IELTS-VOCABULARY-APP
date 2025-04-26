import { useQuizStore } from "@/stores/quiz-store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { generateQuizQuestion } from "@/lib/quiz-helpers";
import { useState, useEffect } from "react";
import { useCompletedWordsStore } from "@/stores/completed-words-store";

export default function QuizModal() {
  const { 
    isOpen,
    currentStep,
    steps,
    userAnswers,
    setIsOpen,
    submitAnswer,
    moveToNextStep,
    reset,
    skipQuiz,
    startQuiz,
    currentWordId 
  } = useQuizStore();
  
  const { toggleWord } = useCompletedWordsStore();
  const [currentInput, setCurrentInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setCurrentInput("");
    setHasSubmitted(false);
    setShowCelebration(false);
  };

  const handleSkip = () => {
    if (currentWordId) {
      toggleWord(currentWordId); // Mark word as completed
    }
    handleClose();
  };

  const handleContinueNextWord = () => {
    handleClose();
    // Logic to start the next word quiz can be added here if needed
  };

  const currentQuestion = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const showResult = hasSubmitted;

  // Check if current answer is correct based on step type
  const isCurrentAnswerCorrect = () => {
    if (!currentQuestion || !hasSubmitted) return false;
    
    if (currentStep === 0) {
      // For word writing, compare case-insensitive and exact spelling
      return currentInput.trim().toLowerCase() === currentQuestion.word.toLowerCase();
    } else {
      // For multiple choice (Bangla and synonym)
      return userAnswers[currentStep]?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    }
  };

  // Auto-advance effect when answer is correct
  // First effect: handles step transitions and celebration state
useEffect(() => {
  if (hasSubmitted && isCurrentAnswerCorrect() && !showCelebration) {
    if (isLastStep) {
      setShowCelebration(true);
      if (currentWordId) {
        toggleWord(currentWordId);
      }
    } else {
      const timer = setTimeout(() => {
        moveToNextStep();
        setCurrentInput("");
        setHasSubmitted(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }
  // eslint-disable-next-line
}, [hasSubmitted, isCurrentAnswerCorrect, isLastStep, currentWordId, showCelebration]);

// Second effect: handles auto-close after celebration
useEffect(() => {
  if (showCelebration) {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [showCelebration]);

  const handleSubmitAnswer = () => {
    if (currentStep === 0) {
      // For word writing step
      submitAnswer(currentInput);
    } else {
      // For multiple choice steps, answer is already submitted via radio selection
      if (!userAnswers[currentStep]) {
        submitAnswer("");
      }
    }
    setHasSubmitted(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vocabulary Quiz</DialogTitle>
          <DialogDescription>
            {showCelebration ? (
              "🎉 Great job! You've mastered this word!"
            ) : showResult ? (
              isCurrentAnswerCorrect()
                ? "✅ Correct! Moving to next step..."
                : `❌ Wrong spelling. Please type "${currentStep === 0 ? currentQuestion.word : ''}" correctly.`
            ) : `Step ${currentStep + 1}: ${
                currentStep === 0 ? "Write the word" :
                currentStep === 1 ? "Choose the Bangla translation" :
                "Choose the synonym"
              }`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {showCelebration ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl animate-bounce">🌟</div>
              <p className="text-lg font-medium text-center">
                Amazing progress! Keep up the great work!
              </p>
            </div>
          ) : currentQuestion && (
            <>
              <h3 className="font-semibold text-lg mb-4">{currentQuestion.word}</h3>
              
              {currentStep === 0 ? (
                // Step 1: Word input
                <div className="space-y-2">
                  <Input 
                    placeholder="Type the word here..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    className={cn(
                      "w-full bg-background text-foreground",
                      showResult && isCurrentAnswerCorrect() && "border-green-500 bg-green-50 dark:bg-green-900/20",
                      showResult && !isCurrentAnswerCorrect() && "border-red-500 bg-red-50 dark:bg-red-900/20"
                    )}
                    disabled={showResult && isCurrentAnswerCorrect()}
                  />
                  {showResult && !isCurrentAnswerCorrect() && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      Wrong spelling. The correct word is: {currentQuestion.word}
                    </p>
                  )}
                </div>
              ) : (
                // Step 2 & 3: Multiple choice
                <RadioGroup
                  disabled={showResult && isCurrentAnswerCorrect()}
                  onValueChange={(value) => {
                    submitAnswer(value);
                    setHasSubmitted(true);
                  }}
                  value={userAnswers[currentStep] || undefined}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded transition-colors",
                        showResult && option === currentQuestion.correctAnswer && "bg-green-100 dark:bg-green-900/30",
                        showResult && option === userAnswers[currentStep] && option !== currentQuestion.correctAnswer && "bg-red-100 dark:bg-red-900/30"
                      )}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label className="flex-grow" htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between space-x-2">
          {showCelebration ? (
            <Button 
              onClick={handleContinueNextWord} 
              className="w-full"
            >
              Continue Next Word
            </Button>
          ) : (
            <div className="flex space-x-2 justify-end w-full">
                <Button 
                    onClick={handleSkip} 
                    variant="outline"
                    className="w-full"
                >
                    Skip Test
                </Button>

                <Button 
                    onKeyDown={(e => e.key === 'Enter' && handleSubmitAnswer())}
                    onClick={handleSubmitAnswer} 
                    variant="outline"
                    className="w-full"
                >
                    Check Answer
                </Button>
            </div>

            
            

          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}