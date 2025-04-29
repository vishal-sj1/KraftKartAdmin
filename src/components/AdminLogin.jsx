import React, { useState } from 'react';

const AdminLogin = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'vish@l31545') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 border rounded border-gray-300"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded border-gray-300"
            required
          />
          <button type="submit" className="w-full p-2 bg-green-700 text-white rounded hover:bg-pink-600">
            Login
          </button>
        </form>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;