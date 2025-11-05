'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaArrowLeft, 
  FaExpand, 
  FaCompress, 
  FaSearchPlus, 
  FaSearchMinus,
  FaDownload,
  FaShare,
  FaPrint,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaEye
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface ROI {
  id: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  finding: string
  classification: 'benign' | 'malignant' | 'suspicious'
}

interface AnalysisResult {
  id: string
  patientName: string
  medicalRecordNumber: string
  studyDate: string
  overallBiradsScore: string
  overallConfidence: number
  findings: string[]
  recommendation: string
  images: {
    id: string
    view: string
    side: 'left' | 'right'
    url: string
    rois: ROI[]
    biradsScore: string
    confidence: number
  }[]
}

// Mock analysis data
const mockAnalysis: AnalysisResult = {
  id: '1',
  patientName: 'Sarah Johnson',
  medicalRecordNumber: 'MRN-2024-001',
  studyDate: '2024-10-29',
  overallBiradsScore: 'BI-RADS 4',
  overallConfidence: 94.2,
  findings: [
    'Suspicious mass detected in left breast upper outer quadrant',
    'Architectural distortion noted in right breast',
    'Increased density compared to prior study'
  ],
  recommendation: 'Recommend tissue sampling (biopsy) for suspicious findings',
  images: [
    {
      id: '1',
      view: 'CC',
      side: 'left',
      url: '/api/placeholder/mammogram-left-cc',
      biradsScore: 'BI-RADS 4',
      confidence: 92.1,
      rois: [
        {
          id: 'roi-1',
          x: 120,
          y: 80,
          width: 60,
          height: 45,
          confidence: 92.1,
          finding: 'Suspicious mass',
          classification: 'suspicious'
        }
      ]
    },
    {
      id: '2',
      view: 'MLO',
      side: 'left',
      url: '/api/placeholder/mammogram-left-mlo',
      biradsScore: 'BI-RADS 4',
      confidence: 94.8,
      rois: [
        {
          id: 'roi-2',
          x: 90,
          y: 110,
          width: 55,
          height: 40,
          confidence: 94.8,
          finding: 'Suspicious mass',
          classification: 'suspicious'
        }
      ]
    },
    {
      id: '3',
      view: 'CC',
      side: 'right',
      url: '/api/placeholder/mammogram-right-cc',
      biradsScore: 'BI-RADS 2',
      confidence: 96.5,
      rois: []
    },
    {
      id: '4',
      view: 'MLO',
      side: 'right',
      url: '/api/placeholder/mammogram-right-mlo',
      biradsScore: 'BI-RADS 3',
      confidence: 87.3,
      rois: [
        {
          id: 'roi-3',
          x: 150,
          y: 130,
          width: 40,
          height: 35,
          confidence: 87.3,
          finding: 'Architectural distortion',
          classification: 'suspicious'
        }
      ]
    }
  ]
}

