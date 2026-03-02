"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"
import ProductForm from "@/components/admin/ProductForm"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create product')

      router.push('/admin/products')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new product in your catalog
            </p>
          </div>

          <ProductForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
