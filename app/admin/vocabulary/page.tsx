'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Temporary mock data
const mockWords = [
  { id: 1, word: 'Ubiquitous', meaning: 'Present everywhere', example: 'Mobile phones have become ubiquitous in modern life.' },
  { id: 2, word: 'Ephemeral', meaning: 'Lasting for a very short time', example: 'Social media posts are often ephemeral, disappearing after 24 hours.' },
  // Add more mock words as needed
]

export default function VocabularyManagement() {
  const [isAddingWord, setIsAddingWord] = useState(false)
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')
  const [example, setExample] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement word addition logic
    console.log({ word, meaning, example })
    setIsAddingWord(false)
    resetForm()
  }

  const resetForm = () => {
    setWord('')
    setMeaning('')
    setExample('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vocabulary Management</h1>
        <Dialog open={isAddingWord} onOpenChange={setIsAddingWord}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Word
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Word</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="word" className="block text-sm font-medium mb-1">
                  Word
                </label>
                <Input
                  id="word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Enter a word"
                  required
                />
              </div>

              <div>
                <label htmlFor="meaning" className="block text-sm font-medium mb-1">
                  Meaning
                </label>
                <Textarea
                  id="meaning"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Enter the meaning"
                  required
                />
              </div>

              <div>
                <label htmlFor="example" className="block text-sm font-medium mb-1">
                  Example
                </label>
                <Textarea
                  id="example"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Enter an example sentence"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingWord(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Word</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Meaning</TableHead>
              <TableHead>Example</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWords.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.word}</TableCell>
                <TableCell>{item.meaning}</TableCell>
                <TableCell>{item.example}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 