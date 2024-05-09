import type { NextFunction, Request } from "express";
import type { AuthRespnose } from "../types/customResponses";

const checkPermission = (permission: string) => {
  return async (req: Request, res: AuthRespnose, next: NextFunction) => {
    const { permissions } = res.locals;

    if (permissions && permissions.includes(permission)) {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
  };
};

export default checkPermission;
