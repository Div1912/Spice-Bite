"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

const categories = [
  { id: "all", name: "All" },
  { id: "north-indian", name: "North Indian" },
  { id: "south-indian", name: "South Indian" },
  { id: "biryani", name: "Biryani" },
  { id: "desserts", name: "Desserts" },
]

export default function MenuFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryParam = searchParams ? searchParams.get("category") : null
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam)
    } else {
      setActiveCategory("all")
    }
  }, [categoryParam])

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)

    if (categoryId === "all") {
      router.push("/menu")
    } else {
      router.push(`/menu?category=${categoryId}`)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <motion.div key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-primary/20"
              } font-medium transition-all duration-300`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
