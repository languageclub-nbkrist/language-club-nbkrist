import React from 'react';

function MessageBox({ type, text, onClose }) {
  let bgColor = '';
  let borderColor = '';
  let textColor = '';

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      borderColor = 'border-green-400';
      textColor = 'text-green-700';
      break;
    case 'error':
      bgColor = 'bg-red-100';
      borderColor = 'border-red-400';
      textColor = 'text-red-700';
      break;
    case 'info':
      bgColor = 'bg-blue-100';
      borderColor = 'border-blue-400';
      textColor = 'text-blue-700';
      break;
    default:
      bgColor = 'bg-gray-100';
      borderColor = 'border-gray-400';
      textColor = 'text-gray-700';
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      <div className={`${bgColor} ${borderColor} border p-4 rounded-lg shadow-lg max-w-sm w-full z-50`}>
        <div className="flex justify-between items-center">
          <p className={`${textColor} font-semibold`}>{text}</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;