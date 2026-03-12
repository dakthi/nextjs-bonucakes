"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

interface EventFormProps {
  event?: any
  isEdit?: boolean
}

export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    titleVi: event?.titleVi || "",
    titleEn: event?.titleEn || "",
    descriptionVi: event?.descriptionVi || "",
    descriptionEn: event?.descriptionEn || "",
    slug: event?.slug || "",
    image: event?.image || "",
    eventDate: event?.eventDate
      ? new Date(event.eventDate).toISOString().split("T")[0]
      : "",
    eventTime: event?.eventTime || "",
    locationVi: event?.locationVi || "",
    locationEn: event?.locationEn || "",
    addressVi: event?.addressVi || "",
    addressEn: event?.addressEn || "",
    maxAttendees: event?.maxAttendees || "",
    price: event?.price || "",
    category: event?.category || "",
    featured: event?.featured || false,
    published: event?.published || false,
    registrationUrl: event?.registrationUrl || "",
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isEdit ? `/api/admin/events/${event.id}` : "/api/admin/events"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save event")
      }

      router.push("/admin/events")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const generateSlug = () => {
    const slug = formData.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData((prev) => ({ ...prev, slug }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[#083121] mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title (English) *
              </label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title (Vietnamese) *
              </label>
              <input
                type="text"
                name="titleVi"
                value={formData.titleVi}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="flex-1 rounded-l-md border-gray-300 focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (English) *
              </label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (Vietnamese) *
              </label>
              <textarea
                name="descriptionVi"
                value={formData.descriptionVi}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[#083121] mb-4">
            Event Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Time
              </label>
              <input
                type="text"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                placeholder="e.g., 10:00 AM - 12:00 PM"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Workshop, Tasting"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location (English)
              </label>
              <input
                type="text"
                name="locationEn"
                value={formData.locationEn}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location (Vietnamese)
              </label>
              <input
                type="text"
                name="locationVi"
                value={formData.locationVi}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address (English)
              </label>
              <textarea
                name="addressEn"
                value={formData.addressEn}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address (Vietnamese)
              </label>
              <textarea
                name="addressVi"
                value={formData.addressVi}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (£)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Leave empty for free"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Registration URL
            </label>
            <input
              type="url"
              name="registrationUrl"
              value={formData.registrationUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fcc56c] focus:ring-[#fcc56c]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium text-[#083121]">Options</h2>
        <div className="flex items-center gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="rounded border-gray-300 text-[#fcc56c] focus:ring-[#fcc56c]"
            />
            <span className="ml-2 text-sm text-gray-700">Featured Event</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="rounded border-gray-300 text-[#fcc56c] focus:ring-[#fcc56c]"
            />
            <span className="ml-2 text-sm text-gray-700">Published</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#083121] hover:bg-[#4a5c52] disabled:bg-gray-400"
        >
          {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  )
}
