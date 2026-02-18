'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminDashboardAPI } from '@/lib/admin-api'
import Link from 'next/link'

interface DashboardStats {
  tours_count: number
  active_tours_count: number
  users_count: number
  leads_count: number
  new_leads_count: number
  destinations_count: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await adminDashboardAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Tours',
      value: stats?.tours_count || 0,
      subtitle: `${stats?.active_tours_count || 0} active`,
      href: '/admin/tours',
    },
    {
      title: 'Destinations',
      value: stats?.destinations_count || 0,
      subtitle: 'Active locations',
      href: '/admin/destinations',
    },
    {
      title: 'Total Users',
      value: stats?.users_count || 0,
      subtitle: 'Registered users',
      href: '#',
    },
    {
      title: 'Leads',
      value: stats?.leads_count || 0,
      subtitle: `${stats?.new_leads_count || 0} new`,
      href: '/admin/leads',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-sans text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your site.</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 p-6 group cursor-pointer"
              >
                <h3 className="text-gray-500 text-sm font-medium mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold font-sans text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/tours/new"
              className="p-6 border border-gray-200 hover:bg-black hover:text-white transition-all text-center group"
            >
              <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="font-medium">Add New Tour</span>
            </Link>
            <Link
              href="/admin/destinations/new"
              className="p-6 border border-gray-200 hover:bg-black hover:text-white transition-all text-center group"
            >
              <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="font-medium">Add Destination</span>
            </Link>
            <Link
              href="/admin/testimonials/new"
              className="p-6 border border-gray-200 hover:bg-black hover:text-white transition-all text-center group"
            >
              <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="font-medium">Add Testimonial</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
