'use client'

import { useState } from 'react'
import { 
  Users, 
  UserX, 
  Shield, 
  TrendingUp, 
  Plus, 
  Search, 
  FileText, 
  Download,
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    uan: '',
    email: '',
    phone: '',
    jobRole: '',
    offerDate: '',
    offerStatus: '',
    joiningDate: '',
    reason: '',
    notes: ''
  })

  const dashboardStats = [
    { title: 'Total Candidates Added', value: '245', icon: Users, color: 'blue' },
    { title: 'Non-Joining Cases', value: '23', icon: UserX, color: 'red' },
    { title: 'Verified Records', value: '198', icon: Shield, color: 'green' },
    { title: 'Company Trust Score', value: '8.7/10', icon: TrendingUp, color: 'purple' }
  ]

  const handleSearch = () => {
    // Mock search result
    setSearchResult({
      found: true,
      candidate: 'Rajesh Kumar',
      offers: 3,
      notJoined: 2,
      lastCompany: 'AlphaTech Pvt. Ltd.',
      lastDate: 'August 2025',
      verifiedBy: 3
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('✅ Record added successfully to RedHunt database.')
    setShowAddForm(false)
    setFormData({
      fullName: '',
      uan: '',
      email: '',
      phone: '',
      jobRole: '',
      offerDate: '',
      offerStatus: '',
      joiningDate: '',
      reason: '',
      notes: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">RedHunt</h1>
              <span className="ml-4 text-sm text-gray-500">Employer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-red-600 p-2">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-gray-700 hover:text-red-600 p-2">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'add', label: 'Add Candidate' },
                { id: 'search', label: 'Verify Candidate' },
                { id: 'reports', label: 'Reports' },
                { id: 'profile', label: 'Company Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RedHunt Dashboard</h2>
              <p className="text-gray-600">Manage your candidate records and verify joining history.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('add')}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Candidate
                  </button>
                  <button 
                    onClick={() => setActiveTab('search')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Verify Candidate
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Added 5 new candidates today</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>2 candidates marked as not joined</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    <span>3 records verified by network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Candidate Tab */}
        {activeTab === 'add' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Candidate Details</h2>
              <p className="text-gray-600">Enter candidate information for every job offer made.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UAN / Unique ID *
                    </label>
                    <input
                      type="text"
                      value={formData.uan}
                      onChange={(e) => setFormData({...formData, uan: e.target.value})}
                      placeholder="e.g. UAN-854392"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. rajesh.kumar@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Role / Department *
                    </label>
                    <input
                      type="text"
                      value={formData.jobRole}
                      onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Date *
                    </label>
                    <input
                      type="date"
                      value={formData.offerDate}
                      onChange={(e) => setFormData({...formData, offerDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Status *
                    </label>
                    <select
                      value={formData.offerStatus}
                      onChange={(e) => setFormData({...formData, offerStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Offered">Offered</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Joined">Joined</option>
                      <option value="Not Joined">Not Joined</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Not Joining (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="e.g. Accepted another offer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="e.g. Candidate promised to join but didn't report"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    Save Record
                  </button>
                  <button
                    type="button"
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Upload Excel (Bulk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="text-gray-500 px-6 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search/Verify Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Candidate Record</h2>
              <p className="text-gray-600">Check if a candidate has rejected previous offers.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Candidate
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter UAN / Email / Phone Number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>

              {searchResult && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Search className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-semibold text-gray-900">Candidate Found</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{searchResult.candidate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Offers:</span>
                      <span className="font-medium">{searchResult.offers} accepted, {searchResult.notJoined} not joined</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Offer:</span>
                      <span className="font-medium">{searchResult.lastCompany} ({searchResult.lastDate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified by:</span>
                      <span className="font-medium">{searchResult.verifiedBy} employers</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Add this candidate to your company records
                    </button>
                  </div>
                </div>
              )}

              {searchResult === null && searchQuery && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No matching record found in RedHunt database.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Hiring Insights</h2>
              <p className="text-gray-600">Track offer trends and candidate joining behavior.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Offer Acceptance Rate</h3>
                <p className="text-3xl font-bold text-green-600">78%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Non-Joining Percentage</h3>
                <p className="text-3xl font-bold text-red-600">22%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Dropout Position</h3>
                <p className="text-lg font-bold text-gray-900">Software Engineer</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Trend</h3>
                <p className="text-lg font-bold text-blue-600">+12%</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Top 5 Positions with Most Dropouts</h4>
                  <div className="space-y-2">
                    {['Software Engineer', 'Data Analyst', 'Marketing Manager', 'Sales Executive', 'HR Specialist'].map((position, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{position}</span>
                        <span className="font-medium">{15 - index}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Monthly Joining Trends</h4>
                  <div className="space-y-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{month}</span>
                        <span className="font-medium">{65 + index * 5}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h2>
              <p className="text-gray-600">Manage your company information and settings.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="RedLeaf Technologies Pvt. Ltd."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      defaultValue="IT / Software"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HR Contact
                    </label>
                    <input
                      type="text"
                      defaultValue="Suresh Nair"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Official Email
                    </label>
                    <input
                      type="email"
                      defaultValue="hr@redleaftech.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Code
                    </label>
                    <input
                      type="text"
                      defaultValue="RLT-09235"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="text"
                      defaultValue="**********"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
