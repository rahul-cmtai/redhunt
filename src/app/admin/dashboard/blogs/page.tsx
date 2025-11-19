'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Calendar,
  Clock,
  BookOpen,
  Loader2,
  CheckCircle,
  FileText,
  Archive
} from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Blog {
  _id: string
  title: string
  slug: string
  description: string
  content: string
  date: string
  readTime: string
  points: string[]
  status: 'draft' | 'published' | 'archived'
  createdBy?: {
    name: string
    email: string
  }
  updatedBy?: {
    name: string
    email: string
  }
  createdAt?: string
  updatedAt?: string
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    points: [''],
    status: 'draft' as 'draft' | 'published' | 'archived'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getToken = () => localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }

      const params: any = {}
      if (filterStatus !== 'all') {
        params.status = filterStatus
      }
      if (searchQuery) {
        params.search = searchQuery
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/blogs/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })

      setBlogs(data.blogs || data || [])
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        setTimeout(() => {
          window.location.href = '/admin/login'
        }, 2000)
      } else {
        setError('Failed to fetch blogs')
        console.error('Fetch blogs error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [filterStatus])

  useEffect(() => {
    if (searchQuery) {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBlogs(filtered)
    } else {
      setFilteredBlogs(blogs)
    }
  }, [searchQuery, blogs])

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setIsEditMode(true)
      setSelectedBlog(blog)
      setFormData({
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        content: blog.content,
        date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        readTime: blog.readTime,
        points: blog.points.length > 0 ? blog.points : [''],
        status: blog.status
      })
    } else {
      setIsEditMode(false)
      setSelectedBlog(null)
      setFormData({
        title: '',
        slug: '',
        description: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        points: [''],
        status: 'draft'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setSelectedBlog(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      points: [''],
      status: 'draft'
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...formData.points]
    newPoints[index] = value
    setFormData((prev) => ({ ...prev, points: newPoints }))
  }

  const handleAddPoint = () => {
    setFormData((prev) => ({ ...prev, points: [...prev.points, ''] }))
  }

  const handleRemovePoint = (index: number) => {
    if (formData.points.length > 1) {
      const newPoints = formData.points.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, points: newPoints }))
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = getToken()
      if (!token) {
        setError('No authentication token found')
        return
      }

      // Filter out empty points
      const validPoints = formData.points.filter((p) => p.trim() !== '')

      if (validPoints.length === 0) {
        setError('At least one key point is required')
        setIsSubmitting(false)
        return
      }

      const payload = {
        ...formData,
        points: validPoints
      }

      if (isEditMode && selectedBlog) {
        await axios.put(
          `${API_BASE_URL}/api/blogs/admin/${selectedBlog._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          `${API_BASE_URL}/api/blogs/admin`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      handleCloseModal()
      fetchBlogs()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save blog')
      console.error('Save blog error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const token = getToken()
      if (!token) {
        setError('No authentication token found')
        return
      }

      await axios.delete(`${API_BASE_URL}/api/blogs/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      fetchBlogs()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete blog')
      console.error('Delete blog error:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-600 mt-1">Create, edit, and manage blog posts</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Blog</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Blog List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No blogs found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                    {getStatusBadge(blog.status)}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{blog.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>{blog.points.length} key points</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(blog)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Date and Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time *
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5 min read"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Key Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Points *
                </label>
                <div className="space-y-2">
                  {formData.points.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointChange(index, e.target.value)}
                        placeholder={`Key point ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      {formData.points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePoint(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    + Add Point
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEditMode ? 'Update' : 'Create'} Blog
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

