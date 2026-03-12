"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"
import Link from "next/link"

interface Event {
  id: number
  titleEn: string
  titleVi: string
  slug: string
  eventDate: string
  eventTime: string | null
  locationEn: string | null
  locationVi: string | null
  maxAttendees: number | null
  currentAttendees: number
  price: number | null
  category: string | null
  featured: boolean
  published: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/events")
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to fetch events")

      setEvents(data.events)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete event")
      }

      fetchEvents()
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage events and workshops
              </p>
            </div>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#083121] hover:bg-[#4a5c52]"
            >
              Add Event
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading events...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">Error: {error}</div>
            ) : events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No events yet. Create your first event!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {event.titleEn}
                          </div>
                          <div className="text-sm text-gray-500">{event.titleVi}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(event.eventDate)}
                          </div>
                          {event.eventTime && (
                            <div className="text-sm text-gray-500">
                              {event.eventTime}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {event.locationEn || "-"}
                          </div>
                          {event.locationVi && (
                            <div className="text-sm text-gray-500">
                              {event.locationVi}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.currentAttendees}
                          {event.maxAttendees && ` / ${event.maxAttendees}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {event.price ? `£${event.price}` : "Free"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {event.published && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Published
                              </span>
                            )}
                            {!event.published && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Draft
                              </span>
                            )}
                            {event.featured && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#fcc56c]/20 text-[#083121]">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="text-[#083121] hover:text-[#4a5c52] mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
