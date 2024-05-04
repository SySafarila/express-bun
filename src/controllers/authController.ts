import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import type { AuthRequest } from "../types/customRequests";
import type { User } from "../types/models";
import DB from "../utils/database";
import { signJwt } from "../utils/jwt";
import randomizer from "../utils/randomizer";

export const login = async (req: Request, res: Response) => {
  const { email, password, remember = false } = req.body;

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
  let userId: number;
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

  const token: string = signJwt({
    id: userId,
    randomizer: randomizer(5),
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

export const logout = (req: AuthRequest, res: Response) => {
  const { token } = req;

  // TODO: logout logic
  //
  //
  // TODO: logout logic

  res.json({
    message: "Logout success.",
  });
};
