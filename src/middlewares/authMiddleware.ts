import type { NextFunction, Response } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import type { AuthRequest } from "../types/customRequests";
import { verifyJwt } from "../utils/jwt";

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Bearer token required.",
    });
  }

  try {
    token = authorization?.split("Bearer ")[1];
    verifyJwt(token);
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

  next();
};

export default authMiddleware;
