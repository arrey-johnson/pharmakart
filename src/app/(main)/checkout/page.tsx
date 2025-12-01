'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, Upload, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice, SUBDIVISIONS, DEFAULT_DELIVERY_FEES, PAYMENT_METHOD_LABELS } from '@/lib/constants'
import { PaymentMethod } from '@/types'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, getSubtotal, clearCart, hasItemsRequiringPrescription, getPharmacyId } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    subdivision: '',
    notes: '',
    paymentMethod: '' as PaymentMethod | '',
    momoNumber: '',
  })

  const subtotal = getSubtotal()
  const deliveryFee = DEFAULT_DELIVERY_FEES['0_5km']
  const total = subtotal + deliveryFee
  const needsPrescription = hasItemsRequiringPrescription()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    if ((formData.paymentMethod === 'MTN_MOMO' || formData.paymentMethod === 'ORANGE_MONEY') && !formData.momoNumber) {
      toast.error('Please enter your mobile money number')
      return
    }

    if (!formData.subdivision) {
      toast.error('Please select your subdivision')
      return
    }

    setIsLoading(true)

    try {
      const pharmacyId = getPharmacyId()
      if (!pharmacyId) {
        toast.error('Unable to determine pharmacy for this order')
        setIsLoading(false)
        return
      }

      const order = await api.createOrder({
        pharmacyId,
        deliveryAddress: formData.address,
        subdivision: formData.subdivision,
        paymentMethod: formData.paymentMethod,
        clientPhone: formData.phone,
        notes: formData.notes || undefined,
        items: items.map((item) => ({
          pharmacyMedicineId: item.pharmacy_medicine_id,
          quantity: item.quantity,
        })),
      })

      toast.success('Order placed successfully!')
      clearCart()
      router.push(`/orders/${order.id}`)
    } catch (error: any) {
      console.error('Failed to place order:', error)
      toast.error(error.message || 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to your cart before checkout.</p>
        <Link href="/search">
          <Button>Browse Medicines</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdivision">Subdivision *</Label>
                  <Select
                    value={formData.subdivision}
                    onValueChange={(value) => setFormData({ ...formData, subdivision: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your subdivision" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBDIVISIONS.map((sub) => (
                        <SelectItem key={sub.value} value={sub.value}>
                          {sub.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address (street, landmark, etc.)"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions for delivery"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prescription Upload */}
            {needsPrescription && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Prescription Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Some items require a prescription. Upload a clear photo of your prescription.
                    </p>
                    <Button variant="outline" type="button">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepted formats: JPG, PNG, PDF (max 5MB)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  {(['MTN_MOMO', 'ORANGE_MONEY', 'CASH_ON_DELIVERY'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      disabled={isLoading}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        formData.paymentMethod === method
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-center h-10">
                        {method === 'MTN_MOMO' && (
                          <Image
                            src="/momo_mtna.png"
                            alt="MTN Mobile Money"
                            width={80}
                            height={32}
                            className="h-8 w-auto"
                          />
                        )}
                        {method === 'ORANGE_MONEY' && (
                          <Image
                            src="/Logo Orange Money_0_0.svg"
                            alt="Orange Money"
                            width={80}
                            height={32}
                            className="h-8 w-auto"
                          />
                        )}
                        {method === 'CASH_ON_DELIVERY' && (
                          <span className="text-2xl" aria-hidden="true">
                            💵
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{PAYMENT_METHOD_LABELS[method]}</p>
                    </button>
                  ))}
                </div>

                {/* Mobile Money Number */}
                {(formData.paymentMethod === 'MTN_MOMO' || formData.paymentMethod === 'ORANGE_MONEY') && (
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="momoNumber">
                      {formData.paymentMethod === 'MTN_MOMO' ? 'MTN MoMo Number' : 'Orange Money Number'} *
                    </Label>
                    <Input
                      id="momoNumber"
                      type="tel"
                      placeholder="6XX XXX XXX"
                      value={formData.momoNumber}
                      onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      You will receive a payment prompt on this number.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'CASH_ON_DELIVERY' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please have the exact amount ready. Our rider will collect payment upon delivery.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.pharmacy_medicine_id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.medicine_name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Place Order - {formatPrice(total)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
