import type { NextFunction, Request } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import type { AuthRespnose } from "../types/customResponses";
import type { JwtPayloadType } from "../types/jwtPayload";
import DB from "../utils/database";
import { verifyJwt } from "../utils/jwt";

const authMiddleware = async (
  req: Request,
  res: AuthRespnose,
  next: NextFunction
) => {
  let token: string;
  let tokenId: number;
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

    // find and check token on database
    const check = await DB.token.findFirstOrThrow({
      where: {
        id: payload.token_id,
        is_blacklist: false,
      },
    });
    if (!check.ip) {
      await DB.token.update({
        where: {
          id: tokenId,
        },
        data: {
          ip: clientIp,
        },
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

  next();
};

export default authMiddleware;
