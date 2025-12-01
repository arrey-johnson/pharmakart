import Link from 'next/link'
import { Search, Upload, Clock, Shield, Truck, ChevronRight, Thermometer, Wind, Bug, HeartPulse, Droplet, Baby, Pill, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const categories = [
  { name: 'Pain & Fever', slug: 'pain-fever', icon: Thermometer, color: 'bg-red-100 text-red-600' },
  { name: 'Cough & Cold', slug: 'cough-cold', icon: Wind, color: 'bg-blue-100 text-blue-600' },
  { name: 'Malaria', slug: 'malaria', icon: Bug, color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Hypertension', slug: 'hypertension', icon: HeartPulse, color: 'bg-pink-100 text-pink-600' },
  { name: 'Diabetes', slug: 'diabetes', icon: Droplet, color: 'bg-purple-100 text-purple-600' },
  { name: 'Baby & Children', slug: 'baby-children', icon: Baby, color: 'bg-green-100 text-green-600' },
  { name: 'Vitamins', slug: 'vitamins-supplements', icon: Pill, color: 'bg-orange-100 text-orange-600' },
  { name: 'Antibiotics', slug: 'antibiotics', icon: ShieldCheck, color: 'bg-teal-100 text-teal-600' },
]

const features = [
  {
    icon: Shield,
    title: 'Licensed Pharmacies',
    description: 'All partner pharmacies are verified and licensed in Cameroon',
  },
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: 'Get your medicines delivered in 1-2 hours across Douala',
  },
  {
    icon: Truck,
    title: 'Real-time Tracking',
    description: 'Track your order from pharmacy to your doorstep',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Your Health, <span className="text-primary bg-white px-3 py-1 rounded-lg inline-block animate-pulse">Delivered</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                Get genuine medicines from licensed pharmacies, delivered to your doorstep in 1-2 hours.
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mt-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white z-10 pointer-events-none" />
                  <Input 
                    type="search"
                    placeholder="Search for medicines..."
                    className="h-12 pl-12 text-base rounded-xl bg-white/10 backdrop-blur-md border-white/30 text-white placeholder:text-white/60 focus:border-white/50 focus:ring-white/20"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-primary/90">
                  Search
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link href="/upload-prescription">
                  <Button variant="outline" size="lg" className="gap-2 rounded-xl bg-white text-black hover:bg-white/90">
                    <Upload className="h-5 w-5" />
                    Upload Prescription
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="ghost" size="lg" className="gap-2 rounded-xl text-white hover:bg-white/10">
                    Browse Categories
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Shop by Category</h2>
                <p className="text-muted-foreground mt-1">Find medicines for your needs</p>
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                      <div className={`p-3 rounded-xl ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold">Why Choose PharmaKart?</h2>
              <p className="text-muted-foreground mt-2">The safest way to buy medicines online in Douala</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Are you a Pharmacy Owner?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join PharmaKart and reach thousands of customers in Douala. Easy onboarding, low commission, fast payouts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register?role=pharmacy">
                <Button size="lg" variant="secondary" className="rounded-xl">
                  Register Your Pharmacy
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="rounded-xl bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Delivery CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Want to Earn as a Delivery Rider?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Become a PharmaKart delivery partner. Flexible hours, daily earnings, and be part of healthcare delivery in Douala.
            </p>
            <Link href="/register?role=rider">
              <Button size="lg" variant="outline" className="rounded-xl">
                Become a Rider
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
