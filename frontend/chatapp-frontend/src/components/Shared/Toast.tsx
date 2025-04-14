import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/authSlice';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed top-4 right-4 ${bgColor[type]} text-white px-4 py-2 rounded shadow-lg`}>
      {message}
    </div>
  );
};

export default Toast; 