"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams ? searchParams.get("redirect") || "/" : "/"
  const [isLoading, setIsLoading] = useState(false)
  const { login, register, user } = useAuth()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectPath)
    }
  }, [user, router, redirectPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!loginData.email || !loginData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      })
      setIsLoading(false)
      return
    }

    try {
      await login(loginData.email, loginData.password)
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      router.push(redirectPath)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !registerData.phone
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      })
      setIsLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      })
      setIsLoading(false)
      return
    }

    // Validate Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(registerData.phone)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 10-digit Indian phone number",
      })
      setIsLoading(false)
      return
    }

    try {
      await register(registerData.name, registerData.email, registerData.password, registerData.phone)
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      })
      router.push(redirectPath)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="container flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-lg">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="text-lg">
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Login</CardTitle>
                  <CardDescription className="text-center">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="h-auto p-0 text-xs" type="button">
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="border-primary/20"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-black text-white hover:bg-black/80" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                  <CardDescription className="text-center">Enter your information to create an account</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="border-primary/20"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-black text-white hover:bg-black/80" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </PageTransition>
  )
}
