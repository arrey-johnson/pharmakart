'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface AdminSettings {
  id: string
  defaultDeliveryFeeNear: number
  defaultDeliveryFeeFar: number
  commissionPercentage: number
}

type SettingsField = 'defaultDeliveryFeeNear' | 'defaultDeliveryFeeFar' | 'commissionPercentage'

export default function AdminSettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, user, router])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getAdminSettings()
        setSettings(data)
      } catch (error: any) {
        console.error('Failed to load settings', error)
        toast.error(error.message || 'Failed to load settings')
      }
    }

    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchSettings()
    }
  }, [isAuthenticated, user])

  const handleChange = (field: SettingsField, value: string) => {
    if (!settings) return
    const num = Number(value)
    setSettings({ ...settings, [field]: isNaN(num) ? 0 : num })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      setIsSaving(true)
      await api.updateAdminSettings({
        defaultDeliveryFeeNear: settings.defaultDeliveryFeeNear,
        defaultDeliveryFeeFar: settings.defaultDeliveryFeeFar,
        commissionPercentage: settings.commissionPercentage,
      })
      toast.success('Settings updated successfully')
    } catch (error: any) {
      console.error('Failed to save settings', error)
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">Admin Settings</h1>
              <p className="text-sm text-muted-foreground">Configure platform-wide fees and commission</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>These settings affect all orders and payouts across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {!settings ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nearFee">Default delivery fee (0–5 km)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="nearFee"
                        type="number"
                        min={0}
                        value={settings.defaultDeliveryFeeNear}
                        onChange={(e) => handleChange('defaultDeliveryFeeNear', e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">XAF</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used as the base delivery fee for nearby deliveries.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farFee">Default delivery fee (5–10 km)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="farFee"
                        type="number"
                        min={0}
                        value={settings.defaultDeliveryFeeFar}
                        onChange={(e) => handleChange('defaultDeliveryFeeFar', e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">XAF</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used as the base delivery fee for further deliveries.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="commission">Commission percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="commission"
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={settings.commissionPercentage}
                      onChange={(e) => handleChange('commissionPercentage', e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Percentage taken from each order as platform commission.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
