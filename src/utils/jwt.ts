import jwt, { type JwtPayload } from "jsonwebtoken";
import type { JwtPayloadType } from "../types/jwtPayload";

const secretKey: string = process.env.JWT_SECRET ?? "secret";

export const signJwt = (payload: JwtPayloadType): string => {
  const token: string = jwt.sign(payload, secretKey, { expiresIn: "3h" });
  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const decoded: string | JwtPayload = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token.");
  }
};
