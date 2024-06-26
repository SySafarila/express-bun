import type { Prisma, User } from "@prisma/client";
import type { UserPublic } from "../types/models";
import DB from "../utils/database";

export const findFirstOrThrow = async (values: {
  email: string;
}): Promise<User> => {
  return await DB.user.findFirstOrThrow({
    where: values,
  });
};

export const store = async (values: Prisma.UserCreateInput): Promise<User> => {
  return await DB.user.create({
    data: values,
  });
};

export const getCurrentUser = async (tokenId: number): Promise<UserPublic> => {
  const token = await DB.token.findFirstOrThrow({
    where: {
      id: tokenId,
    },
    include: {
      user: {
        select: {
          full_name: true,
          email: true,
          verified_at: true,
        },
      },
    },
  });
  return token.user;
};

export const getRolesAndPermissions = async (
  user_id: number
): Promise<{ roles: Array<string>; permissions: Array<string> }> => {
  const roles: Array<string> = [];
  const permissions: Array<string> = [];

  const rolesAndPermissions = await DB.user.findFirstOrThrow({
    where: {
      id: user_id,
    },
    select: {
      roles: {
        select: {
          name: true,
          permissions: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  rolesAndPermissions.roles.forEach((role) => {
    roles.push(role.name);
    role.permissions.forEach((permission) => {
      permissions.push(permission.name);
    });
  });

  return {
    roles,
    permissions,
  };
};

export const synchRoles = async (user_id: number, _roles: Array<number>) => {
  const roles = _roles.map((n) => ({ ["id"]: n }));

  return await DB.$transaction(async (trx) => {
    await DB.user.update({
      where: {
        id: user_id,
      },
      include: {
        roles: true,
      },
      data: {
        roles: {
          set: [],
        },
      },
    });

    return await DB.user.update({
      where: {
        id: user_id,
      },
      data: {
        roles: {
          connect: roles,
        },
      },
      select: {
        id: true,
        full_name: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  });
};
