const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "EduFunds backend api",
  },
  servers: [
    { url: "http://localhost:8080", description: "Local server" },
    {
      url: "https://edufund-backend-os2x.onrender.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Authorization header using the Bearer scheme.",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
