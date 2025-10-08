'use client'

import { useState } from 'react'
import { 
  Users, 
  UserCheck, 
  Shield, 
  Clock, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Settings,
  LogOut,
  Bell
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const dashboardStats = [
    { title: 'Total Employers', value: '156', icon: Users, color: 'blue', change: '+12%' },
    { title: 'Total Candidates', value: '2,847', icon: UserCheck, color: 'green', change: '+8%' },
    { title: 'Verified Records', value: '2,234', icon: Shield, color: 'purple', change: '+15%' },
    { title: 'Pending Verifications', value: '23', icon: Clock, color: 'yellow', change: '-5%' }
  ]

  const employers = [
    {
      id: 1,
      company: 'AlphaTech',
      email: 'hr@alphatech.com',
      status: 'Active',
      candidates: 245,
      joinedOn: '2025-06-15',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      company: 'BetaCorp',
      email: 'hr@betacorp.com',
      status: 'Pending',
      candidates: 0,
      joinedOn: '2025-01-20',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      company: 'GammaTech',
      email: 'hr@gammatech.com',
      status: 'Suspended',
      candidates: 89,
      joinedOn: '2024-11-10',
      lastActivity: '1 week ago'
    }
  ]

  const notifications = [
    { id: 1, type: 'success', message: 'New employer registration pending approval.', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Employer AlphaTech reported 12 non-joins this week.', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Daily backup completed successfully.', time: '2 hours ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">RedHunt</h1>
              <span className="ml-4 text-sm text-gray-500">Admin Console</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-700 hover:text-red-600 p-2">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
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
                { id: 'employers', label: 'Employers' },
                { id: 'candidates', label: 'Candidates' },
                { id: 'reports', label: 'Reports' },
                { id: 'notifications', label: 'Notifications' }
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">RedHunt Admin Console</h2>
              <p className="text-gray-600">Manage employers, data integrity, and analytics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* System Health */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Services</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Running
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Encryption</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>3 new employers registered today</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>5 pending verifications</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    <span>127 records verified this week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employers Tab */}
        {activeTab === 'employers' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employer Accounts</h2>
              <p className="text-gray-600">Manage employer registrations and account status.</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search employers..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Employers Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employers.map((employer) => (
                    <tr key={employer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{employer.company}</div>
                        <div className="text-sm text-gray-500">{employer.lastActivity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employer.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : employer.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.candidates}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employer.joinedOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Ban className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Master Candidate Records</h2>
              <p className="text-gray-600">Unified list of all records submitted by employers.</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">By UAN / Email</label>
                  <input
                    type="text"
                    placeholder="Search candidate..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">By Employer</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option>All Employers</option>
                    <option>AlphaTech</option>
                    <option>BetaCorp</option>
                    <option>GammaTech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">By Offer Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option>All Status</option>
                    <option>Joined</option>
                    <option>Not Joined</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">By Date Range</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Sample Candidate Records */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Records</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Rajesh Kumar', uan: 'UAN-854392', status: 'Not Joined', company: 'AlphaTech', date: '2025-01-15' },
                    { name: 'Priya Sharma', uan: 'UAN-923847', status: 'Joined', company: 'BetaCorp', date: '2025-01-10' },
                    { name: 'Amit Singh', uan: 'UAN-456789', status: 'Not Joined', company: 'GammaTech', date: '2025-01-08' }
                  ].map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-500">{candidate.uan}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          candidate.status === 'Joined' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {candidate.status}
                        </span>
                        <span className="text-sm text-gray-500">{candidate.company}</span>
                        <span className="text-sm text-gray-500">{candidate.date}</span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & System Analytics</h2>
              <p className="text-gray-600">Comprehensive analytics and system insights.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Employers (Month-on-Month)</h3>
                <div className="space-y-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{month}</span>
                      <span className="font-medium">{120 + index * 8}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Joining Rate by Industry</h3>
                <div className="space-y-2">
                  {['IT/Software', 'Finance', 'Healthcare', 'Manufacturing', 'Education'].map((industry, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{industry}</span>
                      <span className="font-medium">{15 + index * 3}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributing Employers</h3>
                <div className="space-y-2">
                  {['AlphaTech', 'BetaCorp', 'GammaTech', 'DeltaInc', 'EpsilonLabs'].map((company, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{company}</span>
                      <span className="font-medium">{245 - index * 40}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">System Analytics</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">API Usage Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-medium">12,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Successful</span>
                      <span className="font-medium text-green-600">98.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Failed</span>
                      <span className="font-medium text-red-600">1.8%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Offer Rejection Heatmap</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Software Engineer</span>
                      <span className="font-medium text-red-600">High</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Data Analyst</span>
                      <span className="font-medium text-yellow-600">Medium</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Marketing Manager</span>
                      <span className="font-medium text-green-600">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">System Notifications</h2>
              <p className="text-gray-600">Monitor system alerts and important updates.</p>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'success' 
                        ? 'bg-green-100' 
                        : notification.type === 'warning'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}>
                      {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                      {notification.type === 'info' && <Bell className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
