'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, ShoppingCart, FileText, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface MedicineDetail {
  id: string
  name: string
  genericName?: string
  description?: string
  dosage?: string
  packaging?: string
  imageUrl?: string
  prescriptionRequired: boolean
  category?: {
    id: string
    name: string
  }
}

interface PharmacyOffer {
  id: string
  price: number
  stockQuantity: number
  pharmacy: {
    id: string
    name: string
    address: string
    subdivision: string
    rating: number
    totalReviews: number
  }
}

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [medicine, setMedicine] = useState<MedicineDetail | null>(null)
  const [offers, setOffers] = useState<PharmacyOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [medicineData, offersData] = await Promise.all([
          api.getMedicine(id),
          api.getMedicineOffers(id),
        ])
        setMedicine(medicineData)
        setOffers(offersData)
        if (offersData.length > 0) {
          setSelectedOffer(offersData[0].id)
        }
      } catch (error: any) {
        console.error('Failed to load medicine details', error)
        toast.error(error.message || 'Failed to load medicine')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleAddToCart = (offer: PharmacyOffer) => {
    if (!medicine) return
    addItem({
      pharmacy_medicine_id: offer.id,
      pharmacy_id: offer.pharmacy.id,
      medicine_id: medicine.id,
      medicine_name: medicine.name,
      pharmacy_name: offer.pharmacy.name,
      price: offer.price,
      quantity,
      image_url: medicine.imageUrl ?? null,
      prescription_required: medicine.prescriptionRequired,
    })
    toast.success(`Added ${medicine.name} to cart`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>

      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !medicine ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This medicine could not be found.</p>
          <Link href="/search">
            <Button variant="outline">Back to search</Button>
          </Link>
        </div>
      ) : (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product Image */}
            <div className="w-full sm:w-48 h-48 bg-muted rounded-xl flex items-center justify-center shrink-0">
              <span className="text-6xl">💊</span>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <h1 className="text-2xl font-bold">{medicine.name}</h1>
                {medicine.prescriptionRequired && (
                  <Badge variant="secondary">Prescription Required</Badge>
                )}
              </div>
              {medicine.genericName && (
                <p className="text-muted-foreground">{medicine.genericName}</p>
              )}
              {medicine.category && (
                <Badge variant="outline">{medicine.category.name}</Badge>
              )}
              
              <div className="pt-2">
                {medicine.dosage && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Dosage:</strong> {medicine.dosage}
                  </p>
                )}
                {medicine.packaging && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Packaging:</strong> {medicine.packaging}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground">
                {medicine.description || 'No description available for this medicine.'}
              </p>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Disclaimer:</strong> This information is for reference only. Always consult a healthcare professional before taking any medication.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Upload Notice */}
          {medicine.prescriptionRequired && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4 flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-primary">Prescription Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This medicine requires a valid prescription. You can upload your prescription during checkout or beforehand.
                  </p>
                  <Link href="/upload-prescription">
                    <Button variant="link" className="px-0 mt-2">
                      Upload prescription now
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pharmacy Offers - Sidebar */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">
            {offers.length > 0
              ? `Available at ${offers.length} ${offers.length === 1 ? 'Pharmacy' : 'Pharmacies'}`
              : 'No pharmacies currently have this medicine in stock'}
          </h2>
          
          <div className="space-y-3">
            {offers.map((offer) => (
              <Card 
                key={offer.id} 
                className={`cursor-pointer transition-all ${selectedOffer === offer.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => setSelectedOffer(offer.id)}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Pharmacy Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/pharmacy/${offer.pharmacy.id}`} className="font-medium hover:text-primary">
                        {offer.pharmacy.name}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {offer.pharmacy.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {Number(offer.pharmacy.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Price & Delivery */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-primary">{formatPrice(offer.price)}</p>
                      {/* Delivery fee / ETA to be calculated later */}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Delivery time shown at checkout
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {offer.stockQuantity > 10 ? 'In Stock' : `Only ${offer.stockQuantity} left`}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart */}
                  {selectedOffer === offer.id && (
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Quantity:</span>
                        <div className="flex items-center border rounded-lg">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                          >
                            -
                          </Button>
                          <span className="px-3 text-sm font-medium">{quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button 
                        className="w-full gap-2" 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(offer); }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart - {formatPrice(offer.price * quantity)}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Prices may vary. Delivery fees depend on your location.
          </p>
        </div>
      </div>
      )}
    </div>
  )
}
