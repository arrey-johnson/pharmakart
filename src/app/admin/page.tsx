'use client'

import { useState, useEffect } from 'react'
import { Users, Store, Package, DollarSign, TrendingUp, Bike, AlertCircle, Settings, BarChart3, Loader2, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface AdminStats {
  totalUsers: number
  totalPharmacies: number
  totalRiders: number
  totalOrders: number
  monthlyRevenue: number
  pendingVerifications: number
}

interface AdminRecentOrder {
  id: string
  customerName: string
  pharmacyName: string
  total: number
  status: string
  createdAt: string
}

interface AdminPendingVerification {
  id: string
  type: 'PHARMACY' | 'RIDER'
  name: string
  createdAt: string
}

interface AdminOverview {
  stats: AdminStats
  recentOrders: AdminRecentOrder[]
  pendingVerifications: AdminPendingVerification[]
}

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [pharmacies, setPharmacies] = useState<any[]>([])
  const [riders, setRiders] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, user, router])

  const loadData = async () => {
    if (!user || user.role !== 'ADMIN') return
    try {
      setIsDataLoading(true)
      const [overviewData, usersData, pharmaciesData, ridersData, ordersData] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminPharmacies(),
        api.getAdminRiders(),
        api.getAdminOrders(),
      ])
      setOverview(overviewData)
      setUsers(usersData)
      setPharmacies(pharmaciesData)
      setRiders(ridersData)
      setOrders(ordersData)
    } catch (error: any) {
      console.error('Failed to load admin data:', error)
      toast.error(error.message || 'Failed to load admin data')
    } finally {
      setIsDataLoading(false)
    }
  }

  const handleReview = async (item: AdminPendingVerification) => {
    try {
      if (item.type === 'PHARMACY') {
        await api.verifyPharmacy(item.id)
        toast.success('Pharmacy verified successfully')
      } else {
        await api.verifyRider(item.id)
        toast.success('Rider verified successfully')
      }
      await loadData()
    } catch (error: any) {
      console.error('Failed to verify item:', error)
      toast.error(error.message || 'Failed to verify')
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      loadData()
    }
  }, [isAuthenticated, user])

  if (isLoading || !user || user.role !== 'ADMIN') {
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
            <div>
              <h1 className="text-xl font-bold text-primary">PharmaKart</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              {overview?.stats.pendingVerifications && overview.stats.pendingVerifications > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {overview.stats.pendingVerifications} Pending
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-1 text-muted-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(overview?.stats.totalUsers ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Store className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overview?.stats.totalPharmacies ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Pharmacies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <Bike className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overview?.stats.totalRiders ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Riders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(overview?.stats.totalOrders ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(overview?.stats.monthlyRevenue ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
            <TabsTrigger value="riders">Riders</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders across all pharmacies</CardDescription>
                </CardHeader>
                <CardContent>
                  {isDataLoading && !overview ? (
                    <p className="text-muted-foreground text-center py-8">Loading recent orders...</p>
                  ) : overview && overview.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {overview.recentOrders.map((order) => {
                        const label = ORDER_STATUS_LABELS[order.status] || order.status
                        const color = ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                        return (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{order.id}</span>
                                <Badge className={color}>{label}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.customerName} → {order.pharmacyName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <p className="font-bold">{formatPrice(order.total)}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No recent orders</p>
                  )}
                  <Button variant="outline" className="w-full mt-4">View All Orders</Button>
                </CardContent>
              </Card>

              {/* Pending Verifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Pending Verifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isDataLoading && !overview ? (
                    <p className="text-muted-foreground text-center py-8">Loading pending verifications...</p>
                  ) : overview && overview.pendingVerifications.length > 0 ? (
                    <div className="space-y-4">
                      {overview.pendingVerifications.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleReview(item)}>Review</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No pending verifications</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading && users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users found</p>
                ) : (
                  <div className="space-y-3 text-sm">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{u.name || u.email}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs mb-1">{u.role}</Badge>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacies">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Management</CardTitle>
                <CardDescription>Manage registered pharmacies</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading && pharmacies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Loading pharmacies...</p>
                ) : pharmacies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pharmacies found</p>
                ) : (
                  <div className="space-y-3 text-sm">
                    {pharmacies.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.address}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={p.isVerified ? 'default' : 'outline'} className="text-xs mb-1">
                            {p.isVerified ? 'Verified' : 'Pending'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="riders">
            <Card>
              <CardHeader>
                <CardTitle>Rider Management</CardTitle>
                <CardDescription>Manage delivery riders</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading && riders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Loading riders...</p>
                ) : riders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No riders found</p>
                ) : (
                  <div className="space-y-3 text-sm">
                    {riders.map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{r.user?.name || 'Unnamed Rider'}</p>
                          <p className="text-xs text-muted-foreground">{r.user?.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Vehicle: {r.vehicleType || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={r.isVerified ? 'default' : 'outline'} className="text-xs mb-1">
                            {r.isVerified ? 'Verified' : 'Pending'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mb-1">
                            Deliveries: {r.totalDeliveries ?? 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage all orders</CardDescription>
              </CardHeader>
              <CardContent>
                {isDataLoading && orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders found</p>
                ) : (
                  <div className="space-y-3 text-sm">
                    {orders.map((o) => {
                      const label = ORDER_STATUS_LABELS[o.status] || o.status
                      const color = ORDER_STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-800'
                      return (
                        <div key={o.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{o.id}</p>
                              <Badge className={color}>{label}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {o.client?.name || 'Unknown client'} → {o.pharmacy?.name || 'Unknown pharmacy'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(o.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(Number(o.totalAmount ?? 0))}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
