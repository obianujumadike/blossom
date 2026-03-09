import Link from 'next/link'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600 mb-6">Report generation features are coming in a future release.</p>
        <Link href="/dashboard" className="text-bossom-pink-600 hover:text-bossom-pink-700 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
