import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="text-lg mt-2 text-gray-400">The page you are looking for does not exist.</p>
      <button
        onClick={() => window.location.href = '#home'}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
}

export default NotFound;