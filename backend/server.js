const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'] // Include both frontend ports
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your-db-password',
  database: 'kraftkart'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server for Admin!');
});

// Admin routes
app.get('/api/admin/orders', (req, res) => {
  const query = 'SELECT order_id, user_id, total_amount, status FROM orders';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});

app.get('/api/admin/orders/stats', (req, res) => {
  const totalQuery = 'SELECT COUNT(*) as totalOrders FROM orders';
  const pendingQuery = 'SELECT COUNT(*) as pendingOrders FROM orders WHERE status = ?'; // Use 'Placed' for pending
  db.query(totalQuery, (err, totalResult) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(pendingQuery, ['Placed'], (err, pendingResult) => { // Set to 'Placed'
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        totalOrders: totalResult[0].totalOrders || 0,
        pendingOrders: pendingResult[0].pendingOrders || 0
      });
    });
  });
});

app.get('/api/admin/orders/sales-by-user', (req, res) => {
  const { userId } = req.query;
  const query = `
    SELECT DATE(created_at) as sale_date, SUM(total_amount) as total_sales
    FROM orders
    WHERE ${userId ? 'user_id = ?' : '1=1'}
    GROUP BY DATE(created_at)
    ORDER BY sale_date ASC
  `;
  db.query(query, [userId || null], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Query results:', results);
    if (results.length === 0) console.log('No sales data found for userId:', userId);
    const salesData = results.map(row => ({
      sale_date: row.sale_date,
      total_sales: row.total_sales || 0
    }));
    res.json(salesData);
  });
});

app.get('/api/admin/users', (req, res) => {
  const query = 'SELECT user_id, name FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(5001, () => {
  console.log('Admin Server running on port 5001');
});
