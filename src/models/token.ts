import type { Prisma, Token } from "@prisma/client";
import DB from "../utils/database";

export const store = async (
  values: Prisma.TokenUncheckedCreateInput
): Promise<Token> => {
  return await DB.token.create({
    data: values,
  });
};

export const update = async (
  values: Prisma.TokenUpdateInput,
  tokenId: number
): Promise<Token> => {
  return await DB.token.update({
    where: {
      id: tokenId,
    },
    data: values,
  });
};
