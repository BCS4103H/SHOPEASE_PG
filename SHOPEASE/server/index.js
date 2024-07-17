const express = require('express');
const killPort = require('kill-port');
const app = express();

// Products route
const productsRoute = require('../routes/products'); // Adjust path if necessary

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Server running port
const PORT = process.env.PORT || 4000;

// Kill any process using the specified port
killPort(PORT)
  .then(() => {
    // Body parser middleware
    app.use(express.json());
    app.use('/products', productsRoute); // Mount the products route at /products

    // Swagger configuration
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'ShopEase API',
                version: '1.0.0',
                description: 'API documentation for ShopEase',
            },
        },
        apis: ['../routes/products.js'], // Adjust path to your products route file
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    // Serve Swagger UI at /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error(`Error killing port ${PORT}:`, err);
  });
