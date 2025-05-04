"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Minus, Plus, Share, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import RelatedItems from "@/components/related-items"
import ReviewsSection from "@/components/reviews-section"
import { supabase } from "@/lib/supabase"

// Import the menu items data
import { menuItems } from "@/data/menu-items"

export default function MenuItemPage() {
  const params = useParams()
  const itemId = Number.parseInt(params.id as string)
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [item, setItem] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    // Find the item in our static data first for immediate display
    const foundItem = menuItems.find((item) => item.id === itemId)
    if (foundItem) {
      setItem(foundItem)
    }

    // Then fetch the latest data from Supabase
    const fetchItemDetails = async () => {
      try {
        setIsLoading(true)

        // Fetch menu item details
        const { data: menuItem, error: menuError } = await supabase
          .from("menu_items")
          .select("*, categories(*)")
          .eq("id", itemId)
          .single()

        if (menuError) throw menuError

        if (menuItem) {
          setItem({
            ...menuItem,
            category: menuItem.categories?.slug || "",
            image: menuItem.image_url,
          })
        }

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("review_details")
          .select("*")
          .eq("menu_item_id", itemId)
          .order("created_at", { ascending: false })

        if (reviewsError) throw reviewsError

        setReviews(reviewsData || [])

        // Check if item is favorited by current user
        if (user) {
          const { data: favoriteData, error: favoriteError } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", user.id)
            .eq("menu_item_id", itemId)
            .single()

          if (!favoriteError) {
            setIsFavorite(!!favoriteData)
          }
        }
      } catch (error) {
        console.error("Error fetching item details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItemDetails()
  }, [itemId, user])

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      })
      router.push(`/login?redirect=/menu/${itemId}`)
      return
    }

    if (!item) return

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: quantity,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save favorites",
        variant: "destructive",
      })
      router.push(`/login?redirect=/menu/${itemId}`)
      return
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("menu_item_id", itemId)

        setIsFavorite(false)
        toast({
          title: "Removed from favorites",
          description: `${item?.name} has been removed from your favorites`,
        })
      } else {
        // Add to favorites
        await supabase.from("favorites").insert({
          user_id: user.id,
          menu_item_id: itemId,
        })

        setIsFavorite(true)
        toast({
          title: "Added to favorites",
          description: `${item?.name} has been added to your favorites`,
        })
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!item && !isLoading) {
    return (
      <PageTransition>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-4 text-2xl font-semibold">Item not found</h2>
            <p className="mb-8 text-center text-muted-foreground">
              The menu item you're looking for doesn't exist or has been removed.
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
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Section */}
          <div>
            {isLoading ? (
              <Skeleton className="aspect-square w-full rounded-lg" />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square overflow-hidden rounded-lg border-2 border-primary/20"
              >
                <Image
                  src={item?.image || "/placeholder.svg"}
                  alt={item?.name || "Menu item"}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}
          </div>

          {/* Details Section */}
          <div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      {item?.category_name || item?.category || "Main Course"}
                    </Badge>
                    {item?.is_vegetarian && <Badge className="bg-green-500 hover:bg-green-600">Vegetarian</Badge>}
                    {item?.is_spicy && <Badge className="bg-red-500 hover:bg-red-600">Spicy</Badge>}
                  </div>
                  <h1 className="text-3xl font-bold md:text-4xl">{item?.name}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(item?.average_rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item?.average_rating?.toFixed(1) || "New"} ({item?.review_count || 0} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground">{item?.description}</p>

                <div className="text-2xl font-bold text-primary">₹{item?.price?.toFixed(2)}</div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center rounded-md border border-primary/20">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-lg font-semibold hover:bg-primary/90 transition-transform hover:scale-105"
                  >
                    Add to Cart
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="border-primary/20 transition-transform hover:scale-105"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/20 transition-transform hover:scale-105"
                    onClick={() => {
                      navigator
                        .share({
                          title: item?.name,
                          text: item?.description,
                          url: window.location.href,
                        })
                        .catch(() => {
                          navigator.clipboard.writeText(window.location.href)
                          toast({
                            title: "Link copied",
                            description: "The link has been copied to your clipboard",
                          })
                        })
                    }}
                  >
                    <Share className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="related">Related Items</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Ingredients</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Fresh vegetables</li>
                    <li>Aromatic spices</li>
                    <li>Basmati rice</li>
                    <li>Ghee (clarified butter)</li>
                    <li>Fresh herbs</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Nutritional Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span>Calories</span>
                      <span>450 kcal</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Protein</span>
                      <span>18g</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Carbohydrates</span>
                      <span>65g</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Fat</span>
                      <span>12g</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsSection menuItemId={itemId} reviews={reviews} setReviews={setReviews} />
            </TabsContent>

            <TabsContent value="related">
              <RelatedItems currentItemId={itemId} category={item?.category || ""} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}
