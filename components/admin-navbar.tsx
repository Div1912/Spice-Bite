"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Bell, Home } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useNotification } from "@/context/notification-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { logout } = useAuth()
  const { notifications } = useNotification()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  if (!mounted) {
    return null
  }

  // Get unread notifications for owner
  const unreadNotifications = notifications.filter(
    (notification) => notification.forRole === "owner" && !notification.read,
  )

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin" className="flex items-center text-2xl font-bold transition-colors hover:text-primary">
          <span className="text-primary">Spice</span>Bites Admin
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/admin"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/admin" ? "text-primary" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/menu"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/admin/menu" ? "text-primary" : ""
            }`}
          >
            Menu Management
          </Link>
          <Link
            href="/admin/settings"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/admin/settings" ? "text-primary" : ""
            }`}
          >
            Settings
          </Link>
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            <Home className="mr-1 inline-block h-4 w-4" />
            View Site
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative border-primary/20">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <span className="font-medium">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <Badge variant="outline" className="ml-auto">
                    {unreadNotifications.length} new
                  </Badge>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                <div className="max-h-80 overflow-auto">
                  {notifications
                    .filter((notification) => notification.forRole === "owner")
                    .slice(0, 5)
                    .map((notification) => (
                      <DropdownMenuItem key={notification.id} className="cursor-pointer p-3">
                        <div className={`w-full ${!notification.read ? "font-medium" : ""}`}>
                          <div className="flex justify-between">
                            <span>{notification.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="border-primary/20" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="container space-y-4 pb-6">
              <Link
                href="/admin"
                className={`block py-2 text-lg font-medium ${pathname === "/admin" ? "text-primary" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/menu"
                className={`block py-2 text-lg font-medium ${pathname === "/admin/menu" ? "text-primary" : ""}`}
              >
                Menu Management
              </Link>
              <Link
                href="/admin/settings"
                className={`block py-2 text-lg font-medium ${pathname === "/admin/settings" ? "text-primary" : ""}`}
              >
                Settings
              </Link>
              <Link href="/" className="block py-2 text-lg font-medium">
                <Home className="mr-1 inline-block h-4 w-4" />
                View Site
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start px-0 text-lg font-medium text-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
