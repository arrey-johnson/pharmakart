'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'

interface Medicine {
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

interface Category {
  id: string
  name: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [sortBy, setSortBy] = useState('relevance')
  const [isLoading, setIsLoading] = useState(true)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [otcOnly, setOtcOnly] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true)
      try {
        const data = await api.searchAvailableMedicines(query || undefined, categoryParam || undefined)
        let filtered = data

        // Apply local filters
        if (selectedCategories.length > 0) {
          filtered = filtered.filter(m => selectedCategories.includes(m.categoryId))
        }

        if (otcOnly) {
          filtered = filtered.filter(m => !m.prescriptionRequired)
        }

        // Apply sorting
        if (sortBy === 'price-low') {
          filtered.sort((a, b) => a.minPrice - b.minPrice)
        } else if (sortBy === 'price-high') {
          filtered.sort((a, b) => b.minPrice - a.minPrice)
        } else if (sortBy === 'name') {
          filtered.sort((a, b) => a.name.localeCompare(b.name))
        }

        setMedicines(filtered)
      } catch (error) {
        console.error('Failed to fetch medicines:', error)
        setMedicines([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicines()
  }, [query, categoryParam, sortBy, selectedCategories, otcOnly])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    router.push(`/search?${params.toString()}`)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search medicines..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Prescription</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={otcOnly}
                        onChange={(e) => setOtcOnly(e.target.checked)}
                      />
                      <span className="text-sm">Over-the-counter only</span>
                    </label>
                  </div>
                </div>
                {(selectedCategories.length > 0 || otcOnly) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCategories([])
                      setOtcOnly(false)
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {query && (
            <h1 className="text-xl font-semibold">
              Results for &quot;{query}&quot;
            </h1>
          )}
          <p className="text-sm text-muted-foreground">
            {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {(query || categoryParam || selectedCategories.length > 0 || otcOnly) && (
          <Link href="/search">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => {
                setSelectedCategories([])
                setOtcOnly(false)
                setSearchQuery('')
              }}
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          </Link>
        )}
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {medicines.map((medicine) => (
            <Link key={medicine.id} href={`/medicine/${medicine.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Pill className="h-12 w-12 text-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm line-clamp-2">{medicine.name}</h3>
                      {medicine.prescriptionRequired && (
                        <Badge variant="secondary" className="text-xs shrink-0">Rx</Badge>
                      )}
                    </div>
                    {medicine.genericName && (
                      <p className="text-xs text-muted-foreground">{medicine.genericName}</p>
                    )}
                    {medicine.category && (
                      <Badge variant="outline" className="text-xs">{medicine.category}</Badge>
                    )}
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        From <span className="font-semibold text-primary">{formatPrice(medicine.minPrice)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Available at {medicine.pharmacyCount} {medicine.pharmacyCount === 1 ? 'pharmacy' : 'pharmacies'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No medicines found</p>
          <p className="text-sm text-muted-foreground mb-4">
            {query ? 'Try a different search term or browse all medicines' : 'No medicines are currently available from pharmacies'}
          </p>
          {query && (
            <Link href="/search">
              <Button variant="outline">Browse all medicines</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-full max-w-xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
