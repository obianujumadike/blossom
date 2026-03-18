'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  FaArrowLeft, 
  FaExpand, 
  FaCompress, 
  FaSearchPlus, 
  FaSearchMinus,
  FaPlay,
  FaExclamationTriangle,
  FaEye,
  FaSpinner
} from 'react-icons/fa'
import { BossomLogo } from '@/components/ui/BossomLogo'
import { componentStyles } from '@/lib/design-system'

interface CaseData {
  id: string
  case_number: string
  status: string
  patients: { patient_id: string; age: number; gender: string } | null
  images: Array<{
    id: string
    file_name: string
    file_path: string
    laterality: string | null
    view_position: string | null
    publicUrl?: string
  }>
  analyses: Array<{
    id: string
    birads_category: number | null
    confidence_score: number | null
    malignancy_probability: number | null
    overall_assessment: string | null
    analysis_status: string
    regions_of_interest: Array<{
      id: string
      roi_type: string
      coordinates: Record<string, number>
      confidence_score: number
      malignancy_probability: number | null
      size_mm: number | null
      characteristics: Record<string, string> | null
      clinical_significance: string | null
    }>
  }>
}

export default function AnalysisPage() {
  const router = useRouter()
  const params = useParams()
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    fetch(`/api/cases/${params.id}`)
      .then(r => r.json())
      .then(d => {
        setCaseData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const runAnalysis = async (imageId: string) => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, caseId: params.id }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      // Refresh case data
      const updated = await fetch(`/api/cases/${params.id}`).then(r => r.json())
      setCaseData(updated)
    } catch (err) {
      alert('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const latestAnalysis = caseData?.analyses?.find(a => a.analysis_status === 'completed')
  const failedAnalysis = !latestAnalysis && caseData?.analyses?.some(a => a.analysis_status === 'failed')
  const rois = latestAnalysis?.regions_of_interest ?? []
  const selectedImage = caseData?.images?.[selectedImageIdx]

  const getBiradsColor = (score: number | null) => {
    if (!score) return 'text-gray-600 bg-gray-100'
    if (score <= 2) return 'text-green-600 bg-green-100'
    if (score === 3) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getROIColor = (prob: number | null) => {
    if (!prob) return 'border-blue-500 bg-blue-500/20'
    if (prob >= 0.5) return 'border-red-500 bg-red-500/20'
    if (prob >= 0.2) return 'border-yellow-500 bg-yellow-500/20'
    return 'border-green-500 bg-green-500/20'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bossom-pink-600"></div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Case not found</p>
      </div>
    )
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
                <h1 className="text-lg font-bold text-gray-900">{caseData.case_number} - AI Analysis</h1>
                <p className="text-sm text-gray-600">
                  Patient: {caseData.patients?.patient_id ?? 'N/A'} • Age: {caseData.patients?.age ?? 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
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
            {latestAnalysis ? (
              <div className="text-center mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getBiradsColor(latestAnalysis.birads_category)}`}>
                  BI-RADS {latestAnalysis.birads_category ?? '?'}
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {latestAnalysis.confidence_score ? `${Math.round(latestAnalysis.confidence_score * 100)}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Overall Confidence</div>
                </div>
                {latestAnalysis.overall_assessment && (
                  <div className="mt-3 text-sm text-gray-700">
                    <div className="font-medium mb-1">Assessment:</div>
                    <div>{latestAnalysis.overall_assessment}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                {failedAnalysis && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
                    <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                      <FaExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                      Previous analysis failed
                    </div>
                    <p className="text-red-600 text-xs mt-1">Click below to retry.</p>
                  </div>
                )}
                <p className="text-gray-500 mb-4">{failedAnalysis ? 'Analysis did not complete' : 'No analysis results yet'}</p>
                {caseData.images.length > 0 && (
                  <button
                    onClick={() => runAnalysis(caseData.images[0].id)}
                    disabled={analyzing}
                    className={`${componentStyles.button.primary} flex items-center gap-2 mx-auto`}
                  >
                    {analyzing ? (
                      <><FaSpinner className="w-4 h-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <><FaPlay className="w-4 h-4" /> {failedAnalysis ? 'Retry Analysis' : 'Run AI Analysis'}</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Image Selection */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Images ({caseData.images.length})</h3>
            {caseData.images.length === 0 ? (
              <p className="text-sm text-gray-500">No images uploaded yet</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {caseData.images.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedImageIdx === idx
                        ? 'border-bossom-pink-300 bg-bossom-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {image.file_name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {image.laterality ?? ''} {image.view_position ?? ''}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ROIs */}
          {rois.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Regions of Interest</h3>
              <div className="space-y-2">
                {rois.map((roi) => (
                  <div key={roi.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FaExclamationTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{roi.roi_type}</div>
                        <div className="text-xs text-gray-600">
                          Confidence: {Math.round(roi.confidence_score * 100)}%
                          {roi.size_mm && ` • Size: ${roi.size_mm}mm`}
                        </div>
                        {roi.clinical_significance && (
                          <div className="text-xs text-gray-500 mt-1">{roi.clinical_significance}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run Analysis Button (when already have analysis but want to re-run) */}
          {latestAnalysis && caseData.images.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => runAnalysis(caseData.images[selectedImageIdx]?.id ?? caseData.images[0].id)}
                disabled={analyzing}
                className={`${componentStyles.button.secondary} w-full flex items-center justify-center gap-2`}
              >
                {analyzing ? (
                  <><FaSpinner className="w-4 h-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><FaPlay className="w-4 h-4" /> Re-run Analysis</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Main Viewer */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {/* Viewer Controls */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="text-white text-sm font-medium">
              {selectedImage ? `${selectedImage.file_name} • ${selectedImage.laterality ?? ''} ${selectedImage.view_position ?? ''}` : 'No image selected'}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <FaSearchMinus className="w-4 h-4" />
              </button>
              <span className="text-gray-300 text-sm min-w-16 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(4, zoom + 0.25))} className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <FaSearchPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ transform: `scale(${zoom})` }}>
              {selectedImage?.publicUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedImage.publicUrl}
                  alt={selectedImage.file_name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <div className="w-96 h-96 bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <FaEye className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-sm">Mammogram Image</div>
                    <div className="text-xs">{selectedImage?.file_name ?? 'No image'}</div>
                  </div>
                </div>
              )}

              {/* ROI Overlays */}
              {rois.map((roi) => (
                <div
                  key={roi.id}
                  className={`absolute border-2 cursor-pointer transition-all duration-200 ${getROIColor(roi.malignancy_probability)}`}
                  style={{
                    left: `${roi.coordinates.x ?? 0}px`,
                    top: `${roi.coordinates.y ?? 0}px`,
                    width: `${roi.coordinates.width ?? 50}px`,
                    height: `${roi.coordinates.height ?? 50}px`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {Math.round(roi.confidence_score * 100)}% - {roi.roi_type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Bar */}
          <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm flex items-center justify-between">
            <div>{caseData.images.length} images • {rois.length} regions detected</div>
            <div>
              {latestAnalysis
                ? `BI-RADS ${latestAnalysis.birads_category} • ${Math.round((latestAnalysis.confidence_score ?? 0) * 100)}% confidence`
                : 'No analysis run yet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}