import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { ValidationError } from "joi";
import type { LoginRequest, RegisterRequest } from "../types/customRequests";
import type { AuthRespnose } from "../types/customResponses";
import type { User, UserPublic } from "../types/models";
import DB from "../utils/database";
import { signJwt } from "../utils/jwt";
import randomizer from "../utils/randomizer";
import { validateLogin, validateRegister } from "../validators/authentication";

export const login = async (req: Request, res: Response) => {
  const { email, password, remember } = req.body as LoginRequest;
  let userId, tokenId: number;
  let token: string;

  // generate random string
  const randomizerValue: string = randomizer(5);

  try {
    // validate
    await validateLogin({
      email,
      password,
      remember,
    });

    // check user email
    const user = await DB.user.findFirstOrThrow({
      where: {
        email: email,
      },
    });

    // check user password
    if (!Bun.password.verifySync(password, user.password)) {
      throw new Error("Credentials not match");
    }

    // set user ID
    userId = user.id;

    // save token to database
    const saveToken = await DB.token.create({
      data: {
        randomizer: randomizerValue,
        user_id: userId,
        ip: req.ip ?? null,
        user_agent: req.headers["user-agent"] ?? null,
      },
    });

    // set token ID
    tokenId = saveToken.id;

    token = signJwt({
      user_id: userId,
      randomizer: randomizerValue,
      token_id: tokenId,
    });
    await DB.$disconnect();
  } catch (error) {
    // error validation
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    // error database
    if (error instanceof PrismaClientKnownRequestError) {
      await DB.$disconnect();
      if (error.code === "P2025") {
        return res.status(400).json({
          message: "Email not registered.",
        });
      }
      return res.status(500).json({
        message: error.message,
      });
    }

    // password or email not match
    return res.status(400).json({
      message: "Credentials not match",
    });
  }

  res.json({
    message: "Login success",
    token: token,
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, password_confirmation, full_name } =
    req.body as RegisterRequest;

  try {
    // validate
    await validateRegister({
      email,
      password,
      password_confirmation,
      full_name,
    });

    // hash password
    const password_hash = await Bun.password.hash(password);

    // prepare user's data to save to database
    const user: User = {
      email: email,
      full_name: full_name,
      password: password_hash,
    };

    // save to database
    await DB.user.create({
      data: user,
    });

    await DB.$disconnect();
  } catch (error) {
    await DB.$disconnect();

    // validation error
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    // database error
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({
          message: "Email already registered.",
        });
      }
    }

    // bad request
    return res.status(400).json({
      message: "Request invalid.",
    });
  }

  res.json({
    message: "Register success.",
  });
};

export const logout = async (req: Request, res: AuthRespnose) => {
  const { tokenId } = res.locals;

  try {
    // blacklist token
    await DB.token.update({
      where: {
        id: tokenId,
      },
      data: {
        is_blacklist: true,
      },
    });

    DB.$disconnect();
  } catch (error) {
    DB.$disconnect();
    return res.status(500).json({
      message: "Cannot blacklist current token",
    });
  }

  res.json({
    message: "Logout success.",
  });
};

export const me = async (req: Request, res: AuthRespnose) => {
  const { tokenId } = res.locals;

  let user: UserPublic;

  try {
    // check token
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
    DB.$disconnect();
  } catch (error) {
    DB.$disconnect();

    // database error
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
