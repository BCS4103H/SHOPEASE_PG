// routes/orders.js

const express = require('express');
const router = express.Router();
const pool = require('../server/db'); // Adjust path if necessary

// GET all orders
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET an order by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM orders WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// DELETE an order by ID
router.delete('/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);

        if (result.rowCount === 1) {
            res.json({ message: `Order with ID ${orderId} deleted successfully` });
        } else {
            res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CREATE a new order
router.post('/', async (req, res) => {
    const { customer_id, total_amount, order_date, status } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO orders (customer_id, total_amount, order_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [customer_id, total_amount, order_date, status]
        );

        res.status(201).json(result.rows[0]); // Return the newly created order
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE an order by ID
router.put('/:id', async (req, res) => {
    const orderId = req.params.id;
    const { customer_id, total_amount, order_date, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE orders SET customer_id = $1, total_amount = $2, order_date = $3, status = $4 WHERE id = $5 RETURNING *',
            [customer_id, total_amount, order_date, status, orderId]
        );

        if (result.rowCount === 1) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
