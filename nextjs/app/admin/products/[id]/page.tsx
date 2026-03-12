"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"
import ProductForm from "@/components/admin/ProductForm"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${id}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to fetch product')

      const product = data.product

      // Format the data for the form
      const formData = {
        nameVi: product.nameVi,
        nameEn: product.nameEn,
        descriptionVi: product.descriptionVi,
        descriptionEn: product.descriptionEn,
        shortDescriptionVi: product.shortDescriptionVi || '',
        shortDescriptionEn: product.shortDescriptionEn || '',
        ingredientsVi: product.ingredientsVi || '',
        ingredientsEn: product.ingredientsEn || '',
        howToUseVi: product.howToUseVi || '',
        howToUseEn: product.howToUseEn || '',
        slug: product.slug,
        sku: product.sku || '',
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
        cost: product.cost ? product.cost.toString() : '',
        category: product.category,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        weight: product.weight ? product.weight.toString() : '',
        weightUnit: product.weightUnit || 'g',
        servingSize: product.servingSize || '',
        servingsPerContainer: product.servingsPerContainer ? product.servingsPerContainer.toString() : '',
        calories: product.calories ? product.calories.toString() : '',
        allergens: Array.isArray(product.allergens) ? product.allergens.join(', ') : '',
        storageInstructions: product.storageInstructions || '',
        shelfLife: product.shelfLife || '',
        imageSrc: product.imageSrc || '',
        imageAlt: product.imageAlt || '',
        images: Array.isArray(product.images) ? product.images.join('\n') : '',
        featured: product.featured,
        available: product.available,
        stock: product.stock.toString(),
        stockStatus: product.stockStatus,
        trackInventory: product.trackInventory,
        complementaryProducts: Array.isArray(product.complementaryProducts)
          ? product.complementaryProducts.join(', ')
          : '',
        promoTitle: product.promoTitle || '',
        promoDescription: product.promoDescription || '',
        promoImage: product.promoImage || '',
        promoButtonText: product.promoButtonText || '',
        promoButtonLink: product.promoButtonLink || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
      }

      setInitialData(formData)
    } catch (err: any) {
      alert('Error: ' + err.message)
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to update product')

      router.push('/admin/products')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminAuth>
        <AdminSidebar>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#083121] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </AdminSidebar>
      </AdminAuth>
    )
  }

  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update product information
            </p>
          </div>

          {initialData && (
            <ProductForm
              initialData={initialData}
              productId={parseInt(id)}
              onSubmit={handleSubmit}
              isLoading={saving}
            />
          )}
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
