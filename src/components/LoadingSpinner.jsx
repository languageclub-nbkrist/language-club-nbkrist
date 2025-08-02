import React from 'react';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-white text-lg ml-4">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;