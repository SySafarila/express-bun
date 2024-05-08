import type { Prisma, Role } from "@prisma/client";
import DB from "../utils/database";

export const store = async (
  values: Prisma.RoleUncheckedCreateInput
): Promise<Role> => {
  return await DB.role.create({
    data: values,
  });
};

export const update = async (
  id: number,
  values: Prisma.RoleUpdateInput
): Promise<Role> => {
  return await DB.role.update({
    where: {
      id: id,
    },
    data: values,
  });
};

export const destroy = async (id: number): Promise<Role> => {
  return await DB.role.delete({
    where: {
      id: id,
    },
  });
};

export const read = async (): Promise<Role[]> => {
  return await DB.role.findMany({
    orderBy: {
      created_at: "asc",
    },
  });
};
