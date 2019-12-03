import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: { // API informations (required)
    description: 'A sample API', // Description (optional)
    title: 'Nice backend', // Title (required)
    version: '1.0.0' // Version (required)
  }
}

// Options for the swagger docs
const options = {
  apis: ['./src/routes/*.ts'],
  // Import swaggerDefinitions
  swaggerDefinition,
}

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
