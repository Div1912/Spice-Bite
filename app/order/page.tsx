"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { CheckCircle, Clock, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface OrderDetails {
  id: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  total: string
  address: string
  date: string
}

export default function OrderPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const lastOrder = localStorage.getItem("lastOrder")

    if (lastOrder) {
      setOrder(JSON.parse(lastOrder))
    }
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your order",
        variant: "destructive",
      })
      router.push("/login?redirect=/order")
    }
  }, [mounted, user, router, toast])

  useEffect(() => {
    if (mounted && !order) {
      router.push("/")
    }
  }, [mounted, order, router])

  if (!mounted || !user || !order) {
    return null
  }

  // Calculate estimated delivery time (30-45 minutes from now)
  const orderDate = new Date(order.date)
  const deliveryTimeMin = new Date(orderDate.getTime() + 30 * 60000)
  const deliveryTimeMax = new Date(orderDate.getTime() + 45 * 60000)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <PageTransition>
      <div className="container py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl rounded-lg border-2 border-primary/20 bg-card p-8 text-center shadow-lg"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
              <CheckCircle className="h-16 w-16" />
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
          <p className="mb-6 text-muted-foreground">
            Thank you for your order. Your food is being prepared and will be on its way soon.
          </p>

          <div className="mb-8 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4 dark:from-orange-950 dark:to-amber-950">
            <div className="mb-4 flex items-center justify-center gap-2 text-xl font-semibold">
              <span>Order #:</span>
              <span className="text-primary">{order.id}</span>
            </div>

            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-lg bg-background p-4 shadow-md">
                <Clock className="mb-2 h-6 w-6 text-primary" />
                <h3 className="font-medium">Estimated Delivery</h3>
                <p>
                  {formatTime(deliveryTimeMin)} - {formatTime(deliveryTimeMax)}
                </p>
              </div>

              <div className="flex flex-col items-center rounded-lg bg-background p-4 shadow-md">
                <MapPin className="mb-2 h-6 w-6 text-primary" />
                <h3 className="font-medium">Delivery Address</h3>
                <p className="text-sm">{order.address}</p>
              </div>
            </div>

            <div className="mb-4 border-t border-border pt-4">
              <h3 className="mb-2 font-medium">Order Summary</h3>
              <ul className="mb-4 space-y-2 text-sm">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/menu">Order More Food</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/20 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
