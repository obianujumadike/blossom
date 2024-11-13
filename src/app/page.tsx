// src/app/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-pink-50 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Welcome to {process.env.NEXT_PUBLIC_APP_NAME}</h1>
      
      <div className="w-full max-w-md bg-white p-6 rounded shadow-lg">
        <input type="file" onChange={handleFileChange} accept="image/*" className="mb-4"/>
        
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className="w-full py-2 px-4 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:bg-gray-300"
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
        
        {analysisResult && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
