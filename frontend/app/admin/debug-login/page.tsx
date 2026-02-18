'use client'

import { useState } from 'react'

export default function DebugLoginPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testDirectFetch = async () => {
    setLoading(true)
    setResult('Testing direct fetch...\n')
    
    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@insilkyatra.com',
          password: 'insilkyatradmc'
        })
      })
      
      const data = await response.json()
      
      setResult(prev => prev + `\n✅ Status: ${response.status}\n`)
      setResult(prev => prev + `📦 Data: ${JSON.stringify(data, null, 2)}\n`)
      
      if (data.success && data.token) {
        setResult(prev => prev + '\n🎉 LOGIN SUCCESSFUL!\n')
        setResult(prev => prev + `Token: ${data.token}\n`)
        setResult(prev => prev + `Admin: ${JSON.stringify(data.admin, null, 2)}\n`)
      }
    } catch (error: any) {
      setResult(prev => prev + `\n❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testWithAxios = async () => {
    setLoading(true)
    setResult('Testing with axios (admin-api)...\n')
    
    try {
      const { default: adminApi } = await import('@/lib/admin-api')
      
      const response = await adminApi.post('/login', {
        email: 'admin@insilkyatra.com',
        password: 'insilkyatradmc'
      })
      
      setResult(prev => prev + `\n✅ Response: ${JSON.stringify(response.data, null, 2)}\n`)
      
      if (response.data.success && response.data.token) {
        setResult(prev => prev + '\n🎉 LOGIN SUCCESSFUL WITH AXIOS!\n')
      }
    } catch (error: any) {
      setResult(prev => prev + `\n❌ Axios Error: ${error.message}\n`)
      setResult(prev => prev + `Response: ${JSON.stringify(error.response?.data, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Admin Login Debug Tool</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-xl font-bold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}</p>
            <p><strong>Expected Endpoint:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/login</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-xl font-bold mb-4">Test Credentials</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> admin@insilkyatra.com</p>
            <p><strong>Password:</strong> insilkyatradmc</p>
          </div>
        </div>
        
        <div className="space-x-4 mb-6">
          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>
          
          <button
            onClick={testWithAxios}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test With Axios'}
          </button>
        </div>
        
        {result && (
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
            {result}
          </div>
        )}
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-bold mb-2">📝 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open browser console (F12) to see detailed logs</li>
            <li>Click "Test Direct Fetch" to test raw API connection</li>
            <li>Click "Test With Axios" to test through admin-api module</li>
            <li>Check console for emoji-tagged logs (🔐, 📤, 📥, etc.)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
