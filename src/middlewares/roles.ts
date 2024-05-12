import type { NextFunction, Request } from "express";
import type { AuthRespnose } from "../types/customResponses";

const checkRole = (role: string) => {
  return async (req: Request, res: AuthRespnose, next: NextFunction) => {
    const { roles } = res.locals;

    if (
      (roles && roles.includes(role)) ||
      (roles && roles.includes("super-admin")) // bypass if current user have super-admin role
    ) {
      return next();
    } else {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
  };
};

export default checkRole;