export default function AnalysisPage() {
  const router = useRouter()
  const [analysis] = useState<AnalysisResult>(mockAnalysis)
  const [selectedImage, setSelectedImage] = useState(analysis.images[0])
  const [selectedROI, setSelectedROI] = useState<ROI | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getROIColor = (classification: string) => {
    switch (classification) {
      case 'malignant':
        return 'border-red-500 bg-red-500/20'
      case 'suspicious':
        return 'border-yellow-500 bg-yellow-500/20'
      case 'benign':
        return 'border-green-500 bg-green-500/20'
      default:
        return 'border-blue-500 bg-blue-500/20'
    }
  }

  const getBiradsColor = (score: string) => {
    if (score.includes('1') || score.includes('2')) return 'text-green-600 bg-green-100'
    if (score.includes('3')) return 'text-yellow-600 bg-yellow-100'
    if (score.includes('4') || score.includes('5')) return 'text-red-600 bg-red-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <BossomLogo size="sm" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">{analysis.patientName} - AI Analysis</h1>
                <p className="text-sm text-gray-600">
                  {analysis.medicalRecordNumber} • {new Date(analysis.studyDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                <FaDownload className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                <FaShare className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
                <FaPrint className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Analysis Results */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Overall Assessment */}
          <div className="p-6 border-b border-gray-200">
            <div className="text-center mb-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getBiradsColor(analysis.overallBiradsScore)}`}>
                {analysis.overallBiradsScore}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">{analysis.overallConfidence}%</div>
                <div className="text-sm text-gray-600">Overall Confidence</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-bossom-pink-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{width: `${analysis.overallConfidence}%`}}
              ></div>
            </div>

            <div className="text-sm text-gray-700">
              <div className="font-medium mb-2">Recommendation:</div>
              <div>{analysis.recommendation}</div>
            </div>
          </div>

          {/* Image Selection */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Images</h3>
            <div className="grid grid-cols-2 gap-2">
              {analysis.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`
                    p-3 border-2 rounded-lg text-left transition-all duration-200
                    ${selectedImage.id === image.id 
                      ? 'border-bossom-pink-300 bg-bossom-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium text-sm text-gray-900 capitalize">
                    {image.side} {image.view}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getBiradsColor(image.biradsScore)}`}>
                    {image.biradsScore}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {image.confidence}% confidence
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Findings */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Findings</h3>
            <div className="space-y-3">
              {analysis.findings.map((finding, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700">{finding}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ROI Details */}
            {selectedImage.rois.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Regions of Interest</h3>
                <div className="space-y-2">
                  {selectedImage.rois.map((roi) => (
                    <button
                      key={roi.id}
                      onClick={() => setSelectedROI(selectedROI?.id === roi.id ? null : roi)}
                      className={`
                        w-full p-3 border rounded-lg text-left transition-all duration-200
                        ${selectedROI?.id === roi.id 
                          ? 'border-bossom-pink-300 bg-bossom-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm text-gray-900">{roi.finding}</div>
                        <div className="text-xs font-bold text-gray-600">{roi.confidence}%</div>
                      </div>
                      <div className="text-xs text-gray-600 capitalize">{roi.classification}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Viewer */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {/* Viewer Controls */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-white text-sm font-medium capitalize">
                {selectedImage.side} {selectedImage.view} • {selectedImage.confidence}% confidence
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getBiradsColor(selectedImage.biradsScore)}`}>
                {selectedImage.biradsScore}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Zoom Out"
              >
                <FaSearchMinus className="w-4 h-4" />
              </button>
              <span className="text-gray-300 text-sm min-w-16 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Zoom In"
              >
                <FaSearchPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <div 
              className="relative bg-gray-800 rounded-lg overflow-hidden"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Mammogram Image Placeholder */}
              <div className="w-96 h-96 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FaEye className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-sm">Mammogram Image</div>
                  <div className="text-xs capitalize">{selectedImage.side} {selectedImage.view}</div>
                </div>
              </div>

              {/* ROI Overlays */}
              {selectedImage.rois.map((roi) => (
                <div
                  key={roi.id}
                  className={`
                    absolute border-2 cursor-pointer transition-all duration-200
                    ${getROIColor(roi.classification)}
                    ${selectedROI?.id === roi.id ? 'border-4 scale-105' : ''}
                  `}
                  style={{
                    left: `${roi.x}px`,
                    top: `${roi.y}px`,
                    width: `${roi.width}px`,
                    height: `${roi.height}px`,
                  }}
                  onClick={() => setSelectedROI(selectedROI?.id === roi.id ? null : roi)}
                >
                  <div className="absolute -top-6 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {roi.confidence}% - {roi.finding}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Info Bar */}
          <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm">
            <div className="flex items-center justify-between">
              <div>
                Analysis completed in 2.3 seconds
              </div>
              <div>
                {selectedImage.rois.length} regions of interest detected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}