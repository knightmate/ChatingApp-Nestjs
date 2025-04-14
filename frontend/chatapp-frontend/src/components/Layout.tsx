import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
        </div>
        <Navigation />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 