import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white p-4 h-full">
    <h3 className="text-xl font-bold mb-4">Admin Panel</h3>
    <nav className="space-y-2">
      <Link to="/admin" className="block p-2 hover:bg-[#5ba39c] rounded">Dashboard</Link>
      <Link to="/orders" className="block p-2 hover:bg-[#5ba39c] rounded">Orders</Link>
    </nav>
  </div>
);

export default Sidebar;