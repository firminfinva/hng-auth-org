import jwt from "jsonwebtoken";
const SECRET_KEY = "your_secret_key";

export const generateToken = (user) => {
  const expiresIn = 3600;
  const payload = {
    userId: user.userId,
    name: user.firstName + " " + user.lastName,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JSON_WEB_TOKEN, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JSON_WEB_TOKEN);
  } catch (err) {
    return null;
  }
};
