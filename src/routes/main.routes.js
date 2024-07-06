import { Router } from "express";
import { createuser } from "../controlers/auth/register.controler.js";
import { Login } from "../controlers/auth/login.controler.js";

export const mainRouter = Router();

mainRouter.post("/auth/register", createuser);
mainRouter.post("/auth/login", Login);
mainRouter.use("/", (req, res) => {
  res.json(
    "We are live , you use this link to access the documentation https://docs.google.com/document/d/1knXcytncEIfKDhqP0boV20-PBVWNfVEnG-4vVTlxFYc/edit"
  );
});
