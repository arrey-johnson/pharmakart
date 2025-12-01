'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Plus, Search, Loader2, Edit, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface InventoryItem {
  id: string
  price: number
  stockQuantity: number
  isActive: boolean
  medicine: {
    id: string
    name: string
    genericName: string
    manufacturer: string
    dosageForm: string
    strength: string
    category: {
      name: string
    }
  }
}

export default function PharmacyInventoryPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

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
    const fetchInventory = async () => {
      if (!profile?.id) return

      try {
        const data = await api.getPharmacyInventory(profile.id)
        setInventory(data)
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
        toast.error('Failed to load inventory')
      } finally {
        setIsLoading(false)
      }
    }

    if (profile?.id) {
      fetchInventory()
    }
  }, [profile?.id])

  const filteredInventory = inventory.filter(item =>
    item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.medicine.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Link href="/pharmacy">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Inventory Management</h1>
                <p className="text-sm text-muted-foreground">{inventory.length} products</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/pharmacy/inventory/import">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
              </Link>
              <Link href="/pharmacy/inventory/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medicine
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Inventory List */}
        {filteredInventory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                {searchQuery ? 'No medicines found' : 'No medicines in inventory'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Add your medicines to start selling on PharmaKart'}
              </p>
              {!searchQuery && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/pharmacy/inventory/import">
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import (Recommended)
                    </Button>
                  </Link>
                  <Link href="/pharmacy/inventory/add">
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add One by One
                    </Button>
                  </Link>
                </div>
              )}
              {searchQuery && (
                <Link href="/pharmacy/inventory/add">
                  <Button>Add Medicine</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredInventory.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.medicine.name}</h3>
                        {item.medicine.category?.name && (
                          <Badge variant="outline">{item.medicine.category.name}</Badge>
                        )}
                        {item.stockQuantity <= 10 && (
                          <Badge variant="destructive">Low Stock</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.medicine.genericName && `${item.medicine.genericName} • `}
                        {item.medicine.strength && `${item.medicine.strength} • `}
                        {item.medicine.dosageForm || 'N/A'}
                      </p>
                      {item.medicine.manufacturer && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.medicine.manufacturer}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatPrice(item.price)}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {item.stockQuantity}
                        </p>
                      </div>
                      <Link href={`/pharmacy/inventory/${item.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
