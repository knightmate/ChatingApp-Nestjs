import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MessageCircle } from 'lucide-react';
import Login from '../components/Login';
import Register from '../components/Register';
import { login } from '../store/authSlice';

function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  const handleLogin = async (token: string) => {
    try {
      await dispatch(login({ token }));
      navigate('/messages');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-8">
          <MessageCircle className="w-10 h-10 text-blue-500" />
          <h1 className="text-3xl font-bold ml-2 text-gray-800">ChatApp</h1>
        </div>
        
        {currentView === 'login' ? (
          <>
            <Login onLogin={handleLogin} />
            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <Register onRegister={handleLogin} />
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage; 

 

