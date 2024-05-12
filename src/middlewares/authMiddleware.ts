import type { NextFunction, Request } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { getRolesAndPermissions } from "../models/user";
import type { AuthRespnose } from "../types/customResponses";
import type { JwtPayloadType } from "../types/jwtPayload";
import { verifyJwt } from "../utils/jwt";
import { findFirstOrThrow, update } from "../models/token";

const authMiddleware = async (
  req: Request,
  res: AuthRespnose,
  next: NextFunction
) => {
  const clientIp = req.ip;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Bearer token required.",
    });
  }

  try {
    const token = authorization?.split("Bearer ")[1];
    const { token_id, user_id } = verifyJwt(token) as JwtPayloadType;

    // get roles and permissions
    const rolesAndPermissions = await getRolesAndPermissions(user_id);
    const { permissions, roles } = rolesAndPermissions;

    // find and check token on database
    const check = await findFirstOrThrow(token_id);
    if (!check.ip) {
      await update(token_id, {
        ip: clientIp,
      });
    }

    res.locals.tokenId = token_id;
    res.locals.permissions = permissions;
    res.locals.roles = roles;

    return next();
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
};

export default authMiddleware;
