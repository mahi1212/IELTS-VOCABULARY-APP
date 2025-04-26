// Define the type for our vocabulary data
export type VocabularyWord = {
  id: number
  word: string
  bangla: string
  synonym: string
  definition: string
  example: string
  difficulty_level: 'easy' | 'medium' | 'hard'
}

// Sample vocabulary data
export const vocabularyData: VocabularyWord[] = [
  {
    id: 1,
    word: "Monday",
    bangla: "সোমবার",
    synonym: "start of week, first day",
    definition: "The first day of the week.",
    example: "I always feel fresh on Monday.",
    difficulty_level: "easy"
  },
  {
    id: 2,
    word: "Tuesday",
    bangla: "মঙ্গলবার",
    synonym: "second day, weekday",
    definition: "The second day of the week.",
    example: "We have a team meeting every Tuesday.",
    difficulty_level: "easy"
  },
  {
    id: 3,
    word: "Wednesday",
    bangla: "বুধবার",
    synonym: "midweek, third day",
    definition: "The third day of the week.",
    example: "I usually visit my grandma on Wednesday.",
    difficulty_level: "medium"
  },
  {
    id: 4,
    word: "Thursday",
    bangla: "বৃহস্পতিবার",
    synonym: "fourth day, weekday",
    definition: "The fourth day of the week.",
    example: "Our dance class is held on Thursday.",
    difficulty_level: "medium"
  },
  {
    id: 5,
    word: "Friday",
    bangla: "শুক্রবার",
    synonym: "end of week, last weekday",
    definition: "The fifth day of the week, often the last working day.",
    example: "We go for lunch together every Friday.",
    difficulty_level: "medium"
  },
  {
    id: 6,
    word: "Saturday",
    bangla: "শনিবার",
    synonym: "weekend, holiday",
    definition: "The sixth day of the week, usually a holiday.",
    example: "We often travel on Saturday mornings.",
    difficulty_level: "hard"
  },
  {
    id: 7,
    word: "Sunday",
    bangla: "রবিবার",
    synonym: "day of rest, weekend",
    definition: "The seventh day of the week, typically a day of rest.",
    example: "They have family dinners on Sunday.",
    difficulty_level: "hard"
  },
  {
    id: 8,
    word: "weekdays",
    bangla: "সাপ্তাহিক কর্মদিবস",
    synonym: "working days, business days",
    definition: "The working days from Monday to Friday.",
    example: "I work on weekdays and rest on weekends.",
    difficulty_level: "medium"
  },
  {
    id: 9,
    word: "weekend",
    bangla: "সাপ্তাহিক ছুটির দিন",
    synonym: "holiday, rest days",
    definition: "Saturday and Sunday together, usually for rest.",
    example: "We went hiking last weekend.",
    difficulty_level: "hard"
  },
  {
    id: 10,
    word: "January",
    bangla: "জানুয়ারি",
    synonym: "first month, new year",
    definition: "The first month of the year.",
    example: "New Year's Day falls in January.",
    difficulty_level: "easy"
  }
]