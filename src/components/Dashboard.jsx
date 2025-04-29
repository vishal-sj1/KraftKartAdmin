import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0 });
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });

  const createOrUpdateChart = (ctx) => {
    // Destroy existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }
    // Create new chart only if there is data to display
    if (salesData.labels.length > 0) {
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: salesData.labels,
          datasets: [{
            label: 'Sales (₹)',
            data: salesData.datasets[0]?.data || [],
            borderColor: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
          }],
        },
        options: {
          responsive: true,
          scales: { 
            y: { 
              beginAtZero: true, 
              title: { display: true, text: 'Sales (₹)' },
              ticks: { stepSize: 200 }
            },
            x: { title: { display: true, text: 'Date' } }
          },
          plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
          }
        },
      });
      setChartInstance(newChart);
    } else {
      setChartInstance(null); // Clear instance if no data
    }
  };

  useEffect(() => {
    // Fetch order stats
    axios.get('http://localhost:5001/api/admin/orders/stats')
      .then(response => {
        setStats(response.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats. Ensure server is running on port 5001.');
      });

    // Fetch users
    axios.get('http://localhost:5001/api/admin/users')
      .then(response => {
        console.log('Users fetched:', response.data);
        setUsers(response.data);
      })
      .catch(err => console.error('Error fetching users:', err));

    // Fetch sales data
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin/orders/sales-by-user', {
          params: { userId: selectedUser || undefined }
        });
        console.log('Sales Data Response:', response.data);
        const data = response.data;
        if (data.length === 0) console.log('No sales data returned for userId:', selectedUser);
        setSalesData({
          labels: data.map(item => item.sale_date || item.date || 'N/A'),
          datasets: [{ data: data.map(item => item.total_sales || item.sales || 0) }]
        });
      } catch (err) {
        console.error('Error fetching sales data:', err.response?.data || err.message);
        setError('Failed to load sales data.');
      }
    };
    fetchSalesData();
  }, [selectedUser]);

  useEffect(() => {
    // Create or update chart when salesData changes
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) createOrUpdateChart(ctx);
    }
  }, [salesData]); // Re-run when salesData updates

  useEffect(() => {
    // Cleanup chart on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
        setChartInstance(null);
      }
    };
  }, []);

  const handleUserChange = (e) => {
    console.log('Selected User ID:', e.target.value);
    setSelectedUser(e.target.value);
  };

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Admin Dashboard</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Pending Orders</h2>
          <p className="text-2xl">{stats.pendingOrders}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Sales Over Time</h2>
        <div className="mb-4">
          <label className="mr-2">Filter by User:</label>
          <select value={selectedUser} onChange={handleUserChange} className="p-2 border rounded">
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.name || `User ${user.user_id}`}
              </option>
            ))}
          </select>
        </div>
        <canvas ref={chartRef} id="salesChart" className="w-full h-64"></canvas>
        {salesData.labels.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-2">No sales data available for the selected user.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;