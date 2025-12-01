'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'

const categoryInfo: Record<string, { name: string; description: string }> = {
  'pain-fever': { name: 'Pain & Fever', description: 'Medications for pain relief and fever reduction' },
  'cough-cold': { name: 'Cough & Cold', description: 'Treatments for cough, cold, and flu symptoms' },
  'malaria': { name: 'Malaria', description: 'Antimalarial medications and prevention' },
  'hypertension': { name: 'Hypertension', description: 'Blood pressure control medications' },
  'diabetes': { name: 'Diabetes', description: 'Diabetes management and supplies' },
  'baby-children': { name: 'Baby & Children', description: 'Pediatric medicines and care products' },
  'vitamins-supplements': { name: 'Vitamins & Supplements', description: 'Nutritional supplements and vitamins' },
  'antibiotics': { name: 'Antibiotics', description: 'Prescription antibiotic medications' },
  'skin-care': { name: 'Skin Care', description: 'Dermatological treatments and skincare' },
  'eye-care': { name: 'Eye Care', description: 'Eye drops and vision care products' },
  'bone-joint': { name: 'Bone & Joint', description: 'Bone health and joint care supplements' },
  'mental-health': { name: 'Mental Health', description: 'Mental health and wellness medications' },
}

type AvailableMedicine = {
  id: string
  name: string
  genericName: string
  category: string
  categoryId: string
  prescriptionRequired: boolean
  dosage: string
  minPrice: number
  pharmacyCount: number
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [sortBy, setSortBy] = useState('price-low')
  const [isLoading, setIsLoading] = useState(true)
  const [medicines, setMedicines] = useState<AvailableMedicine[]>([])
  
  const category = categoryInfo[slug] || { name: 'Category', description: 'Browse products' }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const allCategories = await api.getCategories()
        const matched = allCategories.find((cat: any) => cat.slug === slug)

        if (!matched) {
          setMedicines([])
          return
        }

        const data = await api.searchAvailableMedicines(undefined, matched.id)
        setMedicines(data)
      } catch (error) {
        console.error('Failed to load category medicines', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  const sortedMedicines = [...medicines].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.minPrice - b.minPrice
      case 'price-high': return b.minPrice - a.minPrice
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/categories" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Categories
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground mt-1">{category.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading products...</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          {sortedMedicines.length} {sortedMedicines.length === 1 ? 'product' : 'products'} found
        </p>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMedicines.map((medicine) => (
          <Link key={medicine.id} href={`/medicine/${medicine.id}`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{medicine.name}</h3>
                    <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                  </div>
                  {medicine.prescriptionRequired && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Rx
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Available in {medicine.pharmacyCount}{' '}
                  {medicine.pharmacyCount === 1 ? 'pharmacy' : 'pharmacies'}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-primary">{formatPrice(medicine.minPrice)}</p>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    In Stock
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
