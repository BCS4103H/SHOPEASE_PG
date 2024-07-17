const swaggerJsdoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'ShopEase API',
        version: '1.0.0',
        description: 'API documentation for ShopEase, an online retail platform',
    },
    servers: [
        {
            url: 'http://localhost:3000', // Replace with your server URL
            description: 'Development server',
        },
    ],
};

// Options for the swagger-jsdoc plugin
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes folder
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
