import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="/pk-secondary-brand-logo-colored.svg"
                alt="PharmaKart"
                width={140}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted pharmacy marketplace in Douala. Get genuine medicines delivered in 1-2 hours.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/pharmacies" className="text-muted-foreground hover:text-primary">
                  Find Pharmacies
                </Link>
              </li>
              <li>
                <Link href="/upload-prescription" className="text-muted-foreground hover:text-primary">
                  Upload Prescription
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-primary">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div className="space-y-4">
            <h3 className="font-semibold">For Business</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register?role=pharmacy" className="text-muted-foreground hover:text-primary">
                  Register Your Pharmacy
                </Link>
              </li>
              <li>
                <Link href="/register?role=rider" className="text-muted-foreground hover:text-primary">
                  Become a Rider
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Douala, Cameroon
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+237677900379" className="hover:text-primary">
                  +237677900379
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@pharmakart.app" className="hover:text-primary">
                  support@pharmakart.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PharmaKart. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
