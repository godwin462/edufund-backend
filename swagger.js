const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "EduFunds backend api",
  },
  host: "localhost:8080",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
