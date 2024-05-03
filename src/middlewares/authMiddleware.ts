import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/customRequests";
import { verifyJwt } from "../utils/jwt";

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;
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
    return res.status(401).json({
      message: "Bearer token invalid.",
    });
  }

  if (typeof token != "string") {
    return res.status(401).json({
      message: "Bearer token required.",
    });
  }

  req.token = token;

  next();
};

export default authMiddleware;
