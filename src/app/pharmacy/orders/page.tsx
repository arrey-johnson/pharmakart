'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Loader2, Search, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  pharmacyMedicine: {
    medicine: {
      name: string
    }
  }
}

interface Order {
  id: string
  createdAt: string
  status: string
  totalAmount: number
  deliveryAddress: string
  clientPhone: string
  client: {
    name: string
    email: string
  }
  items?: OrderItem[]
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING_PHARMACY_CONFIRMATION: { label: 'New Order', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  ACCEPTED: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  PREPARED: { label: 'Prepared', color: 'bg-green-100 text-green-700', icon: Package },
  ASSIGNED_TO_RIDER: { label: 'Waiting Rider', color: 'bg-orange-100 text-orange-700', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: XCircle },
}

export default function PharmacyOrdersPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

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
    const fetchOrders = async () => {
      if (!profile?.id) return

      try {
        const ordersData = await api.getOrders(undefined, profile.id)
        
        // Fetch items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order: Order) => {
            try {
              const items = await api.getOrderItems(order.id)
              return { ...order, items }
            } catch {
              return { ...order, items: [] }
            }
          })
        )
        
        setOrders(ordersWithItems)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }

    if (profile?.id) {
      fetchOrders()
    }
  }, [profile?.id])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus)
      // Refresh orders
      const ordersData = await api.getOrders(undefined, profile?.id)
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order: Order) => {
          try {
            const items = await api.getOrderItems(order.id)
            return { ...order, items }
          } catch {
            return { ...order, items: [] }
          }
        })
      )
      setOrders(ordersWithItems)
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'pending') return matchesSearch && order.status === 'PENDING_PHARMACY_CONFIRMATION'
    if (activeTab === 'active') return matchesSearch && ['ACCEPTED', 'PREPARED', 'ASSIGNED_TO_RIDER', 'OUT_FOR_DELIVERY'].includes(order.status)
    if (activeTab === 'completed') return matchesSearch && order.status === 'DELIVERED'
    return matchesSearch
  })

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
          <div className="flex items-center gap-4">
            <Link href="/pharmacy">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">All Orders</h1>
              <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'No orders yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700', icon: Package }
              const StatusIcon = status.icon
              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-2 rounded-full ${status.color}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <p><strong>Customer:</strong> {order.client?.name || 'Unknown'}</p>
                          <p><strong>Phone:</strong> {order.clientPhone}</p>
                          <p><strong>Address:</strong> {order.deliveryAddress}</p>
                          <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Items:</p>
                          <div className="text-sm text-muted-foreground">
                            {order.items?.map((item, idx) => (
                              <span key={item.id}>
                                {item.pharmacyMedicine?.medicine?.name} x{item.quantity}
                                {idx < (order.items?.length || 0) - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <p className="text-xl font-bold">{formatPrice(order.totalAmount)}</p>
                        
                        {order.status === 'PENDING_PHARMACY_CONFIRMATION' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleUpdateStatus(order.id, 'REJECTED')}
                            >
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                            >
                              Accept
                            </Button>
                          </div>
                        )}
                        
                        {order.status === 'ACCEPTED' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'PREPARED')}
                          >
                            Mark as Prepared
                          </Button>
                        )}
                        
                        {order.status === 'PREPARED' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'ASSIGNED_TO_RIDER')}
                          >
                            Ready for Pickup
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
