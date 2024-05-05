import type { NextFunction, Response } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import type { AuthRequest } from "../types/customRequests";
import type { JwtPayloadType } from "../types/jwtPayload";
import DB from "../utils/database";
import { verifyJwt } from "../utils/jwt";

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  let tokenId: number;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Bearer token required.",
    });
  }

  try {
    token = authorization?.split("Bearer ")[1];
    const payload = verifyJwt(token) as JwtPayloadType;
    tokenId = payload.token_id;

    // find and check token on database
    await DB.token.findFirstOrThrow({
      where: {
        id: payload.token_id,
        is_blacklist: false,
      },
    });
  } catch (error) {
    let message: string = "Bearer token invalid.";

    if (error instanceof JsonWebTokenError) {
      message = error.message;
    }
    if (error instanceof TokenExpiredError) {
      message = error.message;
    }
    if (error instanceof NotBeforeError) {
      message = error.message;
    }

    return res.status(401).json({
      message: message,
    });
  }

  req.token = token;
  req.tokenId = tokenId;

  next();
};

export default authMiddleware;
