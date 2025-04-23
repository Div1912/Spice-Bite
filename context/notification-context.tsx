"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  time: string
  orderId?: string
  forRole: "customer" | "owner"
  userId?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  getUnreadNotificationsForUser: (userId: string) => Notification[]
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  markNotificationAsRead: () => {},
  getUnreadNotificationsForUser: () => [],
})

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)

  // Load notifications from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (error) {
        console.error("Failed to parse notifications from localStorage:", error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications, mounted])

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [notification, ...prevNotifications])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const getUnreadNotificationsForUser = (userId: string) => {
    return notifications.filter(
      (notification) => notification.forRole === "customer" && notification.userId === userId && !notification.read,
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markNotificationAsRead,
        getUnreadNotificationsForUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
