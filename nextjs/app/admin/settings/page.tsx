"use client"

import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"

export default function SettingsPage() {
  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage site settings and configuration
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h2>
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
