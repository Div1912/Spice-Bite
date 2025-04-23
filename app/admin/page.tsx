"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { useAuth } from "@/context/auth-context"
import { useOrder } from "@/context/order-context"
import { useNotification } from "@/context/notification-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Bell, Package } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AdminNavbar from "@/components/admin-navbar"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { orders, updateOrder } = useOrder()
  const { notifications, markNotificationAsRead } = useNotification()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("new")
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not admin
  useEffect(() => {
    if (mounted && (!user || user.email !== "admin@spicebites.com")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [mounted, user, router, toast])

  // Calculate stats
  useEffect(() => {
    if (orders.length > 0) {
      const totalOrders = orders.length
      const pendingOrders = orders.filter((order) => order.status !== "delivered").length
      const completedOrders = orders.filter((order) => order.status === "delivered").length
      const totalRevenue = orders.reduce((total, order) => total + Number.parseFloat(order.total), 0)

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
      })
    }
  }, [orders])

  // Handle order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: string, stepIndex: number) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    // Update tracking steps
    const updatedTrackingSteps = [...order.trackingSteps]
    updatedTrackingSteps[stepIndex] = {
      ...updatedTrackingSteps[stepIndex],
      completed: true,
      time: new Date().toISOString(),
    }

    // Update order
    updateOrder(orderId, {
      ...order,
      status: newStatus,
      trackingSteps: updatedTrackingSteps,
    })

    // Add notification for customer
    const notificationTitle =
      newStatus === "confirmed"
        ? "Order Confirmed"
        : newStatus === "preparing"
          ? "Food Preparation Started"
          : newStatus === "out-for-delivery"
            ? "Order Out for Delivery"
            : "Order Delivered"

    // Show toast
    toast({
      title: "Order Updated",
      description: `Order #${orderId} has been ${newStatus === "confirmed" ? "confirmed" : newStatus}`,
    })
  }

  if (!mounted || !user || user.email !== "admin@spicebites.com") {
    return null
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "new") return order.status === "pending"
    if (activeTab === "confirmed") return order.status === "confirmed"
    if (activeTab === "preparing") return order.status === "preparing"
    if (activeTab === "out-for-delivery") return order.status === "out-for-delivery"
    if (activeTab === "delivered") return order.status === "delivered"
    return true
  })

  // Get unread notifications for owner
  const unreadNotifications = notifications.filter(
    (notification) => notification.forRole === "owner" && !notification.read,
  )

  return (
    <>
      <AdminNavbar />
      <PageTransition>
        <div className="container py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
              <p className="text-muted-foreground">Manage orders and track restaurant performance</p>
            </div>

            <div className="mt-4 flex items-center md:mt-0">
              <Button variant="outline" className="relative border-primary/20">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedOrders}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Orders Management */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="new" onValueChange={setActiveTab}>
                <TabsList className="mb-4 grid w-full grid-cols-5">
                  <TabsTrigger value="new" className="relative">
                    New
                    {orders.filter((order) => order.status === "pending").length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {orders.filter((order) => order.status === "pending").length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="preparing">Preparing</TabsTrigger>
                  <TabsTrigger value="out-for-delivery">Out for Delivery</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  {filteredOrders.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                      <Package className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="mb-1 text-lg font-medium">No Orders</h3>
                      <p className="text-sm text-muted-foreground">There are no {activeTab} orders at the moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/50 pb-2 pt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                  <CardDescription>{new Date(order.date).toLocaleString()}</CardDescription>
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
                                    ? "New Order"
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
                              <div className="mb-4 grid gap-4 md:grid-cols-2">
                                <div>
                                  <h3 className="mb-2 font-medium">Customer Details</h3>
                                  <p className="text-sm">{order.customerName}</p>
                                  <p className="text-sm">{order.customerPhone}</p>
                                  <p className="text-sm">
                                    {order.address}, {order.city}, {order.pinCode}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="mb-2 font-medium">Order Summary</h3>
                                  <ul className="space-y-1 text-sm">
                                    {order.items.map((item: any) => (
                                      <li key={item.id} className="flex justify-between">
                                        <span>
                                          {item.quantity}x {item.name}
                                        </span>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="mt-2 border-t pt-2 text-sm font-medium">
                                    <div className="flex justify-between">
                                      <span>Total</span>
                                      <span>₹{order.total}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t bg-muted/50">
                              {order.status === "pending" && (
                                <Button
                                  onClick={() => handleUpdateOrderStatus(order.id, "confirmed", 1)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirm Order
                                </Button>
                              )}
                              {order.status === "confirmed" && (
                                <Button
                                  onClick={() => handleUpdateOrderStatus(order.id, "preparing", 2)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  Start Preparing
                                </Button>
                              )}
                              {order.status === "preparing" && (
                                <Button
                                  onClick={() => handleUpdateOrderStatus(order.id, "out-for-delivery", 3)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  Send for Delivery
                                </Button>
                              )}
                              {order.status === "out-for-delivery" && (
                                <Button
                                  onClick={() => handleUpdateOrderStatus(order.id, "delivered", 4)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Delivered
                                </Button>
                              )}
                              <Button variant="outline" className="border-primary/20">
                                View Details
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </>
  )
}
