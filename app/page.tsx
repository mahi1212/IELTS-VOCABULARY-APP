"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Globe, Search, Check, X } from "lucide-react"
import { vocabularyData, type VocabularyWord } from "@/data/vocabulary-data"
import { ThemeToggle } from "@/components/theme-toggle"
import { Checkbox } from "@/components/ui/checkbox"
import { useCompletedWordsStore } from "@/stores/completed-words-store"
import { useQuizStore } from "@/stores/quiz-store"
import QuizModal from "@/components/quiz-modal"
import { cn } from "@/lib/utils"
import { generateQuizQuestion } from "@/lib/quiz-helpers"

const PAGE_SIZE = 10

// Language translations
const translations = {
  en: {
    title: "IELTS Vocabulary Explorer",
    search: "Search Words",
    searchPlaceholder: "Search for words, definitions, or translations...",
    sortOrder: "Sort Order",
    ascending: "Ascending",
    descending: "Descending",
    filterByYear: "Filter by Year",
    filterDescription: "Select which years to include",
    selectAll: "Select All",
    clearAll: "Clear All",
    cardView: "Card View",
    tableView: "Table View",
    showing: "Showing",
    of: "of",
    words: "words",
    word: "Word",
    bangla: "Bangla",
    definition: "Definition",
    example: "Example",
    synonym: "Synonym",
    page: "Page",
    yearFilter: "Year Filter",
    allYears: "All Years",
    filters: "Filters",
  },
  bn: {
    title: "আইইএলটিএস শব্দভাণ্ডার অন্বেষক",
    search: "শব্দ অনুসন্ধান",
    searchPlaceholder: "শব্দ, অনুবাদ বা সংজ্ঞা অনুসন্ধান করুন...",
    sortOrder: "বাছাইয়ের ক্রম",
    ascending: "আরোহী",
    descending: "অবরোহী",
    filterByYear: "বছর অনুযায়ী ফিল্টার",
    filterDescription: "বছরগুলি অন্তর্ভুক্ত করবেন তা নির্বাচন করুন",
    selectAll: "সব নির্বাচন করুন",
    clearAll: "সব মুছুন",
    cardView: "কার্ড ভিউ",
    tableView: "টেবিল ভিউ",
    showing: "দেখাচ্ছে",
    of: "এর মধ্যে",
    words: "শব্দ",
    word: "শব্দ",
    bangla: "বাংলা",
    definition: "সংজ্ঞা",
    example: "উদাহরণ",
    synonym: "সমার্থক শব্দ",
    page: "পৃষ্ঠা",
    yearFilter: "বছর ফিল্টার",
    allYears: "সব বছর",
    filters: "ফিল্টার",
  },
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortDifficulty, setSortDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [viewMode, setViewMode] = useState<"cards" | "table">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["completed", "word", "bangla", "synonym", "example"])
  const { completedWords, toggleWord, checkAll, uncheckAll } = useCompletedWordsStore()
  const { setIsOpen, startQuiz } = useQuizStore()

  const t = translations[language]

  const columnOrder = ["completed", "word", "bangla", "synonym", "example", "definition", ]

  const allColumns = [
    { id: "completed", label: "", required: true },
    { id: "word", label: t.word, required: true },
    { id: "bangla", label: t.bangla },
    { id: "synonym", label: t.synonym },
    { id: "definition", label: t.definition },
    { id: "example", label: t.example },
  ]

  const hiddenColumns = allColumns.filter(col => !visibleColumns.includes(col.id))

  const toggleColumn = (columnId: string) => {
    // Prevent removing the word column
    if (columnId === "word") return

    if (visibleColumns.includes(columnId)) {
      setVisibleColumns(visibleColumns.filter(id => id !== columnId))
    } else {
      const targetIndex = columnOrder.indexOf(columnId)
      const newColumns = [...visibleColumns]

      let insertIndex = 0
      for (let i = 0; i < targetIndex; i++) {
        if (visibleColumns.includes(columnOrder[i])) {
          insertIndex = visibleColumns.indexOf(columnOrder[i]) + 1
        }
      }

      newColumns.splice(insertIndex, 0, columnId)
      setVisibleColumns(newColumns)
    }
  }

  const handleWordCheck = (wordId: number, word: VocabularyWord) => {
    const steps = generateQuizQuestion(wordId);
    if (steps) {
      startQuiz(steps, wordId);
    }
  }

  // Filter and sort vocabulary data
  const filteredAndSortedData = useMemo(() => {
    let filtered = vocabularyData.filter(
      (word) =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.bangla.includes(searchTerm.toLowerCase()),
    )
    // Sort by difficulty_level
    const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
    return [...filtered].sort((a, b) => {
      return difficultyOrder[a.difficulty_level] - difficultyOrder[b.difficulty_level]
    }).filter(word => word.difficulty_level === sortDifficulty)
  }, [vocabularyData, searchTerm, sortDifficulty])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / PAGE_SIZE)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredAndSortedData.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredAndSortedData, currentPage])

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, sortDifficulty])

  // Calculate if all items on current page are checked
  const areAllCheckedOnPage = useMemo(() => {
    return paginatedData.every(word => completedWords.includes(word.id))
  }, [paginatedData, completedWords])

  // Toggle all items on current page
  const toggleAllOnPage = () => {
    if (areAllCheckedOnPage) {
      // If all are checked, uncheck them
      const pageIds = paginatedData.map(word => word.id)
      uncheckAll()
    } else {
      // If not all are checked, check all on page
      checkAll(paginatedData.map(word => word.id))
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <QuizModal />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">{t.title}</h1>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "bn")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bn">বাংলা</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* All Filters in One Row */}
      <div className="flex flex-wrap gap-4 items-end mb-8">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="mb-2 block dark:text-white">
            {t.search}
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>
        </div>

        <div>
          {/* <Label htmlFor="sort-difficulty" className="mb-2 block dark:text-white">
            Sort by
          </Label> */}
          <Select value={sortDifficulty} onValueChange={(value) => setSortDifficulty(value as 'easy' | 'medium' | 'hard')}>
            <SelectTrigger id="sort-difficulty" className="w-[120px] dark:bg-gray-900 dark:text-white dark:border-gray-700">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Mode Tabs and Page Selector */}
      <div className="flex justify-between items-center mb-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "cards" | "table")}>
          <TabsList className="grid w-full max-w-[200px] grid-cols-2 dark:bg-gray-900">
            <TabsTrigger value="cards" className="dark:text-white dark.data-[state=active]:bg-gray-700">{t.cardView}</TabsTrigger>
            <TabsTrigger value="table" className="dark:text-white dark.data-[state=active]:bg-gray-700">{t.tableView}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          {/* Hidden Columns */}
          {hiddenColumns.map(col => (
            <Button 
              key={col.id} 
              variant="outline" 
              size="sm"
              onClick={() => toggleColumn(col.id)}
              className="flex items-center gap-1 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            >
              <span>+</span>
              <span>{col.label}</span>
            </Button>
          ))}

          {/* Page Selector */}
          <Select value={currentPage.toString()} onValueChange={(value) => setCurrentPage(Number.parseInt(value))}>
            <SelectTrigger className="w-[120px] dark:bg-gray-900 dark:text-white dark:border-gray-700">
              <SelectValue placeholder={`${t.page} ${currentPage}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {t.page} {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Card View */}
      {viewMode === "cards" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((word) => (
            <Card key={word.id} className="overflow-hidden dark:bg-gray-900 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex justify-between items-center dark:text-white">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={completedWords.includes(word.id)}
                      onCheckedChange={() => handleWordCheck(word.id, word)}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <span>{word.word}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({word.bangla})</span>
                  </div>
                </CardTitle>
                <CardDescription className="dark:text-gray-300">{word.definition}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-600 dark:text-gray-400 mb-4">"{word.example}"</p>
                {word.synonym && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1 dark:text-white">{t.synonym}:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{word.synonym}</p>
                  </div>
                )}
                <div className="mt-2">
                  <span className="text-xs font-semibold">Difficulty: </span>
                  <span className="text-xs">{word.difficulty_level}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow rounded-lg">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gray-100 dark:bg-gray-900">
                <TableRow>
                  {visibleColumns.map(columnId => {
                    const column = allColumns.find(col => col.id === columnId)!
                    return (
                      <TableHead 
                        key={columnId} 
                        className={cn(
                          "text-gray-900 dark:text-white font-bold",
                          columnId === "completed" && "w-10",
                          columnId === "word" && "min-w-[200px]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {columnId === "completed" && (
                            <Checkbox 
                              checked={areAllCheckedOnPage}
                              onCheckedChange={toggleAllOnPage}
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                          )}
                          <span>{column.label}</span>
                          {!column.required && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleColumn(columnId)}
                              className="h-6 w-6 p-0 dark:hover:bg-gray-700"
                            >
                              -
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900">
                {paginatedData.map((word) => (
                  <TableRow key={word.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                    {visibleColumns.map(columnId => (
                      <TableCell key={columnId} className={cn(
                        "font-medium text-gray-900 dark:text-white",
                        columnId === "completed" && "w-10"
                      )}>
                        {columnId === "completed" && (
                          <Checkbox 
                            checked={completedWords.includes(word.id)}
                            onCheckedChange={() => handleWordCheck(word.id, word)}
                            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                        )}
                        {columnId === "word" && word.word}
                        {columnId === "bangla" && word.bangla}
                        {columnId === "synonym" && (word.synonym || "-")}
                        {columnId === "definition" && word.definition}
                        {columnId === "example" && <span className="italic">"{word.example}"</span>}
                        {columnId === "difficulty_level" && word.difficulty_level}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Results Count */}
          <div className="flex justify-between w-full items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t.showing} {filteredAndSortedData.length} {t.of} {vocabularyData.length} {t.words}
            </p>
            <ThemeToggle />

          </div>
        </div>
      )}
    </main>
  )
}
