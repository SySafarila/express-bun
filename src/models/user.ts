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
      user: true,
    },
  });
  return token.user;
};
