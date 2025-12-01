'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
}

interface InventoryItem {
  id: string
  price: number
  stockQuantity: number
  medicine: {
    id: string
    name: string
    genericName?: string
    description?: string
    dosage?: string
    packaging?: string
    prescriptionRequired: boolean
    categoryId?: string
    category?: {
      id: string
      name: string
    }
  }
}

export default function EditInventoryPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [item, setItem] = useState<InventoryItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    categoryId: '',
    description: '',
    dosage: '',
    packaging: '',
    prescriptionRequired: false,
    price: '',
    stockQuantity: '',
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
      try {
        const [itemData, categoriesData] = await Promise.all([
          api.getInventoryItem(itemId),
          api.getCategories(),
        ])

        if (!itemData) {
          toast.error('Item not found')
          router.push('/pharmacy/inventory')
          return
        }

        let finalCategories = categoriesData
        if (!finalCategories || finalCategories.length === 0) {
          try {
            await api.seedCategories()
            finalCategories = await api.getCategories()
          } catch (seedError) {
            console.error('Failed to seed categories:', seedError)
          }
        }

        setItem(itemData)
        setCategories(finalCategories)

        // Populate form
        setFormData({
          name: itemData.medicine.name || '',
          genericName: itemData.medicine.genericName || '',
          categoryId: itemData.medicine.categoryId || itemData.medicine.category?.id || '',
          description: itemData.medicine.description || '',
          dosage: itemData.medicine.dosage || '',
          packaging: itemData.medicine.packaging || '',
          prescriptionRequired: itemData.medicine.prescriptionRequired || false,
          price: itemData.price?.toString() || '',
          stockQuantity: itemData.stockQuantity?.toString() || '',
        })
      } catch (error) {
        console.error('Failed to fetch item:', error)
        toast.error('Failed to load item')
        router.push('/pharmacy/inventory')
      } finally {
        setIsLoading(false)
      }
    }

    if (itemId) {
      fetchData()
    }
  }, [itemId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.stockQuantity) {
      toast.error('Please fill in required fields (name, price, stock)')
      return
    }

    setIsSaving(true)
    try {
      await api.updateInventoryItem(itemId, {
        medicine: {
          name: formData.name,
          genericName: formData.genericName || undefined,
          categoryId: formData.categoryId || undefined,
          description: formData.description || undefined,
          dosage: formData.dosage || undefined,
          packaging: formData.packaging || undefined,
          prescriptionRequired: formData.prescriptionRequired,
        },
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      })

      toast.success('Medicine updated successfully')
      router.push('/pharmacy/inventory')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update medicine')
    } finally {
      setIsSaving(false)
    }
  }

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
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/pharmacy/inventory">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Edit Medicine</h1>
              <p className="text-sm text-muted-foreground">Update medicine details and pricing</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medicine Details */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Paracetamol 500mg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genericName">Generic Name</Label>
                  <Input
                    id="genericName"
                    placeholder="e.g., Acetaminophen"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage / Strength</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg, 10ml"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packaging">Packaging</Label>
                <Input
                  id="packaging"
                  placeholder="e.g., Box of 20 tablets"
                  value={formData.packaging}
                  onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the medicine, usage instructions, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, prescriptionRequired: checked })
                  }
                />
                <Label htmlFor="prescriptionRequired" className="text-sm font-normal">
                  Requires prescription
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (XAF) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 2500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/pharmacy/inventory" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
