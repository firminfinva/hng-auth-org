import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) res.json("You need to login");
    const user = jwt.verify(token, "JSON_WEB_TOKEN");
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
};

export default verifyToken;
