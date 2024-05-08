import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { ValidationError } from "joi";
import { store } from "../models/role";
import type { RoleStore } from "../types/customRequests";
import DB from "../utils/database";
import { validateRoleRequest } from "../validators/role";

export const roleStore = async (req: Request, res: Response) => {
  const { name } = req.body as RoleStore;

  try {
    await validateRoleRequest({ name: name });
    await store({ name: name });

    DB.$disconnect();
    res.json({
      message: "Role created",
    });
  } catch (error) {
    DB.$disconnect();

    let message: string = "Role name must be unique, and not duplicate";

    // validation error
    if (error instanceof ValidationError) {
      message = error.message;
    }

    // database error
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        message = "Role name must be unique, and not duplicate";
      } else {
        message = error.message;
      }
    }
    return res.status(400).json({
      message: message,
    });
  }
};
