const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "EfuFunds backend api",
  },
  host: "localhost:8080",
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./router/*.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
