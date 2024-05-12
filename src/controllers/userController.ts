import type { Request, Response } from "express";
import { ValidationError } from "joi";
import { synchRoles as synch } from "../models/user";
import type { UserSynchRoles } from "../types/customRequests";
import DB from "../utils/database";
import { validateSynchRoles } from "../validators/user";

export const synchRoles = async (req: Request, res: Response) => {
  const { roles, user_id } = req.body as UserSynchRoles;
  try {
    await validateSynchRoles({ user_id: user_id, roles: roles });

    const validRoleIds: Array<number> = [];
    await DB.$transaction(async (trx) => {
      await trx.user.findFirstOrThrow({
        where: {
          id: user_id,
        },
      });
      const checkRoles = await trx.role.findMany({
        where: {
          id: {
            in: roles,
          },
        },
      });
      checkRoles.forEach((role) => {
        validRoleIds.push(role.id);
      });
    });

    await synch(user_id, validRoleIds);

    return res.json({
      message: "Roles synchronized",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.json({
      message: "Invalid request",
    });
  }
};
