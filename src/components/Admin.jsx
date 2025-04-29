import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Orders from './Orders';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuthenticated'));

  if (!isAuthenticated) {
    return <AdminLogin setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-green-700 text-white text-center py-4 shadow-md">
        <h1 className="text-2xl font-bold">Kraftkart</h1>
      </header>
      {/* Divider */}
      <div className="border-b border-gray-300"></div>
      {/* Main content with sidebar and routes */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;