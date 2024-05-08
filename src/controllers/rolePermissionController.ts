import type { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { ValidationError } from "joi";
import { destroy, read, store, update } from "../models/role";
import type {
  RoleDelete,
  RoleStore,
  RoleUpdate,
} from "../types/customRequests";
import DB from "../utils/database";
import {
  validateRoleDelete,
  validateRoleRequest,
  validateRoleUpdate,
} from "../validators/role";

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

export const roleRead = async (req: Request, res: Response) => {
  let arr: Role[];
  try {
    arr = await read();
  } catch (error) {
    let message: string = "Database error";

    // database error
    if (error instanceof PrismaClientKnownRequestError) {
      message = error.message;
    }

    return res.status(400).json({
      message: message,
    });
  }

  res.json({
    message: "Get all roles",
    data: arr,
  });
};

export const roleUpdate = async (req: Request, res: Response) => {
  const { name, id } = req.body as RoleUpdate;

  try {
    await validateRoleUpdate({ name: name, id: id });
    await update(id, { name: name });

    DB.$disconnect();
    res.json({
      message: "Role updated",
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

export const roleDelete = async (req: Request, res: Response) => {
  const { id } = req.body as RoleDelete;

  try {
    await validateRoleDelete({ id: id });
    await destroy(id);

    DB.$disconnect();
    res.json({
      message: "Role deleted",
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
