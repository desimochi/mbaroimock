// components/Toast.js
import { useEffect } from 'react';

export default function Toast({ message, show, setShow, type = "success", duration = 3000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, setShow]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type] || 'bg-gray-800';

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-4 rounded-lg ${bgColor} px-6 py-4 text-white shadow-lg transition-all`}>
      <span>{message}</span>
      <button onClick={() => setShow(false)} className="ml-4 text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
}
