"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

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

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center text-2xl font-bold transition-colors hover:text-primary">
          <span className="text-primary">Spice</span>Bites
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/menu" ? "text-primary" : ""
            }`}
          >
            Menu
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative border-primary/20" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-primary/20">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">{user.name || user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!user && (
            <Button asChild className="bg-black text-white hover:bg-black/80">
              <Link href="/login">Sign In</Link>
            </Button>
          )}

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
              <Link href="/" className={`block py-2 text-lg font-medium ${pathname === "/" ? "text-primary" : ""}`}>
                Home
              </Link>
              <Link
                href="/menu"
                className={`block py-2 text-lg font-medium ${pathname === "/menu" ? "text-primary" : ""}`}
              >
                Menu
              </Link>
              {!user ? (
                <Link
                  href="/login"
                  className={`block py-2 text-lg font-medium ${pathname === "/login" ? "text-primary" : ""}`}
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className={`block py-2 text-lg font-medium ${pathname === "/profile" ? "text-primary" : ""}`}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className={`block py-2 text-lg font-medium ${pathname === "/orders" ? "text-primary" : ""}`}
                  >
                    My Orders
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-0 text-lg font-medium text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
