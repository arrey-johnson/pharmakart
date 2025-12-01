'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, XCircle, ChevronRight, User, MapPin, Phone, Mail, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

interface Order {
  id: string
  createdAt: string
  status: string
  totalAmount: number
  pharmacy?: { name: string }
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  PREPARING: { label: 'Preparing', color: 'bg-purple-100 text-purple-700', icon: Package },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: Package },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function DashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return
      try {
        const data = await api.getOrders()
        setOrders(data || [])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setOrders([])
      } finally {
        setIsLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [isAuthenticated])

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-muted-foreground mt-1">Manage your orders and profile</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest medicine orders</CardDescription>
              </div>
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Link href="/search">
                      <Button variant="outline" className="mt-4">Browse Medicines</Button>
                    </Link>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order: Order) => {
                    const status = statusConfig[order.status] || statusConfig['PENDING']
                    const StatusIcon = status.icon
                    return (
                      <Link key={order.id} href={`/orders/${order.id}`}>
                        <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${status.color}`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">{order.pharmacy?.name || 'Pharmacy'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                            <Badge variant="secondary" className={status.color}>
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {user.address || user.subdivision 
                      ? `${user.address || ''}${user.address && user.subdivision ? ', ' : ''}${user.subdivision?.replace('_', ' ') || ''}`
                      : 'Not set'}
                  </p>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" className="w-full mt-4">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
