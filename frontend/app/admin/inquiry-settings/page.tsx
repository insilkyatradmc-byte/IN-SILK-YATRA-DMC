'use client'

import { useState, useEffect } from 'react'
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

const emptyCreate = { setting_key: '', label: '', options: [] as string[], is_active: true, sort_order: 0 }

export default function AdminInquiryFormSettingsPage() {
  const [settings, setSettings] = useState<InquiryFormSetting[]>([])
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<{ label: string; options: string[] }>({ label: '', options: [] })
  const [editNewOption, setEditNewOption] = useState('')

  // Create state
  const [showCreate, setShowCreate] = useState(false)
  const [createData, setCreateData] = useState({ ...emptyCreate })
  const [createNewOption, setCreateNewOption] = useState('')

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const res = await adminInquiryFormSettingsAPI.getAll()
      setSettings(res.data.data)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  /* ── Edit ── */
  const startEdit = (s: InquiryFormSetting) => {
    setEditingId(s.id); setEditData({ label: s.label, options: [...s.options] }); setEditNewOption('')
  }
  const cancelEdit = () => { setEditingId(null); setEditNewOption('') }
  const addEditOption = () => {
    if (editNewOption.trim()) { setEditData(d => ({ ...d, options: [...d.options, editNewOption.trim()] })); setEditNewOption('') }
  }
  const removeEditOption = (i: number) => setEditData(d => ({ ...d, options: d.options.filter((_, idx) => idx !== i) }))
  const saveEdit = async (id: number) => {
    try {
      await adminInquiryFormSettingsAPI.update(id, editData)
      toast.success('Setting updated'); setEditingId(null); loadSettings()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Update failed') }
  }

  /* ── Toggle ── */
  const toggleActive = async (id: number, current: boolean) => {
    try {
      await adminInquiryFormSettingsAPI.update(id, { is_active: !current })
      toast.success(`Setting ${!current ? 'activated' : 'deactivated'}`); loadSettings()
    } catch { toast.error('Failed to toggle') }
  }

  /* ── Create ── */
  const addCreateOption = () => {
    if (createNewOption.trim()) { setCreateData(d => ({ ...d, options: [...d.options, createNewOption.trim()] })); setCreateNewOption('') }
  }
  const removeCreateOption = (i: number) => setCreateData(d => ({ ...d, options: d.options.filter((_, idx) => idx !== i) }))
  const handleCreate = async () => {
    if (!createData.setting_key.trim() || !createData.label.trim()) { toast.error('Setting key and label are required'); return }
    if (createData.options.length === 0) { toast.error('Add at least one option'); return }
    try {
      await adminInquiryFormSettingsAPI.create(createData)
      toast.success('Setting created'); setShowCreate(false); setCreateData({ ...emptyCreate }); loadSettings()
    } catch (e: any) { toast.error(e.response?.data?.message || 'Create failed') }
  }

  /* ── Delete ── */
  const confirmDelete = async (id: number) => {
    try {
      await adminInquiryFormSettingsAPI.delete(id)
      toast.success('Setting deleted'); setDeletingId(null); loadSettings()
    } catch { toast.error('Delete failed') }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inquiry Form Settings</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage options shown to users in the multi-step inquiry form. Changes apply instantly.</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setEditingId(null) }}
            className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Setting Group
          </button>
        </div>

        {/* Create Panel */}
        {showCreate && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-primary-200 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Create New Setting Group</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Setting Key <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={createData.setting_key}
                  onChange={e => setCreateData(d => ({ ...d, setting_key: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                  placeholder="e.g. budget_ranges"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Unique — lowercase + underscores only</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Display Label <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={createData.label}
                  onChange={e => setCreateData(d => ({ ...d, label: e.target.value }))}
                  placeholder="e.g. Budget Ranges"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Options <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={createNewOption}
                  onChange={e => setCreateNewOption(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCreateOption())}
                  placeholder="Type option then press Enter or click Add"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button onClick={addCreateOption} className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {createData.options.map((opt, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-800 rounded-full text-sm border border-primary-200">
                    {opt}
                    <button onClick={() => removeCreateOption(i)} className="text-primary-400 hover:text-red-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
                {createData.options.length === 0 && <p className="text-xs text-gray-400 italic">No options yet</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="create-active" type="checkbox" checked={createData.is_active} onChange={e => setCreateData(d => ({ ...d, is_active: e.target.checked }))} className="w-4 h-4 text-primary-600" />
              <label htmlFor="create-active" className="text-sm text-gray-700">Active (visible in inquiry form)</label>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={handleCreate} className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">Save Setting Group</button>
              <button onClick={() => { setShowCreate(false); setCreateData({ ...emptyCreate }) }} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        )}

        {/* Settings List */}
        <div className="space-y-4">
          {settings.map(setting => (
            <div key={setting.id} className={`bg-white rounded-xl shadow-sm border p-6 ${setting.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              {/* Row header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{setting.label}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded font-mono">{setting.setting_key}</span>
                  <button
                    onClick={() => toggleActive(setting.id, setting.is_active)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${setting.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {setting.is_active ? '● Active' : '○ Inactive'}
                  </button>
                </div>
                <div className="flex gap-2">
                  {editingId === setting.id ? (
                    <>
                      <button onClick={() => saveEdit(setting.id)} className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">Save</button>
                      <button onClick={cancelEdit} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(setting)} className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 font-medium">Edit</button>
                      <button onClick={() => setDeletingId(setting.id)} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 font-medium">Delete</button>
                    </>
                  )}
                </div>
              </div>

              {/* Delete confirm bar */}
              {deletingId === setting.id && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-red-700 font-medium">⚠️ Delete &quot;{setting.label}&quot;? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={() => confirmDelete(setting.id)} className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-medium">Yes, delete</button>
                    <button onClick={() => setDeletingId(null)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {editingId === setting.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Display Label</label>
                    <input type="text" value={editData.label} onChange={e => setEditData(d => ({ ...d, label: e.target.value }))} className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Options</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={editNewOption}
                        onChange={e => setEditNewOption(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEditOption())}
                        placeholder="New option (Enter to add)"
                        className="flex-1 max-w-sm px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <button onClick={addEditOption} className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editData.options.map((opt, i) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm border border-blue-200">
                          {opt}
                          <button onClick={() => removeEditOption(i)} className="text-blue-400 hover:text-red-500">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {setting.options.map((opt, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200">{opt}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {settings.length === 0 && !showCreate && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No settings found.</p>
            <p className="text-sm mt-1">Create your first setting group using the button above.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
