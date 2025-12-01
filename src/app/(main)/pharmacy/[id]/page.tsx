'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Star, 
  Building2, 
  Loader2,
  BadgeCheck,
  Pill,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'

interface Pharmacy {
  id: string
  name: string
  logoUrl?: string
  address: string
  subdivision: string
  latitude?: number
  longitude?: number
  openingHours?: string
  isVerified: boolean
  rating: number
  totalReviews: number
  user?: {
    phone?: string
  }
}

interface InventoryItem {
  id: string
  price: number
  stockQuantity: number
  medicine: {
    id: string
    name: string
    genericName?: string
    dosage?: string
    packaging?: string
    prescriptionRequired: boolean
    category?: {
      name: string
    }
  }
}

const subdivisionLabels: Record<string, string> = {
  DOUALA_I: 'Douala I',
  DOUALA_II: 'Douala II',
  DOUALA_III: 'Douala III',
  DOUALA_IV: 'Douala IV',
  DOUALA_V: 'Douala V',
}

export default function PharmacyDetailPage() {
  const params = useParams()
  const pharmacyId = params.id as string

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pharmacyData, inventoryData] = await Promise.all([
          api.getPharmacy(pharmacyId),
          api.getPharmacyInventory(pharmacyId),
        ])
        setPharmacy(pharmacyData)
        setInventory(inventoryData.filter((item: InventoryItem) => item.stockQuantity > 0))
      } catch (error) {
        console.error('Failed to fetch pharmacy:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (pharmacyId) {
      fetchData()
    }
  }, [pharmacyId])

  const filteredInventory = inventory.filter(item =>
    item.medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.medicine.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Pharmacy not found</h2>
        <Link href="/pharmacies">
          <Button>Browse Pharmacies</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/pharmacies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Pharmacies
          </Link>
          
          <div className="flex items-start gap-6">
            {/* Pharmacy Logo */}
            <div className="w-20 h-20 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              {pharmacy.logoUrl ? (
                <img 
                  src={pharmacy.logoUrl} 
                  alt={pharmacy.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 className="h-10 w-10 text-white" />
              )}
            </div>

            {/* Pharmacy Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{pharmacy.name}</h1>
                {pharmacy.isVerified && (
                  <BadgeCheck className="h-6 w-6 text-blue-300" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{pharmacy.address}</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {subdivisionLabels[pharmacy.subdivision] || pharmacy.subdivision}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-white/80">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">
                    {pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : 'New'}
                  </span>
                  {pharmacy.totalReviews > 0 && (
                    <span>({pharmacy.totalReviews} reviews)</span>
                  )}
                </div>

                {/* Opening Hours */}
                {pharmacy.openingHours && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{pharmacy.openingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search medicines in this pharmacy..."
            className="max-w-md bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Inventory Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Available Medicines</h2>
          <p className="text-sm text-muted-foreground">
            {filteredInventory.length} medicine{filteredInventory.length !== 1 ? 's' : ''} in stock
          </p>
        </div>

        {/* Medicines Grid */}
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInventory.map((item) => (
              <Link key={item.id} href={`/medicine/${item.medicine.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full">
                      {/* Medicine Icon */}
                      <div className="w-full aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <Pill className="h-12 w-12 text-primary/50" />
                      </div>

                      {/* Medicine Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-sm line-clamp-2">{item.medicine.name}</h3>
                          {item.medicine.prescriptionRequired && (
                            <Badge variant="secondary" className="text-xs shrink-0">Rx</Badge>
                          )}
                        </div>

                        {item.medicine.genericName && (
                          <p className="text-xs text-muted-foreground mb-1">{item.medicine.genericName}</p>
                        )}

                        {item.medicine.category?.name && (
                          <Badge variant="outline" className="text-xs mb-2">{item.medicine.category.name}</Badge>
                        )}

                        {(item.medicine.dosage || item.medicine.packaging) && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {[item.medicine.dosage, item.medicine.packaging].filter(Boolean).join(' • ')}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="pt-3 border-t mt-auto">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.stockQuantity} in stock
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Pill className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try a different search term'
                : 'This pharmacy has no medicines in stock'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
