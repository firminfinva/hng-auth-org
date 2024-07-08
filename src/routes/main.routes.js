import { Router } from "express";
import { createuser } from "../controlers/auth/register.controler.js";
import { Login } from "../controlers/auth/login.controler.js";
import { GetUser } from "../controlers/users.js";
import { organisationsRouter } from "./organisations.Routes.js";
import verifyToken from "../controlers/auth/verifyToken.js";

const mainRouter = Router();

mainRouter.post("/auth/register", createuser);
mainRouter.post("/auth/login", Login);
mainRouter.get("/api/users/:id", verifyToken, GetUser);
mainRouter.use("/api/organisations", verifyToken, organisationsRouter);
mainRouter.use("/", (req, res) => {
  res.json("We are live");
});

export default mainRouter;
