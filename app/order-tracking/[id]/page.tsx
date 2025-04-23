"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { useOrder } from "@/context/order-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const { getOrderById } = useOrder()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState("")
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)

    // Load order data
    const loadOrder = () => {
      const orderData = getOrderById(orderId)
      if (orderData) {
        setOrder(orderData)

        // Calculate current step
        const completedSteps = orderData.trackingSteps.filter((step: any) => step.completed)
        setCurrentStep(completedSteps.length)

        // Calculate progress percentage
        setProgress((completedSteps.length / orderData.trackingSteps.length) * 100)

        // Calculate estimated delivery time
        if (orderData.estimatedDeliveryTime) {
          const orderDate = new Date(orderData.date)
          const deliveryTime = new Date(orderDate.getTime() + orderData.estimatedDeliveryTime * 60000)
          setEstimatedTime(deliveryTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        }
      }
    }

    loadOrder()

    // Set up refresh interval to simulate real-time updates
    const interval = setInterval(loadOrder, 10000) // Refresh every 10 seconds
    setRefreshInterval(interval)

    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [orderId, getOrderById, refreshInterval])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your order",
        variant: "destructive",
      })
      router.push("/login?redirect=/order-tracking/" + orderId)
    }
  }, [mounted, user, router, toast, orderId])

  if (!mounted || !user || !order) {
    return null
  }

  return (
    <PageTransition>
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold md:text-4xl">Track Your Order</h1>
            <p className="mt-2 text-muted-foreground">
              Order ID: <span className="font-medium text-primary">#{order.id}</span>
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Real-time tracking of your order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Order Progress</span>
                      <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-muted" />
                  </div>

                  <div className="relative">
                    {order.trackingSteps.map((step: any, index: number) => (
                      <div key={step.id} className="mb-8 flex items-start last:mb-0">
                        <div
                          className={`mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                            step.completed
                              ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{step.id}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${step.completed ? "text-green-600 dark:text-green-400" : ""}`}>
                            {step.title}
                          </h3>
                          {step.completed && step.time && (
                            <p className="text-sm text-muted-foreground">
                              {new Date(step.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                          {index < order.trackingSteps.length - 1 && (
                            <div className="absolute left-4 ml-[-1px] mt-2 h-12 w-0.5 bg-muted"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg bg-muted p-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      <span className="font-medium">Estimated Delivery Time:</span>
                      <span className="ml-2">{estimatedTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Delivery Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.address}, {order.city}, {order.pinCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="mr-2 h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Contact</h3>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    {order.items.map((item: any) => (
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
                      <span>
                        ₹
                        {order.items
                          .reduce((total: number, item: any) => total + item.price * item.quantity, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>₹49.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (5%)</span>
                      <span>
                        ₹
                        {(
                          order.items.reduce((total: number, item: any) => total + item.price * item.quantity, 0) * 0.05
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex flex-col gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/orders">View All Orders</Link>
                </Button>
                <Button asChild variant="outline" className="border-primary/20">
                  <Link href="/menu">Order More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
