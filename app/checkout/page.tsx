"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/auth-context"
import { useOrder } from "@/context/order-context"
import { useNotification } from "@/context/notification-context"

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const { createOrder } = useOrder()
  const { addNotification } = useNotification()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pinCode: "",
    paymentMethod: "upi",
    notes: "",
    upiId: "",
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to proceed to checkout",
        variant: "destructive",
      })
      router.push("/login?redirect=/checkout")
    }
  }, [mounted, user, router, toast])

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: user.name || prevData.fullName,
        email: user.email || prevData.email,
        phone: user.phone || prevData.phone,
      }))
    }
  }, [user])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !user) {
    return null
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pinCode
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      })
      setIsLoading(false)
      return
    }

    // Validate Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 10-digit Indian phone number",
      })
      setIsLoading(false)
      return
    }

    // Validate PIN code
    const pinCodeRegex = /^\d{6}$/
    if (!pinCodeRegex.test(formData.pinCode)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 6-digit PIN code",
      })
      setIsLoading(false)
      return
    }

    // Validate UPI ID if UPI payment method is selected
    if (formData.paymentMethod === "upi" && !formData.upiId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your UPI ID",
      })
      setIsLoading(false)
      return
    }

    // Create order
    setTimeout(() => {
      // Generate random order ID
      const orderId = Math.floor(100000 + Math.random() * 900000).toString()

      const orderData = {
        id: orderId,
        items: cart,
        total: (totalPrice + 49 + totalPrice * 0.05).toFixed(2),
        address: formData.address,
        city: formData.city,
        pinCode: formData.pinCode,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: "pending",
        date: new Date().toISOString(),
        userId: user.id,
        estimatedDeliveryTime: 30, // in minutes
        trackingSteps: [
          { id: 1, title: "Order Placed", completed: true, time: new Date().toISOString() },
          { id: 2, title: "Order Confirmed", completed: false, time: null },
          { id: 3, title: "Preparing Food", completed: false, time: null },
          { id: 4, title: "Out for Delivery", completed: false, time: null },
          { id: 5, title: "Delivered", completed: false, time: null },
        ],
      }

      // Save order
      createOrder(orderData)

      // Add notification for restaurant owner
      addNotification({
        id: Date.now().toString(),
        title: "New Order Received",
        message: `Order #${orderId} has been placed by ${formData.fullName}`,
        type: "new-order",
        read: false,
        time: new Date().toISOString(),
        orderId: orderId,
        forRole: "owner",
      })

      // Clear cart
      clearCart()

      setIsLoading(false)

      // Redirect to order tracking page
      router.push(`/order-tracking/${orderId}`)
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (cart.length === 0) {
    return (
      <PageTransition>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-8xl">🛒</div>
            <h2 className="mb-4 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mb-8 text-center text-muted-foreground">
              You need to add items to your cart before checkout.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <a href="/menu">Browse Menu</a>
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container py-12">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <form onSubmit={handleSubmit}>
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                    <CardDescription>
                      We've pre-filled your information. Just add your delivery address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="border-primary/20"
                        placeholder="Enter your full delivery address"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="border-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pinCode">PIN Code *</Label>
                        <Input
                          id="pinCode"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleChange}
                          required
                          className="border-primary/20"
                          placeholder="6-digit PIN code"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Any special instructions for delivery"
                        value={formData.notes}
                        onChange={handleChange}
                        className="border-primary/20"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-2 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Select your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      defaultValue="upi"
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: value,
                        }))
                      }
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2 rounded-md border border-primary/20 p-3 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-primary"
                          >
                            <path d="M7 15h0a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5h0" />
                            <path d="M3 8a7.5 7.5 0 0 0 3 6h0a6 6 0 0 0 6 0h0a6 6 0 0 0 6 0h0a7.5 7.5 0 0 0 3-6" />
                          </svg>
                          UPI
                        </Label>
                      </div>

                      {formData.paymentMethod === "upi" && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor="upiId">UPI ID *</Label>
                          <Input
                            id="upiId"
                            name="upiId"
                            placeholder="yourname@upi"
                            value={formData.upiId}
                            onChange={handleChange}
                            className="border-primary/20"
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2 rounded-md border border-primary/20 p-3 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="paytm" id="paytm" />
                        <Label htmlFor="paytm" className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-primary"
                          >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                          </svg>
                          Paytm
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-md border border-primary/20 p-3 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-primary"
                          >
                            <rect width="18" height="12" x="3" y="6" rx="2" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M7 15h.01" />
                            <path d="M17 15h.01" />
                          </svg>
                          Cash on Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-lg font-semibold hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Place Order"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          </div>
          <div>
            <div className="sticky top-24 rounded-lg border-2 border-primary/20 bg-card shadow-lg">
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                <div className="max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-3 border-t pt-4">
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
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{(totalPrice + 49 + totalPrice * 0.05).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
