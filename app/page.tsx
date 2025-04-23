import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import FoodCategories from "@/components/food-categories"
import { PageTransition } from "@/components/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=2000"
            alt="Delicious Indian food background"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>

        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="animate-bounce-in mb-6 text-5xl font-bold text-white md:text-7xl">
            <span className="text-primary">Spice</span>Bites
          </h1>
          <p className="animate-slide-up mb-8 max-w-2xl text-xl text-white">
            Authentic Indian cuisine delivered to your doorstep. Order now and enjoy a culinary experience like never
            before.
          </p>
          <div className="animate-fade-in-delay-2 flex flex-wrap gap-4">
            <Button asChild size="lg" className="group bg-primary text-lg font-semibold hover:bg-primary/90">
              <Link href="/menu">
                Explore Menu
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="default"
              className="bg-black text-white text-lg font-semibold hover:bg-black/80"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Popular Categories</h2>
        <FoodCategories />
      </section>

      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-16 dark:from-orange-950 dark:to-amber-950">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Why Choose <span className="text-primary">SpiceBites</span>?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 rounded-full bg-primary p-2 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Fast Delivery</h3>
                    <p className="text-muted-foreground">Your food delivered in 30 minutes or less</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 rounded-full bg-primary p-2 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Authentic Indian Cuisine</h3>
                    <p className="text-muted-foreground">Made with fresh ingredients and expert chefs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 rounded-full bg-primary p-2 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Live Order Tracking</h3>
                    <p className="text-muted-foreground">Track your order in real-time from kitchen to delivery</p>
                  </div>
                </li>
              </ul>
              <Button asChild className="mt-8 w-fit bg-primary hover:bg-primary/90">
                <Link href="/menu">Order Now</Link>
              </Button>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg">
              <Image
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000"
                alt="Chef preparing Indian food"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
