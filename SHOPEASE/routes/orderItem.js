// routes/orderItems.js

const express = require('express');
const router = express.Router();
const pool = require('../server/db'); // Adjust path if necessary

// Get all order items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM order_items');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single order item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM order_items WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new order item
router.post('/', async (req, res) => {
  const { order_id, product_id, quantity, sales_price } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, sales_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, product_id, quantity, sales_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing order item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { order_id, product_id, quantity, sales_price } = req.body;

  try {
    const result = await pool.query(
      'UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3, sales_price = $4 WHERE id = $5 RETURNING *',
      [order_id, product_id, quantity, sales_price, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an order item by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM order_items WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json({ message: `Order item with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
