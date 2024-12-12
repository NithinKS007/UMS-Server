import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;

export const generateAccessToken = (userId: string, role: string): string => {
  const payload = {
    id: userId,
    role: role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const generateRefreshToken = (userId: string, role: string): string => {
  const payload = {
    id: userId,
    role: role,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};
export const authenticateAccessToken = (token: string):{id:string,role:string} => {
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
  return decoded;
};

export const authenticateRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string, role: string };
  return decoded;
};
