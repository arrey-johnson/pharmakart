'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, Building2, MapPin, Bike } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { UserRole } from '@/types'

function RegisterForm() {
  const { register } = useAuth()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role')?.toUpperCase() as UserRole | undefined
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole || '' as UserRole | '',
    pharmacyName: '',
    pharmacyAddress: '',
    subdivision: '',
    vehicleType: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.role) {
      toast.error('Please select your role')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        pharmacyName: formData.pharmacyName,
        pharmacyAddress: formData.pharmacyAddress,
        subdivision: formData.subdivision,
        vehicleType: formData.vehicleType,
      })

      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    { value: 'CLIENT', label: 'Customer', description: 'Order medicines for delivery' },
    { value: 'PHARMACY', label: 'Pharmacy Owner', description: 'Sell your medicines online' },
    { value: 'RIDER', label: 'Delivery Rider', description: 'Deliver medicines and earn' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">
          Join PharmaKart and get started today
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">I am a</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-11"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  className="pl-10 h-11"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 h-11"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Pharmacy-specific fields */}
          {formData.role === 'PHARMACY' && (
            <div className="space-y-4 p-4 rounded-xl bg-gray-50 border">
              <p className="text-sm font-medium text-muted-foreground">Pharmacy Details</p>
              <div className="space-y-2">
                <Label htmlFor="pharmacyName" className="text-sm font-medium">Pharmacy Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pharmacyName"
                    type="text"
                    placeholder="Your Pharmacy Name"
                    className="pl-10 h-11 bg-white"
                    value={formData.pharmacyName}
                    onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacyAddress" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pharmacyAddress"
                    type="text"
                    placeholder="Full address"
                    className="pl-10 h-11 bg-white"
                    value={formData.pharmacyAddress}
                    onChange={(e) => setFormData({ ...formData, pharmacyAddress: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdivision" className="text-sm font-medium">Subdivision</Label>
                <Select
                  value={formData.subdivision}
                  onValueChange={(value) => setFormData({ ...formData, subdivision: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-11 bg-white">
                    <SelectValue placeholder="Select subdivision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOUALA_I">Douala I</SelectItem>
                    <SelectItem value="DOUALA_II">Douala II</SelectItem>
                    <SelectItem value="DOUALA_III">Douala III</SelectItem>
                    <SelectItem value="DOUALA_IV">Douala IV</SelectItem>
                    <SelectItem value="DOUALA_V">Douala V</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Rider-specific fields */}
          {formData.role === 'RIDER' && (
            <div className="space-y-4 p-4 rounded-xl bg-gray-50 border">
              <p className="text-sm font-medium text-muted-foreground">Rider Details</p>
              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="text-sm font-medium">Vehicle Type</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-11 bg-white">
                    <Bike className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="pl-10 pr-10 h-11"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="pl-10 h-11"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-medium" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link href="/login" className="block">
          <Button variant="outline" className="w-full h-11">
            Sign in instead
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
