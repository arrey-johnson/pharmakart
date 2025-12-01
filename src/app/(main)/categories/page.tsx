'use client'

import Link from 'next/link'
import { Thermometer, Wind, Bug, HeartPulse, Droplet, Baby, Pill, ShieldCheck, Sparkles, Eye, Bone, Brain } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { name: 'Pain & Fever', slug: 'pain-fever', icon: Thermometer, color: 'bg-red-100 text-red-600', description: 'Paracetamol, Ibuprofen, Aspirin' },
  { name: 'Cough & Cold', slug: 'cough-cold', icon: Wind, color: 'bg-blue-100 text-blue-600', description: 'Syrups, Lozenges, Decongestants' },
  { name: 'Malaria', slug: 'malaria', icon: Bug, color: 'bg-yellow-100 text-yellow-700', description: 'Coartem, Artesunate, Prevention' },
  { name: 'Hypertension', slug: 'hypertension', icon: HeartPulse, color: 'bg-pink-100 text-pink-600', description: 'Blood pressure medications' },
  { name: 'Diabetes', slug: 'diabetes', icon: Droplet, color: 'bg-purple-100 text-purple-600', description: 'Insulin, Metformin, Glucometers' },
  { name: 'Baby & Children', slug: 'baby-children', icon: Baby, color: 'bg-green-100 text-green-600', description: 'Pediatric medicines, vitamins' },
  { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', icon: Pill, color: 'bg-orange-100 text-orange-600', description: 'Multivitamins, minerals, supplements' },
  { name: 'Antibiotics', slug: 'antibiotics', icon: ShieldCheck, color: 'bg-teal-100 text-teal-600', description: 'Prescription antibiotics' },
  { name: 'Skin Care', slug: 'skin-care', icon: Sparkles, color: 'bg-rose-100 text-rose-600', description: 'Creams, lotions, treatments' },
  { name: 'Eye Care', slug: 'eye-care', icon: Eye, color: 'bg-cyan-100 text-cyan-600', description: 'Eye drops, solutions' },
  { name: 'Bone & Joint', slug: 'bone-joint', icon: Bone, color: 'bg-amber-100 text-amber-600', description: 'Calcium, joint supplements' },
  { name: 'Mental Health', slug: 'mental-health', icon: Brain, color: 'bg-indigo-100 text-indigo-600', description: 'Antidepressants, sleep aids' },
]

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <p className="text-muted-foreground mt-1">Browse medicines by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className={`p-4 rounded-xl ${category.color} w-fit mb-4`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
