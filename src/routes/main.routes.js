import { Router } from "express";

export const mainRouter = Router();

mainRouter.use("/", (req, res) => {
  res.json(
    "We are live , you use this link to access the documentation https://docs.google.com/document/d/1knXcytncEIfKDhqP0boV20-PBVWNfVEnG-4vVTlxFYc/edit"
  );
});
