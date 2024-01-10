import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { router } from "./routes.js";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
/* 
 const client = createClient();

client.on("connect", () => {
  console.log("Connected to Redis");
}); */

const app = express();

// Middleware
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
