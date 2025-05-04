"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import Image from "next/image"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"

// Import the menu items data for fallback
import { menuItems } from "@/data/menu-items"

interface RelatedItemsProps {
  currentItemId: number
  category: string
}

export default function RelatedItems({ currentItemId, category }: RelatedItemsProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [relatedItems, setRelatedItems] = useState<any[]>([])

  useEffect(() => {
    const fetchRelatedItems = async () => {
      try {
        setIsLoading(true)

        // Fetch related items from Supabase
        const { data, error } = await supabase
          .from("menu_items")
          .select("*, categories(*)")
          .eq("categories.slug", category)
          .neq("id", currentItemId)
          .limit(4)

        if (error) throw error

        if (data && data.length > 0) {
          setRelatedItems(
            data.map((item) => ({
              ...item,
              category: item.categories?.slug || "",
              image: item.image_url,
            })),
          )
        } else {
          // Fallback to static data if no items found
          const filteredItems = menuItems
            .filter((item) => item.category === category && item.id !== currentItemId)
            .slice(0, 4)
          setRelatedItems(filteredItems)
        }
      } catch (error) {
        console.error("Error fetching related items:", error)

        // Fallback to static data on error
        const filteredItems = menuItems
          .filter((item) => item.category === category && item.id !== currentItemId)
          .slice(0, 4)
        setRelatedItems(filteredItems)
      } finally {
        setIsLoading(false)
      }
    }

    if (category) {
      fetchRelatedItems()
    } else {
      // If no category, use random items from static data
      const randomItems = menuItems
        .filter((item) => item.id !== currentItemId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
      setRelatedItems(randomItems)
      setIsLoading(false)
    }
  }, [currentItemId, category])

  const handleAddToCart = (item: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      })
      router.push("/login?redirect=/menu")
      return
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border-2 border-primary/20 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (relatedItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No related items found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
          className="overflow-hidden rounded-lg border-2 border-primary/20 bg-card shadow-lg transition-all hover:shadow-xl"
        >
          <Link href={`/menu/${item.id}`} className="block">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>
          <div className="p-4">
            <Link href={`/menu/${item.id}`} className="block">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{item.name}</h3>
                <span className="font-medium text-primary">₹{item.price.toFixed(2)}</span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </Link>
            <Button
              onClick={() => handleAddToCart(item)}
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
