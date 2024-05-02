import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/customRequests";

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

    // TODO: check token
    //
    //
    // TODO: check token
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
