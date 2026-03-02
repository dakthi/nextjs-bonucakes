"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Save, X, Upload } from 'lucide-react'

interface ProductFormData {
  // Vietnamese fields
  nameVi: string
  descriptionVi: string
  shortDescriptionVi: string
  ingredientsVi: string
  howToUseVi: string
  // English fields
  nameEn: string
  descriptionEn: string
  shortDescriptionEn: string
  ingredientsEn: string
  howToUseEn: string
  // Common fields
  slug: string
  sku: string
  price: string
  compareAtPrice: string
  cost: string
  category: string
  tags: string
  weight: string
  weightUnit: string
  servingSize: string
  servingsPerContainer: string
  calories: string
  allergens: string
  storageInstructions: string
  shelfLife: string
  imageSrc: string
  imageAlt: string
  images: string
  featured: boolean
  available: boolean
  stock: string
  stockStatus: string
  trackInventory: boolean
  complementaryProducts: string
  // Promo fields
  promoTitle: string
  promoDescription: string
  promoImage: string
  promoButtonText: string
  promoButtonLink: string
  // SEO
  metaTitle: string
  metaDescription: string
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  productId?: number
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function ProductForm({ initialData, productId, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: initialData || {
      category: 'food',
      weightUnit: 'g',
      stockStatus: 'in_stock',
      featured: false,
      available: true,
      trackInventory: true,
    }
  })

  const nameVi = watch('nameVi')
  const nameEn = watch('nameEn')

  // Auto-generate slug from Vietnamese name
  useEffect(() => {
    if (nameVi && !productId) {
      const slug = nameVi
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [nameVi, productId, setValue])

  const handleFormSubmit = async (data: ProductFormData) => {
    const formattedData = {
      ...data,
      price: parseFloat(data.price) || 0,
      compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
      cost: data.cost ? parseFloat(data.cost) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      servingsPerContainer: data.servingsPerContainer ? parseInt(data.servingsPerContainer) : null,
      calories: data.calories ? parseInt(data.calories) : null,
      stock: parseInt(data.stock) || 0,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      allergens: data.allergens ? data.allergens.split(',').map(a => a.trim()).filter(Boolean) : [],
      images: data.images ? data.images.split('\n').map(i => i.trim()).filter(Boolean) : [],
      complementaryProducts: data.complementaryProducts
        ? data.complementaryProducts.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [],
    }

    await onSubmit(formattedData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Vietnamese Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name (Vietnamese) *
            </label>
            <input
              {...register('nameVi', { required: 'Vietnamese name is required' })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            {errors.nameVi && <p className="mt-1 text-sm text-red-600">{errors.nameVi.message}</p>}
          </div>

          {/* English Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name (English) *
            </label>
            <input
              {...register('nameEn', { required: 'English name is required' })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            {errors.nameEn && <p className="mt-1 text-sm text-red-600">{errors.nameEn.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              {...register('slug', { required: 'Slug is required' })}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              {...register('sku')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            >
              <option value="food">Food Products</option>
              <option value="beverage">Beverages</option>
              <option value="bakery">Bakery</option>
              <option value="snack">Snacks</option>
              <option value="dessert">Desserts</option>
              <option value="sauce">Sauces & Condiments</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              {...register('tags')}
              type="text"
              placeholder="organic, vegan, gluten-free"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Vietnamese) *
            </label>
            <textarea
              {...register('descriptionVi', { required: 'Vietnamese description is required' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            {errors.descriptionVi && <p className="mt-1 text-sm text-red-600">{errors.descriptionVi.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (English) *
            </label>
            <textarea
              {...register('descriptionEn', { required: 'English description is required' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            {errors.descriptionEn && <p className="mt-1 text-sm text-red-600">{errors.descriptionEn.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Description (Vietnamese)
              </label>
              <textarea
                {...register('shortDescriptionVi')}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Description (English)
              </label>
              <textarea
                {...register('shortDescriptionEn')}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Pricing & Inventory</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (VND) *
            </label>
            <input
              {...register('price', { required: 'Price is required' })}
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Compare at Price (VND)
            </label>
            <input
              {...register('compareAtPrice')}
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost (VND)
            </label>
            <input
              {...register('cost')}
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              {...register('stock')}
              type="number"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Status
            </label>
            <select
              {...register('stockStatus')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center pt-7">
            <input
              {...register('trackInventory')}
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Track Inventory
            </label>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Product Details</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight
              </label>
              <input
                {...register('weight')}
                type="number"
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                {...register('weightUnit')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="l">Liters (l)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Serving Size
            </label>
            <input
              {...register('servingSize')}
              type="text"
              placeholder="e.g., 1 piece, 100g"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Servings Per Container
            </label>
            <input
              {...register('servingsPerContainer')}
              type="number"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calories (per serving)
            </label>
            <input
              {...register('calories')}
              type="number"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allergens (comma-separated)
            </label>
            <input
              {...register('allergens')}
              type="text"
              placeholder="milk, eggs, nuts"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Shelf Life
            </label>
            <input
              {...register('shelfLife')}
              type="text"
              placeholder="e.g., 30 days"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Storage Instructions
          </label>
          <textarea
            {...register('storageInstructions')}
            rows={2}
            placeholder="Store in a cool, dry place"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ingredients (Vietnamese)
            </label>
            <textarea
              {...register('ingredientsVi')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ingredients (English)
            </label>
            <textarea
              {...register('ingredientsEn')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              How to Use (Vietnamese)
            </label>
            <textarea
              {...register('howToUseVi')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              How to Use (English)
            </label>
            <textarea
              {...register('howToUseEn')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Product Images</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Image URL
            </label>
            <input
              {...register('imageSrc')}
              type="text"
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image Alt Text
            </label>
            <input
              {...register('imageAlt')}
              type="text"
              placeholder="Description for accessibility"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Images (one URL per line)
            </label>
            <textarea
              {...register('images')}
              rows={4}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Status & Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Status & Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              {...register('available')}
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Product Available (visible to customers)
            </label>
          </div>

          <div className="flex items-center">
            <input
              {...register('featured')}
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Complementary Product IDs (comma-separated)
            </label>
            <input
              {...register('complementaryProducts')}
              type="text"
              placeholder="e.g., 1,5,12"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              These products will appear in the "You May Also Like" section
            </p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">SEO</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              {...register('metaTitle')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              {...register('metaDescription')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : (productId ? 'Save Changes' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}
