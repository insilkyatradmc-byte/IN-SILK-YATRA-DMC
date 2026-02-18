'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminInquiryFormSettingsAPI } from '@/lib/admin-api'
import toast from 'react-hot-toast'

interface InquiryFormSetting {
  id: number
  setting_key: string
  label: string
  options: string[]
  is_active: boolean
  sort_order: number
}

export default function AdminInquiryFormSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<InquiryFormSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<{options: string[]}>({options: []})
  const [newOption, setNewOption] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await adminInquiryFormSettingsAPI.getAll()
      setSettings(response.data.data)
    } catch (error) {
      toast.error('Failed to load inquiry form settings')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (setting: InquiryFormSetting) => {
    setEditingId(setting.id)
    setEditData({options: [...setting.options]})
    setNewOption('')
  }

  const handleAddOption = () => {
    if (newOption.trim()) {
      setEditData({options: [...editData.options, newOption.trim()]})
      setNewOption('')
    }
  }

  const handleRemoveOption = (index: number) => {
    setEditData({
      options: editData.options.filter((_, i) => i !== index)
    })
  }

  const handleSave = async (id: number) => {
    try {
      await adminInquiryFormSettingsAPI.update(id, editData)
      toast.success('Settings updated successfully')
      setEditingId(null)
      loadSettings()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings')
    }
  }

  const handleToggleActive = async (id: number, is_active: boolean) => {
    try {
      await adminInquiryFormSettingsAPI.update(id, { is_active: !is_active })
      toast.success(`Setting ${!is_active ? 'activated' : 'deactivated'}`)
      loadSettings()
    } catch (error) {
      toast.error('Failed to toggle setting')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-gray-900">Inquiry Form Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage dynamic options for the customer inquiry form
          </p>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold font-sans text-gray-900">{setting.label}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                    {setting.setting_key}
                  </span>
                  <button
                    onClick={() => handleToggleActive(setting.id, setting.is_active)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      setting.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {setting.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                {editingId === setting.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(setting.id)}
                      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(setting)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit Options
                  </button>
                )}
              </div>

              {editingId === setting.id ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      placeholder="Add new option..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddOption}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editData.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded"
                      >
                        <span>{option}</span>
                        <button
                          onClick={() => handleRemoveOption(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {setting.options.map((option, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
