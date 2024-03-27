import jwt from "jsonwebtoken";

const { sign } = jwt;

const generateJWT = async (payload) => {
  const token = await sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

export default generateJWT;
