import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { router } from "./routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware

const redisHost = "localhost";
const redisPort = 6379;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "*" }));

app.options("/login", cors());
dotenv.config();

app.use("/", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
