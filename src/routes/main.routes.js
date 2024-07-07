import { Router } from "express";
import { createuser } from "../controlers/auth/register.controler.js";
import { Login } from "../controlers/auth/login.controler.js";
import { GetUser } from "../controlers/users.js";
import { organisationsRouter } from "./organisations.Routes.js";

export const mainRouter = Router();

mainRouter.post("/auth/register", createuser);
mainRouter.post("/auth/login", Login);
mainRouter.get("/api/users/:id", GetUser);
mainRouter.use("/api/organisations", organisationsRouter);
mainRouter.use("/", (req, res) => {
  res.json("We are live");
});
