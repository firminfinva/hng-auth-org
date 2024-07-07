import { Router } from "express";
import {
  AddUserToOrganisation,
  CreateOrganisation,
  GetAllOrganisations,
  GetOrganisation,
} from "../controlers/organisations.js";

export const organisationsRouter = Router();
organisationsRouter.post("/:orgId/users", AddUserToOrganisation);
organisationsRouter.post("/", CreateOrganisation);
organisationsRouter.get("/:orgId", GetOrganisation);
organisationsRouter.get("/", GetAllOrganisations);
