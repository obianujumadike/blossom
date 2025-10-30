import Link from 'next/link';
import { BossomLogo } from '@/components/ui/BossomLogo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <BossomLogo size="md" />
          <span className="text-2xl font-bold text-gray-900">Bossom</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/cases"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Cases
          </Link>
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-bossom-500 text-white px-6 py-2.5 rounded-full hover:bg-bossom-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="text-center">
          {/* Welcome Badge */}
          <div className="inline-flex items-center bg-pink-50 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-pink-200">
            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
            Welcome to Bossom
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered
            <span className="bg-gradient-to-r from-bossom-500 to-pink-600 bg-clip-text text-transparent block mt-2">
              Breast Cancer Detection
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Advanced mammogram analysis with AI assistance to support radiologists 
            in early detection and improved patient outcomes. Clinically validated 
            and NDPR compliant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/signup"
              className="bg-bossom-500 text-white px-8 py-4 rounded-2xl hover:bg-bossom-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 font-semibold text-lg"
            >
              View Demo
            </Link>
          </div>

          {/* Hero Visual - Matching mockup style */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 border border-gray-100">
              {/* Main Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Analysis Results */}
                <div className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Real-time Analysis</h3>
                  </div>
                  
                  {/* AI Confidence Card */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">AI Confidence Score</h4>
                      <span className="text-2xl font-bold text-pink-600">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-1000" style={{width: '94.2%'}}></div>
                    </div>
                  </div>

                  {/* BI-RADS Assessment */}
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <h4 className="font-semibold text-gray-900 mb-2">BI-RADS Assessment</h4>
                    <div className="text-3xl font-bold text-green-600 mb-1">Category 2</div>
                    <div className="text-green-700 font-medium">Benign finding</div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">2.3s</div>
                      <div className="text-blue-700 text-sm font-medium">Analysis Time</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="text-2xl font-bold text-purple-600">99.7%</div>
                      <div className="text-purple-700 text-sm font-medium">Accuracy Rate</div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Medical Image Viewer */}
                <div className="bg-gray-900 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="text-white font-semibold text-lg mb-2">Mammogram Analysis</h4>
                    <p className="text-gray-400">Advanced AI detection with region highlighting</p>
                    
                    {/* ROI Indicators */}
                    <div className="mt-6 flex justify-center space-x-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Designed for Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced features built with clinical workflows and patient safety in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Assisted Analysis</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Advanced machine learning models trained on thousands of mammograms 
                to detect anomalies with clinical-grade accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">NDPR Compliant</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Built with Nigerian data protection regulations in mind, 
                ensuring patient privacy and data security at every step.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Clinical Dashboard</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Comprehensive workflow management with case tracking, 
                reporting, and seamless integration with existing systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-bossom-500 to-pink-600 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl lg:text-2xl text-pink-100 mb-12 leading-relaxed">
            Join leading healthcare institutions using Bossom for improved 
            diagnostic accuracy and patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cases"
              className="inline-block bg-white text-bossom-600 px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              View Cases Dashboard
            </Link>
            <Link
              href="/signup"
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-2xl hover:bg-white hover:text-bossom-600 transition-all duration-200 font-bold text-xl"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <BossomLogo size="md" />
                <span className="text-2xl font-bold">Bossom</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                AI-powered breast cancer detection platform designed for healthcare 
                professionals. Improving diagnostic accuracy and patient outcomes.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Bossom. All rights reserved. Made with ❤️ for healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
