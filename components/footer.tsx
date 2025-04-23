import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              <span className="text-primary">Spice</span>Bites
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Authentic Indian cuisine delivered to your doorstep. Enjoy a culinary experience like never before.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground transition-colors hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground transition-colors hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground transition-colors hover:text-primary">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2 text-sm text-muted-foreground">3A Moharkunja Apartment, New Town, Kolkata 700157</p>
              <p className="mb-2 text-sm text-muted-foreground">Phone: +91 7004238685</p>
              <p className="text-sm text-muted-foreground">Email: info@spicebites.com</p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-muted-foreground">
                <span>Monday - Friday:</span>
                <span>10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Saturday:</span>
                <span>10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Sunday:</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SpiceBites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
