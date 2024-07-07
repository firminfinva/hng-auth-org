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
        email: req.body.email,
      },
    });
    if (userwithemail) {
      return res.status(422).json({ message: "Email already exists" });
    }

    const organisation = await prisma.organisation.create({
      data: {
        name: req.body.firstName + "'s organiation ",
      },
    });

    const cryptPassword = await bcrypt.hash(password, 10);
    req.body.password = cryptPassword;
    const newuser = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        organisations: {
          connect: {
            orgId: organisation.orgId,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: "eyJh...",
        user: {
          userId: newuser.userId,
          firstName: newuser.firstName,
          lastName: newuser.lastName,
          email: newuser.email,
          phone: newuser.phone,
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
