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
  tokenId: number,
  values: Prisma.TokenUpdateInput
): Promise<Token> => {
  return await DB.token.update({
    where: {
      id: tokenId,
    },
    data: values,
  });
};

export const findFirstOrThrow = async (token_id: number): Promise<Token> => {
  return await DB.token.findFirstOrThrow({
    where: {
      id: token_id,
      is_blacklist: false,
    },
  });
};
