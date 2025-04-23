import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"
import MenuItems from "@/components/menu-items"
import MenuFilter from "@/components/menu-filter"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuPage() {
  return (
    <PageTransition>
      <div className="container py-12">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">Our Menu</h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Explore our wide range of delicious meals prepared by expert chefs using the freshest ingredients. Find your
          favorite dish and order now!
        </p>

        <Suspense
          fallback={
            <div className="flex justify-center gap-2 mb-8">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          }
        >
          <MenuFilter />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          }
        >
          <MenuItems />
        </Suspense>
      </div>
    </PageTransition>
  )
}
