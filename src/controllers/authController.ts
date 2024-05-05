import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import type { AuthRequest } from "../types/customRequests";
import type { User, UserPublic } from "../types/models";
import DB from "../utils/database";
import { signJwt } from "../utils/jwt";
import randomizer from "../utils/randomizer";

export const login = async (req: Request, res: Response) => {
  const { email, password, remember = false } = req.body;
  let userId: number;
  let tokenId: number;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password are required.",
    });
  }

  if (remember && typeof remember != "boolean") {
    return res.status(400).json({
      message: "Remember must be boolean.",
    });
  }

  try {
    const user = await DB.user.findFirstOrThrow({
      where: {
        email: email,
      },
    });

    if (!Bun.password.verifySync(password, user.password)) {
      throw new Error("Credentials not match");
    }
    userId = user.id;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(400).json({
        message: "Email not registered.",
      });
    }

    return res.status(400).json({
      message: "Credentials not match",
    });
  }

  const randomizerValue: string = randomizer(5);
  try {
    const saveToken = await DB.token.create({
      data: {
        randomizer: randomizerValue,
        user_id: userId,
        ip: req.ip ?? null,
        user_agent: req.headers["user-agent"] ?? null,
      },
    });
    tokenId = saveToken.id;
  } catch (error) {
    return res.status(500).json({
      message: "Cannot save token to database",
    });
  }

  const token: string = signJwt({
    user_id: userId,
    randomizer: randomizerValue,
    token_id: tokenId,
  });

  res.json({
    message: "Login success",
    token: token,
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, password_confirmation, full_name } = req.body;

  if (!email || !password || !password_confirmation || !full_name) {
    return res.status(400).json({
      message:
        "Email, Password, Password Confirmation, and Full Name are required.",
    });
  }

  const password_hash = await Bun.password.hash(password);
  const user: User = {
    email: email,
    full_name: full_name,
    password: password_hash,
  };

  try {
    await DB.user.create({
      data: user,
    });

    await DB.$disconnect();
  } catch (error) {
    await DB.$disconnect();

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          message: "Email already registered.",
        });
      }
    }

    return res.status(400).json({
      message: "Request invalid.",
    });
  }

  res.json({
    message: "Register success.",
  });
};

export const logout = async (req: AuthRequest, res: Response) => {
  const { token, tokenId } = req;

  try {
    await DB.token.update({
      where: {
        id: tokenId,
      },
      data: {
        is_blacklist: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot blacklist current token",
    });
  }

  res.json({
    message: "Logout success.",
  });
};

export const me = async (req: AuthRequest, res: Response) => {
  const { tokenId } = req;
  let user: UserPublic;

  try {
    const check = await DB.token.findFirstOrThrow({
      where: {
        id: tokenId,
      },
      include: {
        user: true,
      },
    });
    user = {
      email: check.user.email,
      full_name: check.user.full_name,
      verified_at: check.user.verified_at,
    };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(500).json({
        message: "Token not found.",
      });
    }

    return res.status(500).json({
      message: "Unable to find your token",
    });
  }

  res.json({
    message: "Success get current user.",
    user: user,
  });
};
