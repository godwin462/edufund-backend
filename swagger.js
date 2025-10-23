const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "EduFunds backend api",
  },
  // host: "localhost:8080",
  servers: [
    { url: "http://localhost:8080", description: "Local server" },
    {
      url: "https://edufund-backend-os2x.onrender.com",
      description: "Production server",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
      definition: "JWT Authorization header using the Bearer scheme.",
    },
  },
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
