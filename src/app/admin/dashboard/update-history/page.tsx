"use client"

import { useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

export default function AdminUpdateHistoryPage() {
  const [historySearchQuery, setHistorySearchQuery] = useState('')
  const [historySearchLoading, setHistorySearchLoading] = useState(false)
  const [historyResults, setHistoryResults] = useState<any[]>([])
  const [historyCandidate, setHistoryCandidate] = useState<any | null>(null)
  const [historyNote, setHistoryNote] = useState('')
  const [historySaving, setHistorySaving] = useState(false)
  const [historyMsg, setHistoryMsg] = useState<string | null>(null)
  const [historyErr, setHistoryErr] = useState<string | null>(null)
  const [historyEditingIdx, setHistoryEditingIdx] = useState<number | null>(null)
  const [historyEditingText, setHistoryEditingText] = useState('')

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const handleAdminHistorySearch = async () => {
    setHistorySearchLoading(true)
    setHistoryErr(null)
    setHistoryResults([])
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/candidate-users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const q = historySearchQuery.trim().toLowerCase()
      const filtered = Array.isArray(data) ? data : (data?.users || data?.data || [])
      const results = (filtered || []).filter((u: any) => {
        const email = (u.email || u.primaryEmail || '').toLowerCase()
        const uan = (u.uan || u.uanNumber || '').toLowerCase()
        const name = (u.name || u.fullName || '').toLowerCase()
        return !q || email.includes(q) || uan.includes(q) || name.includes(q)
      })
      setHistoryResults(results)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Search failed'
      setHistoryErr(msg)
    } finally {
      setHistorySearchLoading(false)
    }
  }

  const selectHistoryCandidate = async (cu: any) => {
    setHistoryCandidate(null)
    setHistoryMsg(null)
    setHistoryErr(null)
    setHistoryEditingIdx(null)
    setHistoryEditingText('')
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')
      const id = cu._id || cu.id
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/candidate-users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistoryCandidate(data || cu)
    } catch (err: any) {
      setHistoryCandidate(cu)
    }
  }

  const adminAddHistoryEntry = async () => {
    if (!historyCandidate) return
    if (!historyNote.trim()) return
    setHistorySaving(true)
    setHistoryMsg(null)
    setHistoryErr(null)
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')
      const id = historyCandidate._id || historyCandidate.id
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${id}/status`, { 
        status: historyCandidate.status || 'approved', 
        notes: historyNote.trim() 
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const newEntry = {
        points: (historyCandidate.updateHistory?.length || 0) + 1,
        date: new Date().toISOString(),
        updatedByRole: 'admin',
        updatedByName: 'Admin',
        notes: historyNote.trim()
      }
      setHistoryCandidate({ ...historyCandidate, updateHistory: [...(historyCandidate.updateHistory || []), newEntry] })
      setHistoryNote('')
      setHistoryMsg('Note added')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add note'
      setHistoryErr(msg)
    } finally {
      setHistorySaving(false)
    }
  }

  const adminPatchHistoryEntry = async (entryId: string, newText: string) => {
    if (!historyCandidate) return
    setHistorySaving(true)
    setHistoryMsg(null)
    setHistoryErr(null)
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')
      const id = historyCandidate._id || historyCandidate.id
      await axios.patch(`${API_BASE_URL}/api/admin/candidate-users/${id}/update-history/${entryId}`, { notes: newText }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const updated = (historyCandidate.updateHistory || []).map((it: any) => (it._id === entryId || it.id === entryId) ? { ...it, notes: newText } : it)
      setHistoryCandidate({ ...historyCandidate, updateHistory: updated })
      setHistoryMsg('History updated')
      setHistoryEditingIdx(null)
      setHistoryEditingText('')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update Red-Flagged Remark'
      setHistoryErr(msg)
    } finally {
      setHistorySaving(false)
    }
  }

  const adminDeleteHistoryEntry = async (entryId: string) => {
    if (!historyCandidate) return
    setHistorySaving(true)
    setHistoryMsg(null)
    setHistoryErr(null)
    try {
      const token = getToken()
      if (!token) throw new Error('Authentication required')
      const id = historyCandidate._id || historyCandidate.id
      await axios.delete(`${API_BASE_URL}/api/admin/candidate-users/${id}/update-history/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const filtered = (historyCandidate.updateHistory || []).filter((it: any) => (it._id || it.id) !== entryId)
      setHistoryCandidate({ ...historyCandidate, updateHistory: filtered })
      setHistoryMsg('History entry deleted')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete history'
      setHistoryErr(msg)
    } finally {
      setHistorySaving(false)
    }
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Manage Candidate Updated Red-Flagged</h2>
        <p className="text-sm sm:text-base text-gray-600">Search a verified candidate user and maintain their timeline. You can add notes or edit/delete entries you created.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidate Users</label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              placeholder="Filter by email / UAN / name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminHistorySearch()}
            />
            <button
              onClick={handleAdminHistorySearch}
              disabled={historySearchLoading}
              className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center disabled:opacity-70 text-sm sm:text-base"
            >
              {historySearchLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {historyErr && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{historyErr}</div>
        )}

        {historyResults.length > 0 && (
          <div className="space-y-3">
            {historyResults.map((cu: any, index) => (
              <div key={cu._id || cu.id || index} className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{cu.name || cu.fullName || 'Candidate'}</h5>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{cu.email || cu.primaryEmail || '-'}</p>
                </div>
                <button
                  onClick={() => selectHistoryCandidate(cu)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-700"
                >
                  Manage History
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {historyCandidate && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{historyCandidate.name || 'Candidate'} — Updated Red-Flagged</h3>
          </div>

          <div className="space-y-3">
            {(historyCandidate.updateHistory || []).length > 0 ? (
              (historyCandidate.updateHistory || []).map((h: any, idx: number) => (
                <div key={h._id || h.id || idx} className="rounded-lg border border-gray-200 p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Red-Flagged : {h.points ?? idx + 1}</div>
                    <div className="text-xs text-gray-500">{h.date ? new Date(h.date).toLocaleString() : ''}</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    <span className="mr-2">By: {h.updatedByName || '-'} ({h.updatedByRole || '-'})</span>
                    {h.companyName && <span className="mr-2">Company: {h.companyName}</span>}
                  </div>
                  {historyEditingIdx === idx ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={historyEditingText}
                        onChange={(e) => setHistoryEditingText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => adminPatchHistoryEntry(h._id || h.id, historyEditingText)}
                          disabled={historySaving}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-70"
                        >
                          {historySaving ? 'Saving...' : 'Save Edit'}
                        </button>
                        <button
                          onClick={() => { setHistoryEditingIdx(null); setHistoryEditingText('') }}
                          className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {h.notes && <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{h.notes}</div>}
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => { setHistoryEditingIdx(idx); setHistoryEditingText(h.notes || '') }}
                          className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => adminDeleteHistoryEntry(h._id || h.id)}
                          disabled={historySaving}
                          className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 disabled:opacity-70"
                        >
                          {historySaving ? 'Working...' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Read-only comments */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-800 mb-2">Comments</div>
                    {Array.isArray(h.comments) && h.comments.length > 0 ? (
                      <div className="space-y-2">
                        {h.comments.map((c: any, cIdx: number) => (
                          <div key={c._id || cIdx} className="bg-gray-50 rounded p-2">
                            <div className="text-xs text-gray-800 whitespace-pre-wrap break-words">{c.text}</div>
                            <div className="text-[10px] text-gray-500 mt-1">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">No comments yet.</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600">No history yet.</div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Add Red-Flagged Note</h4>
            {historyMsg && <div className="mb-2 text-xs text-green-700">{historyMsg}</div>}
            {historyErr && <div className="mb-2 text-xs text-red-700">{historyErr}</div>}
            <div className="space-y-2">
              <textarea
                value={historyNote}
                onChange={(e) => setHistoryNote(e.target.value)}
                rows={3}
                placeholder="Add admin note or context..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              />
              <div>
                <button
                  onClick={adminAddHistoryEntry}
                  disabled={historySaving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70"
                >
                  {historySaving ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

