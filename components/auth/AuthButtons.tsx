'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut({ callbackUrl: '/auth' })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="w-full"
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : 'Sign Out'}
    </Button>
  )
} 