'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Loader2, Plus, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface Medicine {
  id: string
  name: string
  genericName: string
  manufacturer: string
  dosageForm: string
  strength: string
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
}

export default function AddMedicinePage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [activeTab, setActiveTab] = useState('existing')

  // New medicine form state
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    genericName: '',
    categoryId: '',
    description: '',
    dosage: '',
    packaging: '',
    prescriptionRequired: false,
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
        const [medicinesData, categoriesData] = await Promise.all([
          api.getMedicines(),
          api.getCategories(),
        ])
        let finalCategories = categoriesData
        if (!finalCategories || finalCategories.length === 0) {
          try {
            await api.seedCategories()
            finalCategories = await api.getCategories()
          } catch (seedError) {
            console.error('Failed to seed categories:', seedError)
          }
        }

        setMedicines(medicinesData)
        setCategories(finalCategories)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddExistingMedicine = async () => {
    if (!selectedMedicine || !profile?.id) return
    if (!price || !stockQuantity) {
      toast.error('Please fill in all fields')
      return
    }

    setIsAdding(true)
    try {
      await api.addPharmacyMedicine(profile.id, {
        medicineId: selectedMedicine.id,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
      })
      toast.success('Medicine added to inventory')
      router.push('/pharmacy/inventory')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add medicine')
    } finally {
      setIsAdding(false)
    }
  }

  const handleCreateNewMedicine = async () => {
    if (!profile?.id) return
    if (!newMedicine.name || !price || !stockQuantity) {
      toast.error('Please fill in required fields (name, price, stock)')
      return
    }

    setIsAdding(true)
    try {
      await api.createMedicineAndAdd(profile.id, {
        medicine: {
          name: newMedicine.name,
          genericName: newMedicine.genericName || undefined,
          categoryId: newMedicine.categoryId || undefined,
          description: newMedicine.description || undefined,
          dosage: newMedicine.dosage || undefined,
          packaging: newMedicine.packaging || undefined,
          prescriptionRequired: newMedicine.prescriptionRequired,
        },
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
      })
      toast.success('Medicine created and added to inventory')
      router.push('/pharmacy/inventory')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create medicine')
    } finally {
      setIsAdding(false)
    }
  }

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/pharmacy/inventory">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Add Medicine to Inventory</h1>
              <p className="text-sm text-muted-foreground">Select existing or create a new medicine</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Select Existing</TabsTrigger>
            <TabsTrigger value="new">Add New Medicine</TabsTrigger>
          </TabsList>

          {/* Existing Medicine Tab */}
          <TabsContent value="existing">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Medicine Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Medicine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medicines..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {filteredMedicines.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">
                        No medicines found. Try adding a new one.
                      </p>
                    ) : (
                      filteredMedicines.map((med) => (
                        <div
                          key={med.id}
                          onClick={() => setSelectedMedicine(med)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedMedicine?.id === med.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {med.genericName} {med.strength && `• ${med.strength}`}
                              </p>
                            </div>
                            {selectedMedicine?.id === med.id && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Set Price & Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMedicine ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold">{selectedMedicine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedMedicine.genericName} {selectedMedicine.strength && `• ${selectedMedicine.strength}`}
                        </p>
                        {selectedMedicine.category && (
                          <Badge variant="outline" className="mt-2">
                            {selectedMedicine.category.name}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (XAF) *</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="e.g., 2500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock Quantity *</Label>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="e.g., 50"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleAddExistingMedicine}
                        disabled={isAdding || !price || !stockQuantity}
                        className="w-full"
                      >
                        {isAdding ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Inventory
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Select a medicine from the list to set its price and stock</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* New Medicine Tab */}
          <TabsContent value="new">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Medicine Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medicine Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Paracetamol 500mg"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genericName">Generic Name</Label>
                    <Input
                      id="genericName"
                      placeholder="e.g., Acetaminophen"
                      value={newMedicine.genericName}
                      onChange={(e) => setNewMedicine({ ...newMedicine, genericName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newMedicine.categoryId}
                      onValueChange={(value) => setNewMedicine({ ...newMedicine, categoryId: value })}
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
                      value={newMedicine.dosage}
                      onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packaging">Packaging</Label>
                    <Input
                      id="packaging"
                      placeholder="e.g., Box of 20 tablets"
                      value={newMedicine.packaging}
                      onChange={(e) => setNewMedicine({ ...newMedicine, packaging: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the medicine..."
                      value={newMedicine.description}
                      onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prescriptionRequired"
                      checked={newMedicine.prescriptionRequired}
                      onCheckedChange={(checked: boolean) => 
                        setNewMedicine({ ...newMedicine, prescriptionRequired: checked })
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
                  <CardTitle>Price & Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPrice">Price (XAF) *</Label>
                      <Input
                        id="newPrice"
                        type="number"
                        placeholder="e.g., 2500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newStock">Stock Quantity *</Label>
                      <Input
                        id="newStock"
                        type="number"
                        placeholder="e.g., 50"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateNewMedicine}
                    disabled={isAdding || !newMedicine.name || !price || !stockQuantity}
                    className="w-full"
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create & Add to Inventory
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Required fields
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
