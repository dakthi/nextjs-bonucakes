"use client"

import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminAuth from "@/components/admin/AdminAuth"
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  return (
    <AdminAuth>
      <AdminSidebar>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome to Bonu Cakes Admin Panel
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">₫0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/admin/products"
                className="block p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow transition"
              >
                <h3 className="text-sm font-medium text-gray-900">Products</h3>
                <p className="mt-1 text-sm text-gray-500">Add and manage products</p>
              </a>
              <a
                href="/admin/orders"
                className="block p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow transition"
              >
                <h3 className="text-sm font-medium text-gray-900">Orders</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage orders</p>
              </a>
              <a
                href="/admin/courses"
                className="block p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow transition"
              >
                <h3 className="text-sm font-medium text-gray-900">Courses</h3>
                <p className="mt-1 text-sm text-gray-500">Manage cooking courses</p>
              </a>
              <a
                href="/admin/blog"
                className="block p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow transition"
              >
                <h3 className="text-sm font-medium text-gray-900">Blog Posts</h3>
                <p className="mt-1 text-sm text-gray-500">Create and edit blog content</p>
              </a>
              <a
                href="/admin/reviews"
                className="block p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow transition"
              >
                <h3 className="text-sm font-medium text-gray-900">Reviews</h3>
                <p className="mt-1 text-sm text-gray-500">Manage customer reviews</p>
              </a>
              <a
                href="/admin/media"
                className="block p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow transition"
              >
                <h3 className="text-sm font-medium text-gray-900">Media Library</h3>
                <p className="mt-1 text-sm text-gray-500">Upload and manage media</p>
              </a>
            </div>
          </div>
        </div>
      </AdminSidebar>
    </AdminAuth>
  )
}
