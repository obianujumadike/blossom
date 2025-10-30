'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaFilter,
  FaChartBar,
  FaFileAlt,
  FaFilePdf,
  FaFileExcel,
  FaTable,
  FaPrint,
  FaShare,
  FaClock,
  FaUser,
  FaHospital,
  FaStethoscope,
  FaPlus,
  FaSearch,
  FaTimes
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface Report {
  id: string
  title: string
  type: 'patient_report' | 'batch_analysis' | 'statistical_summary' | 'monthly_summary' | 'custom'
  createdDate: string
  period: {
    start: string
    end: string
  }
  status: 'generating' | 'ready' | 'failed'
  size?: string
  format: 'pdf' | 'excel' | 'csv'
  caseCount?: number
  createdBy: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'patient_report' | 'batch_analysis' | 'statistical_summary' | 'monthly_summary' | 'custom'
  icon: any
  fields: string[]
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    title: 'October 2024 - Monthly Analysis Report',
    type: 'monthly_summary',
    createdDate: '2024-10-29T14:30:00Z',
    period: { start: '2024-10-01', end: '2024-10-31' },
    status: 'ready',
    size: '2.4 MB',
    format: 'pdf',
    caseCount: 247,
    createdBy: 'Dr. Sarah Smith'
  },
  {
    id: '2',
    title: 'Batch Analysis - High Priority Cases',
    type: 'batch_analysis',
    createdDate: '2024-10-29T10:15:00Z',
    period: { start: '2024-10-28', end: '2024-10-29' },
    status: 'ready',
    size: '856 KB',
    format: 'excel',
    caseCount: 23,
    createdBy: 'Dr. Sarah Smith'
  },
  {
    id: '3',
    title: 'AI Performance Statistics Q4 2024',
    type: 'statistical_summary',
    createdDate: '2024-10-29T08:45:00Z',
    period: { start: '2024-10-01', end: '2024-12-31' },
    status: 'generating',
    format: 'pdf',
    createdBy: 'Dr. Sarah Smith'
  }
]

