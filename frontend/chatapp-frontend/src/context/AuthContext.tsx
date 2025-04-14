import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: number; username: string } | null;
  login: (token: string, user: { id: number; username: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored credentials on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (token && storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          setIsAuthenticated(true);
          setUser({
            id: userInfo.id,
            username: userInfo.username
          });
        } catch (error) {
          // If there's an error parsing the stored data, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: { id: number; username: string }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    logoutApi();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      login, 
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 