const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
        title: 'Teamwork APIs documentation',
        version: '1.0.0',
        description: 'Endpoints to test the DevC Training with Andela Capstone Project routes',
    },
    host: 'localhost:3000',
    basePath: '/api/v1/',
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['**/*.yaml'],
};

module.exports = swaggerJSDoc(options);
