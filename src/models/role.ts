import type { Prisma, Role } from "@prisma/client";
import DB from "../utils/database";

export const store = async (
  values: Prisma.RoleUncheckedCreateInput
): Promise<Role> => {
  return await DB.role.create({
    data: values,
  });
};
