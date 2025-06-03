'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'
import {  DockIcon, Loader2, LogOut } from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [language, setLanguage] = useState<"en" | "bn">("en")

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth' })
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center">
    <DockIcon className="mr-2 h-4 w-4" />         
          IELTS Mastery
        </Link>

        <div className="flex items-center gap-2">
          
        <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "bn")}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bn">বাংলা</SelectItem>
            </SelectContent>
          </Select>

          <ThemeToggle />
          
          {
            status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : session?.user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="relative h-9 w-9 rounded-md p-0 bg-slate-100 dark:bg-slate-800">
                      <Avatar className="h-full w-full rounded-md">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56" align="end">
                    <div className="space-y-4">
                      <div className="font-medium">
                        {session.user.name}
                        <div className="text-sm text-muted-foreground">
                          {session.user.email}
                        </div>
                      </div>
                      <div className="border-t" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button asChild variant="default">
                  <Link href="/auth">Sign in</Link>
                </Button>
              )}

          
        </div>

        
      </div>
    </nav>
  )
} 