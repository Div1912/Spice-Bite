"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { useAuth } from "@/context/auth-context"
import { useOrder } from "@/context/order-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

export default function OrdersPage() {
  const { user } = useAuth()
  const { orders } = useOrder()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [userOrders, setUserOrders] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your orders",
        variant: "destructive",
      })
      router.push("/login?redirect=/orders")
    }
  }, [mounted, user, router, toast])

  // Filter orders for current user
  useEffect(() => {
    if (user && orders.length > 0) {
      const filteredOrders = orders.filter((order) => order.userId === user.id)
      // Sort by date (newest first)
      filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setUserOrders(filteredOrders)
    }
  }, [user, orders])

  if (!mounted || !user) {
    return null
  }

  return (
    <PageTransition>
      <div className="container py-12">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">My Orders</h1>

        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-8xl">📦</div>
            <h2 className="mb-4 text-2xl font-semibold">No orders yet</h2>
            <p className="mb-8 text-center text-muted-foreground">
              You haven&apos;t placed any orders yet. Start ordering delicious food now!
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
                  <CardHeader className="bg-muted/50 pb-3 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Order #{order.id}</CardTitle>
                        <CardDescription>
                          {new Date(order.date).toLocaleDateString()} at{" "}
                          {new Date(order.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          order.status === "pending"
                            ? "outline"
                            : order.status === "confirmed"
                              ? "secondary"
                              : order.status === "preparing"
                                ? "default"
                                : order.status === "out-for-delivery"
                                  ? "default"
                                  : "success"
                        }
                      >
                        {order.status === "pending"
                          ? "Order Placed"
                          : order.status === "confirmed"
                            ? "Confirmed"
                            : order.status === "preparing"
                              ? "Preparing"
                              : order.status === "out-for-delivery"
                                ? "Out for Delivery"
                                : "Delivered"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <h3 className="mb-2 font-medium">Order Summary</h3>
                      <ul className="space-y-1 text-sm">
                        {order.items.slice(0, 3).map((item: any) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                        {order.items.length > 3 && (
                          <li className="text-muted-foreground">+{order.items.length - 3} more items</li>
                        )}
                      </ul>
                      <div className="mt-2 border-t pt-2 font-medium">
                        <div className="flex justify-between">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href={`/order-tracking/${order.id}`}>
                          Track Order
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
