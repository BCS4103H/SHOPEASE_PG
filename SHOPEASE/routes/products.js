const express = require('express');
const router = express.Router();
const pool = require('../server/db'); // Adjust path if necessary

/**
 * @swagger
 * /products/{productId}/total-sales:
 *   get:
 *     summary: Calculate total sales for a product.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to calculate total sales for.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                   example: 1000.00
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/:productId/total-sales', async (req, res) => {
    const { productId } = req.params;

    try {
        const query = `SELECT total_sales($1::integer) AS total_sales`;
        const result = await pool.query(query, [productId]);
        const totalSales = result.rows[0].total_sales;
        res.json({ totalSales });
    } catch (error) {
        console.error('Error calculating total sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Product Name"
 *         cost:
 *           type: number
 *           format: float
 *           example: 19.99
 *         description:
 *           type: string
 *           example: "A description of the product"
 *         category_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-07-17T00:00:00Z"
 *         inventory:
 *           type: integer
 *           example: 100
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM products WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [productId]);

        if (result.rowCount === 1) {
            res.json({ message: `Product with ID ${productId} deleted successfully` });
        } else {
            res.status(404).json({ error: `Product with ID ${productId} not found` });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, cost, description, category_id, inventory } = req.body; // Remove created_at from here

    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, cost = $2, description = $3, category_id = $4, created_at = NOW(), inventory = $5 WHERE id = $6 RETURNING *',
            [name, cost, description, category_id, inventory, productId]
        );

        if (result.rowCount === 1) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: `Product with ID ${productId} not found` });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
