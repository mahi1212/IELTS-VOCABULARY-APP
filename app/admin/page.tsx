'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth')
    },
  })

  console.log('Session status:', status)
  console.log('Session in admin:', session)
  console.log('User role:', session?.user?.role)

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Additional role check only after session is loaded
  if (status === 'authenticated' && (!session?.user?.role || session.user.role !== 'admin')) {
    console.log('Access denied: Not an admin')
    redirect('/')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary Management</CardTitle>
            <CardDescription>Add, edit, or remove vocabulary words</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => redirect('/admin/vocabulary')}>
              Manage Vocabulary
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => redirect('/admin/users')}>
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Management</CardTitle>
            <CardDescription>Create and edit quiz content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => redirect('/admin/quizzes')}>
              Manage Quizzes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 