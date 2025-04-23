"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNotification } from "./notification-context"

interface Order {
  id: string
  items: any[]
  total: string
  address: string
  city: string
  pinCode: string
  customerName: string
  customerPhone: string
  customerEmail: string
  paymentMethod: string
  notes?: string
  status: string
  date: string
  userId: string
  estimatedDeliveryTime: number
  trackingSteps: {
    id: number
    title: string
    completed: boolean
    time: string | null
  }[]
}

interface OrderContextType {
  orders: Order[]
  createOrder: (order: Order) => void
  updateOrder: (id: string, updatedOrder: Order) => void
  getOrderById: (id: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  createOrder: () => {},
  updateOrder: () => {},
  getOrderById: () => undefined,
})

export const useOrder = () => useContext(OrderContext)

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const { addNotification } = useNotification()

  // Load orders from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error("Failed to parse orders from localStorage:", error)
      }
    }
  }, [])

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders, mounted])

  const createOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order])
  }

  const updateOrder = (id: string, updatedOrder: Order) => {
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => (order.id === id ? updatedOrder : order))

      // Add notification for customer when order status changes
      const oldOrder = prevOrders.find((order) => order.id === id)
      if (oldOrder && oldOrder.status !== updatedOrder.status) {
        const notificationTitle =
          updatedOrder.status === "confirmed"
            ? "Order Confirmed"
            : updatedOrder.status === "preparing"
              ? "Food Preparation Started"
              : updatedOrder.status === "out-for-delivery"
                ? "Order Out for Delivery"
                : "Order Delivered"

        const notificationMessage =
          updatedOrder.status === "confirmed"
            ? "Your order has been confirmed and will be prepared soon."
            : updatedOrder.status === "preparing"
              ? "Our chefs have started preparing your delicious meal."
              : updatedOrder.status === "out-for-delivery"
                ? "Your order is on the way to your location."
                : "Your order has been delivered. Enjoy your meal!"

        addNotification({
          id: Date.now().toString(),
          title: notificationTitle,
          message: notificationMessage,
          type: "order-update",
          read: false,
          time: new Date().toISOString(),
          orderId: id,
          forRole: "customer",
          userId: updatedOrder.userId,
        })
      }

      return newOrders
    })
  }

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
