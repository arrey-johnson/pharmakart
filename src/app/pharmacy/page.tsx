'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, XCircle, DollarSign, TrendingUp, Pill, AlertCircle, Loader2, LogOut, Settings, Truck, Upload, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface Order {
  id: string
  createdAt: string
  status: string
  totalAmount: number
  client: {
    name: string
  }
  itemCount?: number
}

interface LowStockItem {
  id: string
  stockQuantity: number
  medicine: {
    name: string
  }
}

interface Stats {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  completedOrders: number
}

const statusConfig: Record<string, { label: string; color: string; action: string; nextStatus: string }> = {
  PENDING_PHARMACY_CONFIRMATION: { label: 'New Order', color: 'bg-yellow-100 text-yellow-700', action: 'Accept', nextStatus: 'ACCEPTED' },
  ACCEPTED: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', action: 'Mark Prepared', nextStatus: 'PREPARED' },
  PREPARED: { label: 'Prepared', color: 'bg-green-100 text-green-700', action: 'Ready for Pickup', nextStatus: 'ASSIGNED_TO_RIDER' },
  ASSIGNED_TO_RIDER: { label: 'Waiting Rider', color: 'bg-orange-100 text-orange-700', action: '', nextStatus: '' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700', action: '', nextStatus: '' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', action: '', nextStatus: '' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', action: '', nextStatus: '' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', action: '', nextStatus: '' },
}

export default function PharmacyDashboard() {
  const { user, profile, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [lowStock, setLowStock] = useState<LowStockItem[]>([])
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
    if (!authLoading && user?.role !== 'PHARMACY') {
      router.push('/dashboard')
      return
    }
  }, [authLoading, isAuthenticated, user, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return

      try {
        const [statsData, ordersData, lowStockData] = await Promise.all([
          api.getPharmacyStats(profile.id),
          api.getOrders(undefined, profile.id),
          api.getPharmacyLowStock(profile.id),
        ])

        setStats(statsData)
        
        // Fetch item counts for each order
        const ordersWithCounts = await Promise.all(
          ordersData.map(async (order: Order) => {
            try {
              const items = await api.getOrderItems(order.id)
              return { ...order, itemCount: items.length }
            } catch {
              return { ...order, itemCount: 0 }
            }
          })
        )
        
        setOrders(ordersWithCounts)
        setLowStock(lowStockData)
      } catch (error) {
        console.error('Failed to fetch pharmacy data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    if (profile?.id) {
      fetchData()
    }
  }, [profile?.id])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      // Refresh orders
      const ordersData = await api.getOrders(undefined, profile?.id)
      const ordersWithCounts = await Promise.all(
        ordersData.map(async (order: Order) => {
          try {
            const items = await api.getOrderItems(order.id)
            return { ...order, itemCount: items.length }
          } catch {
            return { ...order, itemCount: 0 }
          }
        })
      )
      setOrders(ordersWithCounts)
      // Refresh stats
      if (profile?.id) {
        const statsData = await api.getPharmacyStats(profile.id)
        setStats(statsData)
      }
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      await api.updateOrderStatus(orderId, 'REJECTED', 'Order rejected by pharmacy')
      // Refresh orders
      const ordersData = await api.getOrders(undefined, profile?.id)
      setOrders(ordersData)
      toast.success('Order rejected')
    } catch (error) {
      toast.error('Failed to reject order')
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return `${Math.floor(diffMins / 1440)} days ago`
  }

  const activeOrders = orders.filter(o => 
    ['PENDING_PHARMACY_CONFIRMATION', 'ACCEPTED', 'PREPARED', 'ASSIGNED_TO_RIDER', 'OUT_FOR_DELIVERY'].includes(o.status)
  )

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/pk-brand-icon-colored.svg"
                alt="PharmaKart"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-xl font-bold">{profile?.name || 'Pharmacy Dashboard'}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Online
              </Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  <p className="text-xs text-muted-foreground">Today's Orders</p>
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
                  <p className="text-2xl font-bold">{formatPrice(stats.todayRevenue)}</p>
                  <p className="text-xs text-muted-foreground">Today's Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedOrders}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
                <CardDescription>Manage incoming and preparing orders</CardDescription>
              </CardHeader>
              <CardContent>
                {activeOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active orders at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeOrders.map((order) => {
                      const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700', action: '', nextStatus: '' }
                      return (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span>
                              <Badge className={status.color}>{status.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.client?.name || 'Customer'} • {order.itemCount || 0} items • {formatTimeAgo(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold">{formatPrice(order.totalAmount)}</p>
                            {status.action && (
                              <div className="flex gap-2">
                                {order.status === 'PENDING_PHARMACY_CONFIRMATION' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleRejectOrder(order.id)}
                                  >
                                    Reject
                                  </Button>
                                )}
                                <Button 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(order.id, status.nextStatus)}
                                >
                                  {status.action}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <Card className={lowStock.length > 0 ? "border-orange-200" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className={`flex items-center gap-2 ${lowStock.length > 0 ? 'text-orange-600' : ''}`}>
                  <AlertCircle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lowStock.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All items are well stocked
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStock.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.medicine?.name || 'Unknown'}</p>
                        </div>
                        <Badge variant="destructive">{item.stockQuantity} left</Badge>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/pharmacy/inventory">
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    <Pill className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/pharmacy/earnings">
                  <Button variant="outline" className="w-full justify-start text-green-600 hover:text-green-700">
                    <Wallet className="h-4 w-4 mr-2" />
                    Earnings & Withdraw
                  </Button>
                </Link>
                <Link href="/pharmacy/inventory/import">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import Inventory
                  </Button>
                </Link>
                <Link href="/pharmacy/inventory/add">
                  <Button variant="outline" className="w-full justify-start">
                    <Pill className="h-4 w-4 mr-2" />
                    Add New Medicine
                  </Button>
                </Link>
                <Link href="/pharmacy/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
