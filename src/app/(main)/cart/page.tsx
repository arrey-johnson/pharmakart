'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'
import { formatPrice, DEFAULT_DELIVERY_FEES } from '@/lib/constants'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, hasItemsRequiringPrescription } = useCartStore()
  
  const subtotal = getSubtotal()
  const deliveryFee = items.length > 0 ? DEFAULT_DELIVERY_FEES['0_5km'] : 0
  const total = subtotal + deliveryFee
  const needsPrescription = hasItemsRequiringPrescription()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Looks like you haven&apos;t added any medicines to your cart yet.
          </p>
          <Link href="/search">
            <Button size="lg" className="mt-4">
              Browse Medicines
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Continue shopping
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
              Clear cart
            </Button>
          </div>

          <Card>
            <CardContent className="p-0 divide-y">
              {items.map((item) => (
                <div key={item.pharmacy_medicine_id} className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-3xl">💊</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{item.medicine_name}</h3>
                        <p className="text-sm text-muted-foreground">{item.pharmacy_name}</p>
                        {item.prescription_required && (
                          <Badge variant="secondary" className="mt-1 text-xs">Rx Required</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.pharmacy_medicine_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.pharmacy_medicine_id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.pharmacy_medicine_id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prescription Notice */}
          {needsPrescription && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4 flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary">Prescription Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Some items in your cart require a prescription. You&apos;ll need to upload it during checkout.
                  </p>
                  <Link href="/upload-prescription">
                    <Button variant="link" className="px-0 mt-1 h-auto text-sm">
                      Upload prescription now →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
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

              <p className="text-xs text-muted-foreground">
                Delivery fees may vary based on your exact location.
              </p>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Secure payment with MTN MoMo or Orange Money
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
