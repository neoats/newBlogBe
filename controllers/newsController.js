import { response } from "express";
import { getData } from "../services/newsApi.js";

export const news = async (req, res) => {
  try {
    const responseData = await getData(); // Await the Promise from getData
    console.log(responseData);
    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
