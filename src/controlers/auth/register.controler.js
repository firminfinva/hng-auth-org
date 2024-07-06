import prisma from "./../../dbconnexion.js";
import bcrypt from "bcrypt";

export async function createuser(req, res) {
  try {
    const userwithemail = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (userwithemail) {
      res.status(400).json({ message: "Email already exists" });
    }
    const { password } = req.body;
    const cryptPassword = await bcrypt.hash(password, 10);
    req.body.password = cryptPassword;
    const newuser = await prisma.user.create({
      data: req.body,
    });
    const newOrganisation = await prisma.organisation.create({
      data: {
        name: newuser.firstName + "'s organiation ",
      },
    });
    res.status(200).json({
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
    res.status(401).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
}
