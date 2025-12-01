'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Package, Clock, CheckCircle, MapPin, Phone, Navigation, DollarSign, Bike, LogOut, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface RiderDelivery {
  id: string
  orderId: string
  status: string
  riderFee?: number
  riderRating?: number | null
  createdAt?: string
  updatedAt?: string
  order?: {
    deliveryAddress?: string
    subdivision?: string
    clientPhone?: string
    client?: {
      name?: string
    }
    pharmacy?: {
      name?: string
      address?: string
    }
  }
}

interface RiderStats {
  todayDeliveries: number
  todayEarnings: number
  totalEarnings: number
  totalDeliveries: number
  averageRating: number
}

const statusConfig: Record<string, { label: string; color: string; nextAction: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', nextAction: 'On the way to pharmacy' },
  ON_THE_WAY_TO_PHARMACY: {
    label: 'On the way to pharmacy',
    color: 'bg-blue-100 text-blue-700',
    nextAction: 'Picked up',
  },
  PICKED_UP: { label: 'Picked up', color: 'bg-orange-100 text-orange-700', nextAction: 'On the way to client' },
  ON_THE_WAY_TO_CLIENT: {
    label: 'On the way to client',
    color: 'bg-purple-100 text-purple-700',
    nextAction: 'Delivered',
  },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', nextAction: '' },
}

export default function RiderDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deliveries, setDeliveries] = useState<RiderDelivery[]>([])
  const [stats, setStats] = useState<RiderStats>({
    todayDeliveries: 0,
    todayEarnings: 0,
    totalEarnings: 0,
    totalDeliveries: 0,
    averageRating: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getRiderEarnings()
        const deliveriesData = (data as any).deliveries || []

        const today = new Date()
        const isSameDay = (dateString?: string) => {
          if (!dateString) return false
          const d = new Date(dateString)
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          )
        }

        const todayDeliveries = deliveriesData.filter((d: any) => isSameDay(d.createdAt))
        const todayEarnings = todayDeliveries.reduce(
          (sum: number, d: any) => sum + (d.riderFee || 0),
          0
        )
        const ratedDeliveries = deliveriesData.filter((d: any) => d.riderRating != null)
        const averageRating =
          ratedDeliveries.length > 0
            ? ratedDeliveries.reduce((sum: number, d: any) => sum + d.riderRating, 0) /
              ratedDeliveries.length
            : 0

        setDeliveries(deliveriesData)
        setStats({
          todayDeliveries: todayDeliveries.length,
          todayEarnings,
          totalEarnings: (data as any).totalEarnings || 0,
          totalDeliveries: (data as any).totalDeliveries || deliveriesData.length,
          averageRating,
        })
      } catch (err: any) {
        const message = err?.message || 'Failed to load rider data'
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'RIDER') {
        router.push('/login')
        return
      }
      loadData()
    }
  }, [authLoading, isAuthenticated, user?.role, router])

  const activeDeliveries = deliveries.filter((delivery) => delivery.status !== 'DELIVERED')

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">PharmaKart</h1>
              <p className="text-sm text-muted-foreground">Rider Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <Switch checked={isOnline} onCheckedChange={setIsOnline} />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bike className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.todayDeliveries}</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(stats.todayEarnings)}</p>
                  <p className="text-xs text-muted-foreground">Today's Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <CheckCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Deliveries */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Your current delivery assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {activeDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active deliveries</p>
                <p className="text-sm text-muted-foreground">New orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((delivery) => {
                  const status = statusConfig[delivery.status] || {
                    label: delivery.status,
                    color: 'bg-gray-100 text-gray-700',
                    nextAction: '',
                  }
                  const createdAt = delivery.createdAt ? new Date(delivery.createdAt) : null

                  return (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{delivery.orderId}</span>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            +{formatPrice(delivery.riderFee || 0)}
                          </p>
                          {createdAt && (
                            <p className="text-xs text-muted-foreground">
                              {createdAt.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Pharmacy */}
                      <div className="flex items-start gap-3 mb-3 p-3 bg-muted/50 rounded-lg">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Pickup: {delivery.order?.pharmacy?.name || 'Pharmacy'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {delivery.order?.pharmacy?.address || 'Address not available'}
                          </p>
                        </div>
                      </div>

                      {/* Customer */}
                      <div className="flex items-start gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="p-2 rounded-full bg-green-100">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Deliver to: {delivery.order?.client?.name || 'Customer'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {delivery.order?.deliveryAddress}
                            {delivery.order?.subdivision
                              ? `, ${delivery.order.subdivision}`
                              : ''}
                          </p>
                        </div>
                        {delivery.order?.clientPhone && (
                          <a href={`tel:${delivery.order.clientPhone}`}>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
                <p className="text-sm text-muted-foreground">Total Deliveries</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full History
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
