import { useState } from 'react';
import CustomerChat from '../components/CustomerChat';

function Landing() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block mb-4">
            <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            AI Chatbot System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Welcome to our intelligent chat assistant
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">System is running</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-3">
              <svg
                className="w-10 h-10 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Responses
            </h3>
            <p className="text-gray-600 text-sm">
              Get immediate answers to your questions with our AI-powered chatbot
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-3">
              <svg
                className="w-10 h-10 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600 text-sm">
              Your conversations are encrypted and kept secure at all times
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-3">
              <svg
                className="w-10 h-10 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              24/7 Available
            </h3>
            <p className="text-gray-600 text-sm">
              Chat with us anytime, anywhere - we're always here to help
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowChat(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg"
          >
            Start Chatting Now
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Or click the chat button in the bottom-right corner anytime
          </p>
        </div>

        {/* Admin Link */}
        <div className="text-sm text-gray-500">
          <a
            href="/admin"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Admin Login
          </a>
          {' • '}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Login
          </a>
        </div>
      </div>

      {/* Chat Component - Always available in bottom-right */}
      <CustomerChat />
    </div>
  );
}

export default Landing;

