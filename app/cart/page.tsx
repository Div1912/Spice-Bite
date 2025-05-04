"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items: cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setIsAuthenticated(!!user) // Determine authentication status
    }
  }, [mounted, user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your cart",
        variant: "destructive",
      })
      router.push("/login?redirect=/cart")
    }
  }, [mounted, user, router, toast])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  return (
    <PageTransition>
      <div className="container py-12">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-8xl">🛒</div>
            <h2 className="mb-4 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mb-8 text-center text-muted-foreground">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-card shadow-lg">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Cart Items ({cart.length})</h2>
                    <Button variant="outline" size="sm" onClick={handleClearCart}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>
                  <div className="divide-y">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="w-20 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="sticky top-24 rounded-lg border bg-card shadow-lg">
                <div className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>₹49.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (5%)</span>
                      <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{(totalPrice + 49 + totalPrice * 0.05).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button asChild className="mt-4 w-full bg-primary text-lg font-semibold hover:bg-primary/90">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
