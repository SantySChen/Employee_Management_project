import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import routes from "./routes";
import { seedRouter } from "./seedRouter";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/employeemanagementdb";
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("conected to mongodb");
  })
  .catch(() => {
    console.log("error mongodb");
  });

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use('/api', routes)
app.use('/api/seed', seedRouter)

app.get('/', (req, res) => {
  res.send('Employee Management API is running')
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
