import { createClient } from "@vercel/kv";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

const client = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Handle connection errors

export default client;
