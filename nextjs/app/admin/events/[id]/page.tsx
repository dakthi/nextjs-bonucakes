"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"
import EventForm from "@/components/admin/EventForm"

export default function EditEventPage() {
  const params = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/events/${params.id}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to fetch event")

      setEvent(data.event)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update event information
            </p>
          </div>

          {loading ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              Loading event...
            </div>
          ) : error ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-red-600">
              Error: {error}
            </div>
          ) : event ? (
            <EventForm event={event} isEdit />
          ) : null}
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
