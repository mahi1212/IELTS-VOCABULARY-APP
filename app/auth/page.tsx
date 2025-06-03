'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { GoogleSignInButton } from '@/components/auth/AuthButtons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-8">
            Welcome to IELTS Mastery
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6 space-y-6">
              <LoginForm />
              
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-6">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 