"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

const menuItems = [
  // North Indian
  {
    id: 1,
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato sauce",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
    category: "north-indian",
  },
  {
    id: 2,
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese in a spiced tomato gravy",
    price: 249.99,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fkannanskitchen.com%2Fpaneer-tikka-masala%2F&psig=AOvVaw1wyrZcr_BtvfwZuLFJ7qpu&ust=1748244577163000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCB0NmMvo0DFQAAAAAdAAAAABAE",
    category: "north-indian",
  },
  {
    id: 3,
    name: "Dal Makhani",
    description: "Black lentils and kidney beans in a creamy butter sauce",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=800",
    category: "north-indian",
  },
  // South Indian
  {
    id: 4,
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato filling",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
    category: "south-indian",
  },
  {
    id: 5,
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil soup and chutney",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1589301761966-e6506b293111?q=80&w=800",
    category: "south-indian",
  },
  {
    id: 6,
    name: "Chettinad Chicken",
    description: "Spicy chicken curry with aromatic spices",
    price: 279.99,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800",
    category: "south-indian",
  },
  // Biryani
  {
    id: 7,
    name: "Hyderabadi Chicken Biryani",
    description: "Fragrant basmati rice cooked with chicken and spices",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800",
    category: "biryani",
  },
  {
    id: 8,
    name: "Vegetable Biryani",
    description: "Basmati rice cooked with mixed vegetables and spices",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=800",
    category: "biryani",
  },
  {
    id: 9,
    name: "Mutton Biryani",
    description: "Tender mutton pieces cooked with aromatic rice",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800",
    category: "biryani",
  },
  // Desserts
  {
    id: 10,
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1601303516534-bf0b1eb70df0?q=80&w=800",
    category: "desserts",
  },
  {
    id: 11,
    name: "Rasgulla",
    description: "Soft cheese balls soaked in light sugar syrup",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1605197161470-5d2a9af0ac7e?q=80&w=800",
    category: "desserts",
  },
  {
    id: 12,
    name: "Kulfi",
    description: "Traditional Indian ice cream with nuts and cardamom",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800",
    category: "desserts",
  },
]

export default function MenuItems() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const categoryParam = searchParams ? searchParams.get("category") : null
  const { user } = useAuth()
  const router = useRouter()

  const [filteredItems, setFilteredItems] = useState(menuItems)

  useEffect(() => {
    if (categoryParam) {
      setFilteredItems(menuItems.filter((item) => item.category.toLowerCase() === categoryParam.toLowerCase()))
    } else {
      setFilteredItems(menuItems)
    }
  }, [categoryParam])

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

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5 }}
          className="overflow-hidden rounded-lg border-2 border-primary/20 bg-card shadow-lg transition-all hover:shadow-xl"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="font-medium text-primary">₹{item.price.toFixed(2)}</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
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
