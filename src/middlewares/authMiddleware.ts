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
  let token: string;
  let tokenId: number;
  let permissions: Array<string> = [];
  let roles: Array<string> = [];
  const clientIp = req.ip;
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

    // get roles and permissions
    const rolesAndPermissions = await getRolesAndPermissions(payload.user_id);
    permissions = rolesAndPermissions.permissions;
    roles = rolesAndPermissions.roles;

    // find and check token on database
    const check = await findFirstOrThrow(tokenId);
    if (!check.ip) {
      await update(payload.token_id, {
        ip: clientIp,
      });
    }
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

  res.locals.tokenId = tokenId;
  res.locals.permissions = permissions;
  res.locals.roles = roles;

  next();
};

export default authMiddleware;
