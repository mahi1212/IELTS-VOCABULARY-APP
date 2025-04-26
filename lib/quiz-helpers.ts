import { vocabularyData } from "@/data/vocabulary-data";

export type QuizStep = {
  step: 1 | 2 | 3;
  word: string;
  options: string[];
  correctAnswer: string;
}

export function generateQuizQuestion(wordId?: number) {
  // If no wordId provided, pick a random word
  const word = wordId 
    ? vocabularyData.find(item => item.id === wordId)
    : vocabularyData[Math.floor(Math.random() * vocabularyData.length)];

  if (!word) return null;

  // Get random incorrect options
  const incorrectWords = vocabularyData
    .filter(item => item.id !== word.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Step 1: Word writing - no options needed
  const step1: QuizStep = {
    step: 1,
    word: word.word,
    options: [],
    correctAnswer: word.word.toLowerCase()
  };

  // Step 2: Bangla options
  const banglaOptions = [...incorrectWords.map(w => w.bangla)];
  const banglaCorrectIndex = Math.floor(Math.random() * 4);
  banglaOptions.splice(banglaCorrectIndex, 0, word.bangla);
  const step2: QuizStep = {
    step: 2,
    word: word.word,
    options: banglaOptions,
    correctAnswer: word.bangla
  };

  // Step 3: Synonym options
  const synonymOptions = [...incorrectWords.map(w => w.synonym || "")].filter(Boolean);
  const synonymCorrectIndex = Math.floor(Math.random() * 4);
  synonymOptions.splice(synonymCorrectIndex, 0, word.synonym || "");
  const step3: QuizStep = {
    step: 3,
    word: word.word,
    options: synonymOptions,
    correctAnswer: word.synonym || ""
  };

  return [step1, step2, step3];
}