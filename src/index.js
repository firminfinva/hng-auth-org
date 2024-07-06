import express from "express";
import dotenv from "dotenv";
import { mainRouter } from "./routes/main.routes.js";

dotenv.config();

const port = process.env.PORT;

const server = express();

server.use(express.json());

server.use("/", mainRouter);

server.listen(port, () => console.log("we are live"));
