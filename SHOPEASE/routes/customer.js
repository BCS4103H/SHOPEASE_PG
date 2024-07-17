// // This line imports the Express module, which is used to set up and configure the web server.
// const express = require('express');

// // This line creates an instance of an Express router, which allows for defining routes separately and then attaching them to the main application.
// const router = express.Router();

// // This line imports a module named pool from the specified path '../server/db'. 
// // The 'pool' module is commonly used for managing database connections in applications.
// const pool = require('../server/db'); // Adjust path if necessary

// /**
//  * @swagger
//  * /customers:
//  *   get:
//  *     summary: Retrieve a list of customers
//  *     responses:
//  *       200:
//  *         description: A list of customers
//  */

// // Example endpoint to fetch all customers
// router.get('/', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM customers');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching customers:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// /**
//  * @swagger
//  * /customers/{id}:
//  *   delete:
//  *     summary: Delete a customer by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Customer with ID ${customerId} deleted successfully
//  *       404:
//  *         description: Customer not found
//  */

// // DELETE a customer by ID
// router.delete('/:id', async (req, res) => {
//     const customerId = req.params.id;

//     try {
//         // Example query to delete a customer by ID from the database
//         const result = await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);

//         if (result.rowCount === 1) {
//             res.json({ message: `Customer with ID ${customerId} deleted successfully` });
//         } else {
//             res.status(404).json({ error: `Customer with ID ${customerId} not found` });
//         }
//     } catch (error) {
//         console.error('Error deleting customer:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// /**
//  * @swagger
//  * /customers:
//  *   post:
//  *     summary: Create a new customer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *               address:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Customer created
//  */

// // CREATE a new customer
// router.post('/', async (req, res) => {
//     const { name, email, phone, address } = req.body;

//     try {
//         // Example query to insert a new customer into the database
//         const result = await pool.query(
//             'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
//             [name, email, phone, address]
//         );
//         res.json({ message: `Created successfully` });
//         res.status(201).json(result.rows[0]); // Return the newly created customer
//     } catch (error) {
//         console.error('Error creating customer:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// /**
//  * @swagger
//  * /customers/{id}:
//  *   put:
//  *     summary: Update a customer by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *               address:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Customer updated
//  *       404:
//  *         description: Customer not found
//  */

// // UPDATE a customer by ID
// router.put('/:id', async (req, res) => {
//     const customerId = req.params.id;
//     const { name, email, phone, address } = req.body;

//     try {
//         const result = await pool.query(
//             'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING *',
//             [name, email, phone, address, customerId]
//         );

//         if (result.rowCount === 1) {
//             res.json({ message: `Updated successfully` });
//             res.json(result.rows[0]);
//         } else {
//             res.status(404).json({ error: `Customer with ID ${customerId} not found` });
//         }
//     } catch (error) {
//         console.error('Error updating customer:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// /**
//  * @swagger
//  * /customers/{id}:
//  *   get:
//  *     summary: Get a customer by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *      
//  *       404:
//  *         description: Customer not found
//  */

// // GET a customer by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const query = "SELECT * FROM customers WHERE id = $1";
//         const result = await pool.query(query, [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Customer not found" });
//         }

//         res.json(result.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });

// module.exports = router;
