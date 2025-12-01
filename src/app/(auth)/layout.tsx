import Link from 'next/link'
import Image from 'next/image'
import { Shield, Clock, Truck, Pill, ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/pk-secondary-brand-logo-white.svg"
              alt="PharmaKart"
              width={180}
              height={50}
              className="h-12 w-auto"
            />
          </Link>
          
          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                Your Health,<br />
                <span className="text-white/90">Delivered with Care</span>
              </h1>
              <p className="mt-4 text-lg text-white/80 max-w-md">
                Get genuine medicines from licensed pharmacies, delivered to your doorstep quickly and safely.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-white/20">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">100% Genuine</p>
                  <p className="text-sm text-white/70">Licensed pharmacies</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-white/20">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Fast Delivery</p>
                  <p className="text-sm text-white/70">Within 1-2 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-white/20">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Wide Selection</p>
                  <p className="text-sm text-white/70">10,000+ medicines</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-white/20">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Track Orders</p>
                  <p className="text-sm text-white/70">Real-time updates</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} PharmaKart. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header with Back Button */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center lg:hidden">
            <Image
              src="/pk-secondary-brand-logo-colored.svg"
              alt="PharmaKart"
              width={140}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to website</span>
          </Link>
        </div>
        
        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50/50">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
