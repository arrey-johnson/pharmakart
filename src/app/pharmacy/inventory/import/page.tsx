'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Download, FileSpreadsheet, Loader2, Check, X, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface ImportRow {
  name: string
  genericName?: string
  category?: string
  dosage?: string
  packaging?: string
  price: number
  stock: number
  status: 'pending' | 'success' | 'error'
  error?: string
}

export default function ImportInventoryPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importData, setImportData] = useState<ImportRow[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

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
    const fetchCategories = async () => {
      try {
        let data = await api.getCategories()
        if (!data || data.length === 0) {
          try {
            await api.seedCategories()
            data = await api.getCategories()
          } catch (seedError) {
            console.error('Failed to seed categories:', seedError)
          }
        }
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const downloadTemplate = () => {
    const headers = ['Medicine Name', 'Generic Name', 'Category', 'Dosage/Strength', 'Packaging', 'Price (XAF)', 'Stock Quantity']
    const sampleData = [
      ['Paracetamol 500mg', 'Acetaminophen', 'Pain Relief', '500mg', 'Box of 20 tablets', '1500', '100'],
      ['Amoxicillin 500mg', 'Amoxicillin', 'Antibiotics', '500mg', 'Box of 12 capsules', '3500', '50'],
      ['Vitamin C 1000mg', 'Ascorbic Acid', 'Vitamins', '1000mg', 'Bottle of 30 tablets', '5000', '75'],
      ['Ibuprofen 400mg', 'Ibuprofen', 'Pain Relief', '400mg', 'Box of 10 tablets', '2000', '80'],
      ['Omeprazole 20mg', 'Omeprazole', 'Digestive Health', '20mg', 'Box of 14 capsules', '4500', '40'],
    ]
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'pharmakart_inventory_template.csv'
    link.click()
  }

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    // Skip header row
    const dataRows = lines.slice(1)
    
    return dataRows.map(line => {
      // Handle CSV with potential commas in quoted fields
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      const [name, genericName, category, dosage, packaging, priceStr, stockStr] = values
      
      return {
        name: name || '',
        genericName: genericName || undefined,
        category: category || undefined,
        dosage: dosage || undefined,
        packaging: packaging || undefined,
        price: parseFloat(priceStr) || 0,
        stock: parseInt(stockStr) || 0,
        status: 'pending' as const,
      }
    }).filter(row => row.name && row.price > 0 && row.stock >= 0)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      
      if (parsed.length === 0) {
        toast.error('No valid data found in file. Please check the format.')
        setIsLoading(false)
        return
      }
      
      setImportData(parsed)
      setIsLoading(false)
      toast.success(`Found ${parsed.length} medicines to import`)
    }
    
    reader.onerror = () => {
      toast.error('Failed to read file')
      setIsLoading(false)
    }
    
    reader.readAsText(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.csv')) {
      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        handleFileUpload({ target: input } as React.ChangeEvent<HTMLInputElement>)
      }
    } else {
      toast.error('Please upload a CSV file')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const findCategoryId = (categoryName?: string): string | undefined => {
    if (!categoryName) return undefined
    const found = categories.find(c => 
      c.name.toLowerCase() === categoryName.toLowerCase()
    )
    return found?.id
  }

  const startImport = async () => {
    if (!profile?.id || importData.length === 0) return
    
    setIsImporting(true)
    setImportProgress(0)
    
    const updatedData = [...importData]
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < updatedData.length; i++) {
      const row = updatedData[i]
      
      try {
        await api.createMedicineAndAdd(profile.id, {
          medicine: {
            name: row.name,
            genericName: row.genericName,
            categoryId: findCategoryId(row.category),
            dosage: row.dosage,
            packaging: row.packaging,
          },
          price: row.price,
          stockQuantity: row.stock,
        })
        
        updatedData[i] = { ...row, status: 'success' }
        successCount++
      } catch (error: any) {
        updatedData[i] = { 
          ...row, 
          status: 'error', 
          error: error.message || 'Failed to import' 
        }
        errorCount++
      }
      
      setImportData([...updatedData])
      setImportProgress(Math.round(((i + 1) / updatedData.length) * 100))
      
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setIsImporting(false)
    
    if (errorCount === 0) {
      toast.success(`Successfully imported ${successCount} medicines!`)
    } else {
      toast.warning(`Imported ${successCount} medicines, ${errorCount} failed`)
    }
  }

  const clearData = () => {
    setImportData([])
    setImportProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeRow = (index: number) => {
    setImportData(prev => prev.filter((_, i) => i !== index))
  }

  const successCount = importData.filter(r => r.status === 'success').length
  const errorCount = importData.filter(r => r.status === 'error').length
  const pendingCount = importData.filter(r => r.status === 'pending').length

  if (authLoading) {
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
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/pharmacy/inventory">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Bulk Import Inventory</h1>
                <p className="text-sm text-muted-foreground">Upload your inventory from a CSV file</p>
              </div>
            </div>
            {successCount > 0 && pendingCount === 0 && (
              <Link href="/pharmacy/inventory">
                <Button>View Inventory</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              How to Import Your Inventory
            </CardTitle>
            <CardDescription>
              Import your entire inventory in minutes instead of adding medicines one by one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                  <span className="font-medium">Download Template</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get our CSV template with the correct column format
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                  <span className="font-medium">Fill Your Data</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add your medicines with prices and stock quantities
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                  <span className="font-medium">Upload & Import</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload the file and we'll add everything automatically
                </p>
              </div>
            </div>
            
            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Your File</CardTitle>
            <CardDescription>
              Select a CSV file with your inventory data (Medicine Name, Generic Name, Category, Dosage, Packaging, Price, Stock)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {importData.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium text-lg">Click to upload CSV file</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or drag and drop your file here
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Supported format: .csv (Comma Separated Values)
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Progress Bar */}
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importing medicines...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Summary */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{importData.length} medicines found in file</p>
                    <div className="flex flex-wrap gap-3 text-sm mt-1">
                      {pendingCount > 0 && (
                        <span className="text-muted-foreground">⏳ {pendingCount} pending</span>
                      )}
                      {successCount > 0 && (
                        <span className="text-green-600">✓ {successCount} imported</span>
                      )}
                      {errorCount > 0 && (
                        <span className="text-red-600">✗ {errorCount} failed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearData} disabled={isImporting}>
                      Clear All
                    </Button>
                    {pendingCount > 0 && (
                      <Button size="sm" onClick={startImport} disabled={isImporting}>
                        {isImporting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Start Import
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Data Preview Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[400px] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-medium">Medicine Name</th>
                          <th className="text-left p-3 font-medium hidden sm:table-cell">Category</th>
                          <th className="text-right p-3 font-medium">Price</th>
                          <th className="text-right p-3 font-medium">Stock</th>
                          <th className="text-center p-3 font-medium w-24">Status</th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {importData.map((row, index) => (
                          <tr key={index} className="border-t hover:bg-muted/20">
                            <td className="p-3">
                              <p className="font-medium">{row.name}</p>
                              {row.genericName && (
                                <p className="text-xs text-muted-foreground">{row.genericName}</p>
                              )}
                              {row.dosage && (
                                <p className="text-xs text-muted-foreground">{row.dosage}</p>
                              )}
                            </td>
                            <td className="p-3 text-muted-foreground hidden sm:table-cell">
                              {row.category || '-'}
                            </td>
                            <td className="p-3 text-right font-medium">
                              {row.price.toLocaleString()} XAF
                            </td>
                            <td className="p-3 text-right">{row.stock}</td>
                            <td className="p-3 text-center">
                              {row.status === 'pending' && (
                                <Badge variant="outline" className="text-xs">Pending</Badge>
                              )}
                              {row.status === 'success' && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Done
                                </Badge>
                              )}
                              {row.status === 'error' && (
                                <Badge variant="destructive" className="text-xs" title={row.error}>
                                  <X className="h-3 w-3 mr-1" />
                                  Error
                                </Badge>
                              )}
                            </td>
                            <td className="p-2">
                              {row.status === 'pending' && !isImporting && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => removeRow(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-600 text-base">
              <AlertCircle className="h-5 w-5" />
              Tips for a Successful Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Make sure your file is saved as <strong>CSV</strong> (Comma Separated Values) format</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>The first row should be headers - it will be skipped during import</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>Medicine Name</strong> and <strong>Price</strong> are required - others are optional</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Prices should be numbers only (no currency symbols like XAF or FCFA)</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>If you're using Excel, go to <strong>File → Save As → CSV</strong></span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>You can remove individual items before importing by clicking the X button</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