const reportTemplates: ReportTemplate[] = [
  {
    id: 'patient_report',
    name: 'Patient Report',
    description: 'Detailed analysis report for individual patient cases',
    type: 'patient_report',
    icon: FaUser,
    fields: ['Patient Demographics', 'Study Details', 'AI Analysis', 'Findings', 'Recommendations']
  },
  {
    id: 'batch_analysis',
    name: 'Batch Analysis Report',
    description: 'Comprehensive analysis of multiple cases',
    type: 'batch_analysis',
    icon: FaTable,
    fields: ['Case Summary', 'AI Confidence Scores', 'BI-RADS Distribution', 'Quality Metrics']
  },
  {
    id: 'statistical_summary',
    name: 'Statistical Summary',
    description: 'Statistical analysis and performance metrics',
    type: 'statistical_summary',
    icon: FaChartBar,
    fields: ['Performance Metrics', 'Accuracy Statistics', 'Trend Analysis', 'Comparative Data']
  },
  {
    id: 'monthly_summary',
    name: 'Monthly Summary',
    description: 'Monthly performance and activity report',
    type: 'monthly_summary',
    icon: FaCalendarAlt,
    fields: ['Case Volume', 'Performance Metrics', 'Quality Indicators', 'Compliance Data']
  }
]

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports)
  const [activeTab, setActiveTab] = useState<'reports' | 'generate'>('reports')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [reportFilters, setReportFilters] = useState({
    dateRange: { start: '', end: '' },
    reportType: '',
    status: ''
  })
  
  // Generate report form state
  const [generateForm, setGenerateForm] = useState({
    template: '',
    title: '',
    dateRange: { start: '', end: '' },
    format: 'pdf' as 'pdf' | 'excel' | 'csv',
    includeFields: [] as string[],
    filters: {
      priority: '',
      status: '',
      biradsScore: ''
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100'
      case 'generating':
        return 'text-blue-600 bg-blue-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FaFilePdf className="w-4 h-4 text-red-600" />
      case 'excel':
        return <FaFileExcel className="w-4 h-4 text-green-600" />
      case 'csv':
        return <FaTable className="w-4 h-4 text-blue-600" />
      default:
        return <FaFileAlt className="w-4 h-4 text-gray-600" />
    }
  }

  const handleGenerateReport = () => {
    // Implementation would generate the report
    console.log('Generating report with:', generateForm)
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId)
    if (template) {
      setGenerateForm(prev => ({
        ...prev,
        template: templateId,
        title: template.name,
        includeFields: template.fields
      }))
    }
  }

  const toggleField = (field: string) => {
    setGenerateForm(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(field)
        ? prev.includeFields.filter(f => f !== field)
        : [...prev.includeFields, field]
    }))
  }

  const filteredReports = reports.filter(report => {
    if (reportFilters.reportType && report.type !== reportFilters.reportType) return false
    if (reportFilters.status && report.status !== reportFilters.status) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            
            <BossomLogo size="sm" />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">Generate and manage clinical reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reports'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaFileAlt className="w-4 h-4" />
                  Generated Reports
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('generate')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'generate'
                    ? 'border-bossom-pink-500 text-bossom-pink-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaPlus className="w-4 h-4" />
                  Generate New Report
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Reports List Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select
                      value={reportFilters.reportType}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, reportType: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All Types</option>
                      <option value="patient_report">Patient Reports</option>
                      <option value="batch_analysis">Batch Analysis</option>
                      <option value="statistical_summary">Statistical Summary</option>
                      <option value="monthly_summary">Monthly Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={reportFilters.status}
                      onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                      className={componentStyles.input.base}
                    >
                      <option value="">All Status</option>
                      <option value="ready">Ready</option>
                      <option value="generating">Generating</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={reportFilters.dateRange.start}
                      onChange={(e) => setReportFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className={componentStyles.input.base}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={reportFilters.dateRange.end}
                      onChange={(e) => setReportFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className={componentStyles.input.base}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className={componentStyles.card.elevated}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Reports</h2>
                  <span className="text-sm text-gray-500">{filteredReports.length} reports</span>
                </div>
              </div>
              
              <div className="p-6">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reports found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-900">{report.title}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                {report.status === 'generating' && <FaClock className="w-3 h-3 mr-1" />}
                                {report.status.replace('_', ' ')}
                              </span>
                              <div className="flex items-center gap-1">
                                {getFormatIcon(report.format)}
                                <span className="text-xs text-gray-500 uppercase">{report.format}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span>Created: {new Date(report.createdDate).toLocaleDateString()}</span>
                              <span>Period: {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}</span>
                              {report.caseCount && <span>Cases: {report.caseCount}</span>}
                              {report.size && <span>Size: {report.size}</span>}
                              <span>By: {report.createdBy}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {report.status === 'ready' && (
                              <>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <FaEye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <FaDownload className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <FaShare className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <FaPrint className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generate Report Tab */}
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Templates */}
            <div className="lg:col-span-2">
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Report Templates</h2>
                  <p className="text-gray-600 mt-1">Choose a template to get started</p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          generateForm.template === template.id
                            ? 'border-bossom-pink-500 bg-bossom-pink-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-gray-100 rounded-lg">
                            <template.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            
                            <div className="flex flex-wrap gap-1">
                              {template.fields.map((field) => (
                                <span key={field} className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Report Configuration */}
              {generateForm.template && (
                <div className={`${componentStyles.card.elevated} mt-6`}>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Report Configuration</h2>
                    <p className="text-gray-600 mt-1">Customize your report settings</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                        <input
                          type="text"
                          value={generateForm.title}
                          onChange={(e) => setGenerateForm(prev => ({ ...prev, title: e.target.value }))}
                          className={componentStyles.input.base}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                        <select
                          value={generateForm.format}
                          onChange={(e) => setGenerateForm(prev => ({ ...prev, format: e.target.value as any }))}
                          className={componentStyles.input.base}
                        >
                          <option value="pdf">PDF</option>
                          <option value="excel">Excel</option>
                          <option value="csv">CSV</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={generateForm.dateRange.start}
                          onChange={(e) => setGenerateForm(prev => ({ 
                            ...prev, 
                            dateRange: { ...prev.dateRange, start: e.target.value }
                          }))}
                          className={componentStyles.input.base}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          value={generateForm.dateRange.end}
                          onChange={(e) => setGenerateForm(prev => ({ 
                            ...prev, 
                            dateRange: { ...prev.dateRange, end: e.target.value }
                          }))}
                          className={componentStyles.input.base}
                        />
                      </div>
                    </div>

                    {/* Include Fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Include Fields</label>
                      <div className="grid grid-cols-2 gap-3">
                        {reportTemplates.find(t => t.id === generateForm.template)?.fields.map((field) => (
                          <label key={field} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={generateForm.includeFields.includes(field)}
                              onChange={() => toggleField(field)}
                              className="h-4 w-4 text-bossom-pink-600 focus:ring-bossom-pink-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-sm text-gray-700">{field}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filters */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Additional Filters</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Priority</label>
                          <select
                            value={generateForm.filters.priority}
                            onChange={(e) => setGenerateForm(prev => ({ 
                              ...prev, 
                              filters: { ...prev.filters, priority: e.target.value }
                            }))}
                            className={componentStyles.input.base}
                          >
                            <option value="">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Status</label>
                          <select
                            value={generateForm.filters.status}
                            onChange={(e) => setGenerateForm(prev => ({ 
                              ...prev, 
                              filters: { ...prev.filters, status: e.target.value }
                            }))}
                            className={componentStyles.input.base}
                          >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="review-needed">Review Needed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">BI-RADS Score</label>
                          <select
                            value={generateForm.filters.biradsScore}
                            onChange={(e) => setGenerateForm(prev => ({ 
                              ...prev, 
                              filters: { ...prev.filters, biradsScore: e.target.value }
                            }))}
                            className={componentStyles.input.base}
                          >
                            <option value="">All Scores</option>
                            <option value="0">BI-RADS 0</option>
                            <option value="1">BI-RADS 1</option>
                            <option value="2">BI-RADS 2</option>
                            <option value="3">BI-RADS 3</option>
                            <option value="4">BI-RADS 4</option>
                            <option value="5">BI-RADS 5</option>
                            <option value="6">BI-RADS 6</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleGenerateReport}
                        className={componentStyles.button.primary}
                        disabled={!generateForm.title || !generateForm.dateRange.start || !generateForm.dateRange.end}
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Report Preview */}
            <div>
              <div className={componentStyles.card.elevated}>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
                </div>
                
                <div className="p-6">
                  {generateForm.template ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Title:</span>
                            <span className="text-gray-900">{generateForm.title || 'Untitled'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Format:</span>
                            <span className="text-gray-900 uppercase">{generateForm.format}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date Range:</span>
                            <span className="text-gray-900">
                              {generateForm.dateRange.start && generateForm.dateRange.end 
                                ? `${generateForm.dateRange.start} to ${generateForm.dateRange.end}`
                                : 'Not set'
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Included Fields</h4>
                        <div className="space-y-1">
                          {generateForm.includeFields.map((field) => (
                            <div key={field} className="flex items-center gap-2 text-sm">
                              <FaStethoscope className="w-3 h-3 text-green-600" />
                              <span className="text-gray-700">{field}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {generateForm.filters.priority && (
                            <div>Priority: {generateForm.filters.priority}</div>
                          )}
                          {generateForm.filters.status && (
                            <div>Status: {generateForm.filters.status}</div>
                          )}
                          {generateForm.filters.biradsScore && (
                            <div>BI-RADS: {generateForm.filters.biradsScore}</div>
                          )}
                          {!generateForm.filters.priority && !generateForm.filters.status && !generateForm.filters.biradsScore && (
                            <div>No filters applied</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Select a template to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}