import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }
    const user = jwt.verify(token, process.env.JSON_WEB_TOKEN);
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export default verifyToken;
