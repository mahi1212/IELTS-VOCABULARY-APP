import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompletedWordsStore = {
  completedWords: number[]
  toggleWord: (id: number) => void
  checkAll: (ids: number[]) => void
  uncheckAll: () => void
}

export const useCompletedWordsStore = create<CompletedWordsStore>()(
  persist(
    (set) => ({
      completedWords: [],
      toggleWord: (id) =>
        set((state) => ({
          completedWords: state.completedWords.includes(id)
            ? state.completedWords.filter((wordId) => wordId !== id)
            : [...state.completedWords, id],
        })),
      checkAll: (ids) => 
        set(() => ({
          completedWords: [...new Set(ids)]
        })),
      uncheckAll: () => 
        set(() => ({
          completedWords: []
        })),
    }),
    {
      name: 'completed-words-storage',
    }
  )
)