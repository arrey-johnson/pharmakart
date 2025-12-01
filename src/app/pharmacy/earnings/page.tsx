'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2, 
  Banknote,
  Smartphone,
  Building2,
  ArrowDownToLine
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatPrice } from '@/lib/constants'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

interface Earnings {
  totalEarnings: number
  totalWithdrawn: number
  pendingAmount: number
  availableBalance: number
  totalOrders: number
}

interface Withdrawal {
  id: string
  amount: number
  method: string
  accountNumber: string
  accountName?: string
  bankName?: string
  status: string
  createdAt: string
  processedAt?: string
  rejectionReason?: string
}

const methodLabels: Record<string, string> = {
  MTN_MOMO: 'MTN Mobile Money',
  ORANGE_MONEY: 'Orange Money',
  BANK_TRANSFER: 'Bank Transfer',
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function EarningsPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [earnings, setEarnings] = useState<Earnings | null>(null)
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    method: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
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
      if (!profile?.id) return

      try {
        const [earningsData, withdrawalsData] = await Promise.all([
          api.getPharmacyEarnings(profile.id),
          api.getPharmacyWithdrawals(profile.id),
        ])

        setEarnings(earningsData)
        setWithdrawals(withdrawalsData)
      } catch (error) {
        console.error('Failed to fetch earnings:', error)
        toast.error('Failed to load earnings data')
      } finally {
        setIsLoading(false)
      }
    }

    if (profile?.id) {
      fetchData()
    }
  }, [profile?.id])

  const handleWithdrawal = async () => {
    if (!profile?.id) return
    
    if (!withdrawalForm.amount || !withdrawalForm.method || !withdrawalForm.accountNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    const amount = parseFloat(withdrawalForm.amount)
    if (amount <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    if (earnings && amount > earnings.availableBalance) {
      toast.error('Insufficient balance')
      return
    }

    setIsWithdrawing(true)
    try {
      await api.requestWithdrawal({
        pharmacyId: profile.id,
        amount,
        method: withdrawalForm.method as 'MTN_MOMO' | 'ORANGE_MONEY' | 'BANK_TRANSFER',
        accountNumber: withdrawalForm.accountNumber,
        accountName: withdrawalForm.accountName || undefined,
        bankName: withdrawalForm.bankName || undefined,
      })

      toast.success('Withdrawal request submitted successfully')
      setDialogOpen(false)
      setWithdrawalForm({
        amount: '',
        method: '',
        accountNumber: '',
        accountName: '',
        bankName: '',
      })

      // Refresh data
      const [earningsData, withdrawalsData] = await Promise.all([
        api.getPharmacyEarnings(profile.id),
        api.getPharmacyWithdrawals(profile.id),
      ])
      setEarnings(earningsData)
      setWithdrawals(withdrawalsData)
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request')
    } finally {
      setIsWithdrawing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/pharmacy">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Earnings & Withdrawals</h1>
                <p className="text-sm text-muted-foreground">Manage your pharmacy earnings</p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!earnings || earnings.availableBalance < 1000}>
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                  <DialogDescription>
                    Withdraw your earnings to Mobile Money or Bank Account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(earnings?.availableBalance || 0)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (XAF) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalForm.amount}
                      onChange={(e) => setWithdrawalForm({ ...withdrawalForm, amount: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Minimum: 1,000 XAF</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Withdrawal Method *</Label>
                    <Select
                      value={withdrawalForm.method}
                      onValueChange={(value) => setWithdrawalForm({ ...withdrawalForm, method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MTN_MOMO">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-yellow-500" />
                            MTN Mobile Money
                          </div>
                        </SelectItem>
                        <SelectItem value="ORANGE_MONEY">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-orange-500" />
                            Orange Money
                          </div>
                        </SelectItem>
                        <SelectItem value="BANK_TRANSFER">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            Bank Transfer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                      {withdrawalForm.method === 'BANK_TRANSFER' ? 'Account Number' : 'Phone Number'} *
                    </Label>
                    <Input
                      id="accountNumber"
                      placeholder={withdrawalForm.method === 'BANK_TRANSFER' ? 'Enter account number' : 'e.g., 6XXXXXXXX'}
                      value={withdrawalForm.accountNumber}
                      onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Name on account"
                      value={withdrawalForm.accountName}
                      onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountName: e.target.value })}
                    />
                  </div>

                  {withdrawalForm.method === 'BANK_TRANSFER' && (
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="e.g., Afriland First Bank"
                        value={withdrawalForm.bankName}
                        onChange={(e) => setWithdrawalForm({ ...withdrawalForm, bankName: e.target.value })}
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleWithdrawal} 
                    disabled={isWithdrawing}
                    className="w-full"
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="h-4 w-4 mr-2" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(earnings?.totalEarnings || 0)}</p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(earnings?.availableBalance || 0)}</p>
                  <p className="text-xs text-muted-foreground">Available Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(earnings?.pendingAmount || 0)}</p>
                  <p className="text-xs text-muted-foreground">Pending Withdrawal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Banknote className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(earnings?.totalWithdrawn || 0)}</p>
                  <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Track all your withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Banknote className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No withdrawals yet</p>
                <p className="text-sm">Your withdrawal history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => {
                  const status = statusConfig[withdrawal.status] || statusConfig.PENDING
                  const StatusIcon = status.icon
                  return (
                    <div 
                      key={withdrawal.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${status.color}`}>
                          <StatusIcon className={`h-4 w-4 ${withdrawal.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{formatPrice(withdrawal.amount)}</p>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {methodLabels[withdrawal.method]} • {withdrawal.accountNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested: {formatDate(withdrawal.createdAt)}
                          </p>
                          {withdrawal.processedAt && (
                            <p className="text-xs text-green-600">
                              Completed: {formatDate(withdrawal.processedAt)}
                            </p>
                          )}
                          {withdrawal.rejectionReason && (
                            <p className="text-xs text-red-600">
                              Reason: {withdrawal.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-700 mb-2">How Withdrawals Work</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Earnings are calculated from completed (delivered) orders</li>
              <li>• Minimum withdrawal amount is 1,000 XAF</li>
              <li>• Withdrawals are processed within 24-48 hours</li>
              <li>• You'll receive a notification when your withdrawal is processed</li>
              <li>• For bank transfers, please ensure your account details are correct</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
