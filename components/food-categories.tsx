"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "North Indian",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800",
    count: 12,
  },
  {
    id: 2,
    name: "South Indian",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800",
    count: 8,
  },
  {
    id: 3,
    name: "Biryani",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800",
    count: 10,
  },
  {
    id: 4,
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800",
    count: 15,
  },
]

export default function FoodCategories() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group overflow-hidden rounded-lg border-2 border-primary/20 bg-card shadow-lg transition-all hover:shadow-xl"
        >
          <Link href={`/menu?category=${category.name.toLowerCase().replace(" ", "-")}`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-sm text-muted-foreground">{category.count} items</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
