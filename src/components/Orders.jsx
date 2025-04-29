import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/admin/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const updateStatus = (orderId, newStatus) => {
    axios.put(`http://localhost:5001/api/admin/orders/${orderId}`, { status: newStatus })
      .then(() => setOrders(orders.map(order => order.order_id === orderId ? { ...order, status: newStatus } : order)))
      .catch(error => console.error('Error updating status:', error));
  };

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Order Management</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id} className="hover:bg-gray-100">
              <td className="border p-2">{order.order_id}</td>
              <td className="border p-2">{order.user_id}</td>
              <td className="border p-2">{order.total_amount}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                <select value={status} onChange={(e) => updateStatus(order.order_id, e.target.value)} className="p-1 border rounded border-gray-300">
                  <option value="">Update Status</option>
                  <option value="Placed">Placed</option>
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;