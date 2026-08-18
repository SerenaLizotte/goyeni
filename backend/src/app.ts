import "dotenv/config";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { prisma } from "./db";
import healthRouter from "./routes/health";
import candidatesRouter from "./routes/candidates";
import employersRouter from "./routes/employers";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Goyeni API",
      version: "1.0.0",
      description: "API documentation for the Goyeni platform",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/health", healthRouter);
app.use("/candidates", candidatesRouter);
app.use("/employers", employersRouter);

export { prisma };
export default app;
