import prisma from "../../dbconnexion.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function Login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(403).json({ error: "Some fileds are required" });
    }

    const theuser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const isAuth = await bcrypt.compare(password, theuser.password);

    if (isAuth) {
      const token = jwt.sign(
        {
          name: theuser.firstName + "" + theuser.secondName,
          email: theuser.email,
        },
        "JSON_WEB_TOKEN",
        {
          expiresIn: "72h",
        }
      );
      res.json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken: token,
          user: {
            userId: theuser.userId,
            firstName: theuser.firstName,
            lastName: theuser.lastName,
            email: theuser.email,
            phone: theuser.phone,
          },
        },
      });
    } else {
      res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }
  } catch (error) {
    res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
}
