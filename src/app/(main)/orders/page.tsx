'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Search, Loader2, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
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
  pharmacy: {
    id: string
    name: string
  }
  items?: OrderItem[]
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING_PHARMACY_CONFIRMATION: { label: 'Awaiting Confirmation', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  ACCEPTED: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  PREPARED: { label: 'Prepared', color: 'bg-purple-100 text-purple-700', icon: Package },
  ASSIGNED_TO_RIDER: { label: 'Assigned to Rider', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: XCircle },
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return
      
      try {
        const ordersData = await api.getOrders()
        
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
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pharmacy?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'active') return matchesSearch && ['PENDING_PHARMACY_CONFIRMATION', 'ACCEPTED', 'PREPARED', 'ASSIGNED_TO_RIDER', 'OUT_FOR_DELIVERY'].includes(order.status)
    if (activeTab === 'completed') return matchesSearch && order.status === 'DELIVERED'
    if (activeTab === 'cancelled') return matchesSearch && ['CANCELLED', 'REJECTED'].includes(order.status)
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage your orders</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID or pharmacy..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'You haven\'t placed any orders yet'}
              </p>
              <Link href="/search">
                <Button>Browse Medicines</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING
            const StatusIcon = status.icon
            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${status.color}`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</h3>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.pharmacy?.name || 'Unknown Pharmacy'}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.items && order.items.length > 0
                              ? order.items.map(item => `${item.pharmacyMedicine?.medicine?.name || 'Item'} x${item.quantity}`).join(', ')
                              : 'Items loading...'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold">{formatPrice(order.totalAmount)}</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
