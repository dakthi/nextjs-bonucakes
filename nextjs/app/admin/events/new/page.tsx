"use client"

import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"
import EventForm from "@/components/admin/EventForm"

export default function NewEventPage() {
  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new event or workshop
            </p>
          </div>

          <EventForm />
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
