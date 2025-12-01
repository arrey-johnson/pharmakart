'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Building2, 
  Filter,
  Loader2,
  ChevronRight,
  BadgeCheck
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUBDIVISIONS } from '@/lib/constants'
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
}

const subdivisionLabels: Record<string, string> = {
  DOUALA_I: 'Douala I',
  DOUALA_II: 'Douala II',
  DOUALA_III: 'Douala III',
  DOUALA_IV: 'Douala IV',
  DOUALA_V: 'Douala V',
}

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubdivision, setSelectedSubdivision] = useState<string>('all')

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const data = await api.getPharmacies(true) // only verified
        setPharmacies(data)
      } catch (error) {
        console.error('Failed to fetch pharmacies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPharmacies()
  }, [])

  // Filter pharmacies based on search and subdivision
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = 
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSubdivision = 
      selectedSubdivision === 'all' || pharmacy.subdivision === selectedSubdivision

    return matchesSearch && matchesSubdivision
  })

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Pharmacies</h1>
          <p className="text-primary-foreground/80">
            Find licensed and verified pharmacies near you in Douala
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pharmacies by name or address..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedSubdivision} onValueChange={setSelectedSubdivision}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {SUBDIVISIONS.map((sub) => (
                <SelectItem key={sub.value} value={sub.value}>
                  {sub.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${filteredPharmacies.length} pharmacy${filteredPharmacies.length !== 1 ? 'ies' : ''} found`}
          </p>
        </div>

        {/* Pharmacies Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPharmacies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <Link key={pharmacy.id} href={`/pharmacy/${pharmacy.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Pharmacy Logo/Icon */}
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {pharmacy.logoUrl ? (
                          <img 
                            src={pharmacy.logoUrl} 
                            alt={pharmacy.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-primary" />
                        )}
                      </div>

                      {/* Pharmacy Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">{pharmacy.name}</h3>
                          {pharmacy.isVerified && (
                            <BadgeCheck className="h-5 w-5 text-blue-500 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{pharmacy.address}</span>
                        </div>

                        <Badge variant="secondary" className="mb-3">
                          {subdivisionLabels[pharmacy.subdivision] || pharmacy.subdivision}
                        </Badge>

                        <div className="flex items-center justify-between">
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">
                              {pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : 'New'}
                            </span>
                            {pharmacy.totalReviews > 0 && (
                              <span className="text-sm text-muted-foreground">
                                ({pharmacy.totalReviews})
                              </span>
                            )}
                          </div>

                          {/* Opening Hours */}
                          {pharmacy.openingHours && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{pharmacy.openingHours}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No pharmacies found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedSubdivision !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No verified pharmacies are available at the moment'}
            </p>
            {(searchQuery || selectedSubdivision !== 'all') && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSubdivision('all')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-700 mb-2">Why shop from verified pharmacies?</h3>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• All pharmacies are licensed and verified by health authorities</li>
            <li>• Genuine medicines with proper storage and handling</li>
            <li>• Professional pharmacists available for consultation</li>
            <li>• Fast delivery within 1-2 hours in Douala</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
