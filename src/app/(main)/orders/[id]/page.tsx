'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, MapPin, Phone, Store, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface OrderItemDetail {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  pharmacyMedicine?: {
    medicine?: {
      name: string
    }
  }
}

interface OrderDetail {
  id: string
  createdAt: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: number
  deliveryFee: number
  totalAmount: number
  deliveryAddress: string
  clientPhone?: string
  notes?: string
  pharmacy?: {
    id: string
    name: string
    address: string
  }
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [items, setItems] = useState<OrderItemDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [orderData, itemsData] = await Promise.all([
          api.getOrder(id),
          api.getOrderItems(id),
        ])
        setOrder(orderData)
        setItems(itemsData)
      } catch (err: any) {
        setError(err.message || 'Failed to load order')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && isAuthenticated && id) {
      fetchData()
    }
  }, [id, authLoading, isAuthenticated])

  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!order || error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{error || 'Order not found.'}</p>
            <Button asChild>
              <Link href="/orders">View my orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status
  const statusColor = ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
            <Badge className={statusColor}>{statusLabel}</Badge>
          </div>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {item.pharmacyMedicine?.medicine?.name || 'Item'}
                      </p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pharmacy Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Store className="h-4 w-4" />
                Pharmacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{order.pharmacy?.name || 'Unknown Pharmacy'}</p>
              {order.pharmacy?.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{order.pharmacy.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{order.deliveryAddress}</p>
              {order.clientPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{order.clientPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span>{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
