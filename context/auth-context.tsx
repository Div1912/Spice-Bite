"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation - in a real app, this would be a server call
        if (email && password) {
          // Check if user exists in localStorage
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const foundUser = users.find((u: any) => u.email === email)

          if (foundUser && foundUser.password === password) {
            const userInfo = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              phone: foundUser.phone,
            }
            setUser(userInfo)
            localStorage.setItem("user", JSON.stringify(userInfo))
            resolve()
          } else {
            reject(new Error("Invalid credentials"))
          }
        } else {
          reject(new Error("Email and password are required"))
        }
      }, 1000)
    })
  }

  const register = async (name: string, email: string, password: string, phone: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation - in a real app, this would be a server call
        if (name && email && password) {
          // Check if user already exists
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const userExists = users.some((u: any) => u.email === email)

          if (userExists) {
            reject(new Error("User already exists"))
            return
          }

          // Create new user
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            phone,
          }

          // Save to "database"
          users.push(newUser)
          localStorage.setItem("users", JSON.stringify(users))

          // Log user in
          const userInfo = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          }
          setUser(userInfo)
          localStorage.setItem("user", JSON.stringify(userInfo))
          resolve()
        } else {
          reject(new Error("All fields are required"))
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
