import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./utils/errorHandler.js";
import connectDB from "./connection/connectDb.js";
import taskRoute from "./routes/task.routes.js";
import setupSwagger from "./utils/swagger.js";
import ServerlessHttp from "serverless-http";
import taskAwsRouter from "./routes/task.aws.routes.js";

dotenv.config();
const app = express();

setupSwagger(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello Word");
});
app.use("/api/task", taskRoute);
// app.use("/api/aws/task", taskAwsRouter);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000} `);
  });
};

startServer();

// connectDB();

// export const handler = ServerlessHttp(app);
