'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Loader2, BookOpen, Users, Brain, Home, Settings } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const sidebarItems = [
  {
    title: 'Overview',
    href: '/admin',
    icon: Home
  },
  {
    title: 'Vocabulary',
    href: '/admin/vocabulary',
    icon: BookOpen
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Quizzes',
    href: '/admin/quizzes',
    icon: Brain
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth')
    },
  })

  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === 'authenticated' && (!session?.user?.role || session.user.role !== 'admin')) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    pathname === item.href 
                      ? "bg-gray-100 dark:bg-gray-700 text-primary"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Logged in as
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {session.user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {session.user.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 