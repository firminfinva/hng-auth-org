import { generateToken } from "../../tokenUtils.js";
import prisma from "./../../dbconnexion.js";
import bcrypt from "bcrypt";

export async function createuser(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const errors = [];

    if (!firstName) {
      errors.push({ field: "firstName", message: "First name is required" });
    }

    if (!lastName) {
      errors.push({ field: "lastName", message: "Last name is required" });
    }

    if (!email) {
      errors.push({ field: "email", message: "Email is required" });
    }

    if (!password) {
      errors.push({ field: "password", message: "Password is required" });
    }

    if (errors.length > 0) {
      return res.status(422).json({ errors });
    }

    const userwithemail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userwithemail) {
      return res.status(422).json({ message: "Email already exists" });
    }

    const organisation = await prisma.organisation.create({
      data: {
        name: `${firstName}'s organisation`,
      },
    });

    const cryptPassword = await bcrypt.hash(password, 10);
    const newuser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: cryptPassword,
        organisations: {
          connect: {
            orgId: organisation.orgId,
          },
        },
      },
    });

    const token = generateToken(newuser);
    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: newuser.userId,
          firstName: newuser.firstName,
          lastName: newuser.lastName,
          email: newuser.email,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
}
