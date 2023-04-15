import swaggerAutogen from "swagger-autogen";

const doc = {
  openapi: true,
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:5000",
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        scope: {
          all: "Apply to all request",
        },
      },
    },
  },
  security: {
    bearerAuth: [],
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
