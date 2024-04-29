import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../utils/customRequests";

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | null | undefined = null;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Bearer token required.",
    });
  }

  try {
    token = authorization?.split("Bearer ")[1];
  } catch (error) {
    token = null;
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
