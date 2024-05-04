import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  type JwtPayload,
} from "jsonwebtoken";
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
    if (error instanceof JsonWebTokenError) {
      throw new JsonWebTokenError(error.message);
    }
    if (error instanceof TokenExpiredError) {
      throw new TokenExpiredError(error.message, error.expiredAt);
    }
    if (error instanceof NotBeforeError) {
      throw new NotBeforeError(error.message, error.date);
    }
    throw new Error("Invalid token.");
  }
};
