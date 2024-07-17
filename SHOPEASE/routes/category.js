// routes/categories.js

const express = require('express');
const router = express.Router();
const pool = require('../server/db'); // Adjust path if necessary

// GET all categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET a category by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM categories WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);

        if (result.rowCount === 1) {
            res.json({ message: `Category with ID ${categoryId} deleted successfully` });
        } else {
            res.status(404).json({ error: `Category with ID ${categoryId} not found` });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CREATE a new category
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );

        res.status(201).json(result.rows[0]); // Return the newly created category
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE a category by ID
router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, categoryId]
        );

        if (result.rowCount === 1) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: `Category with ID ${categoryId} not found` });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
