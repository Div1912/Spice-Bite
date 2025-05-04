"use client"

import { PageTransition } from "@/components/page-transition"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About SpiceBites</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our journey, our passion for authentic Indian cuisine, and our commitment to quality.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
            <p className="mb-4 text-muted-foreground">
              SpiceBites was founded in 2018 with a simple mission: to bring authentic Indian flavors to your doorstep.
              What started as a small family kitchen has now grown into one of the most loved Indian food delivery
              services in the region.
            </p>
            <p className="mb-6 text-muted-foreground">
              Our founder, Chef Rajesh Kumar, brings over 20 years of culinary expertise from the heart of India. His
              passion for traditional recipes combined with modern cooking techniques creates a unique dining experience
              that keeps our customers coming back for more.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105">
              <Link href="/menu">Explore Our Menu</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000"
              alt="SpiceBites restaurant interior"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Quality Ingredients",
                description:
                  "We source the freshest ingredients and authentic spices to ensure every dish delivers the true taste of India.",
                icon: "🌿",
                delay: 0,
              },
              {
                title: "Culinary Excellence",
                description:
                  "Our chefs are trained in traditional cooking methods, bringing generations of culinary expertise to your table.",
                icon: "👨‍🍳",
                delay: 0.2,
              },
              {
                title: "Customer Satisfaction",
                description:
                  "Your satisfaction is our priority. We strive to provide exceptional food and service with every order.",
                icon: "🌟",
                delay: 0.4,
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: value.delay }}
                className="rounded-lg border-2 border-primary/20 bg-card p-6 shadow-lg transition-transform hover:scale-105"
              >
                <div className="mb-4 text-4xl">{value.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Team Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                name: "Rajesh Kumar",
                role: "Founder & Head Chef",
                image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800",
                delay: 0,
              },
              {
                name: "Priya Sharma",
                role: "Executive Chef",
                image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=800",
                delay: 0.1,
              },
              {
                name: "Amit Patel",
                role: "Operations Manager",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
                delay: 0.2,
              },
              {
                name: "Neha Gupta",
                role: "Customer Relations",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800",
                delay: 0.3,
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.delay }}
                className="overflow-hidden rounded-lg border-2 border-primary/20 bg-card shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-8 text-center dark:from-orange-950 dark:to-amber-950">
          <h2 className="mb-4 text-3xl font-bold">Ready to Experience Authentic Indian Cuisine?</h2>
          <p className="mb-6 mx-auto max-w-2xl text-muted-foreground">
            Order now and embark on a culinary journey through the rich and diverse flavors of India.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105">
              <Link href="/menu">Browse Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/20 transition-transform hover:scale-105"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
