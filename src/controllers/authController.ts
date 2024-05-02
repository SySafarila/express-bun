import type { Request, Response } from "express";
import type { AuthRequest } from "../types/customRequests";
import { signJwt } from "../utils/jwt";

export const login = (req: Request, res: Response) => {
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

  // TODO: Login logic
  //
  //
  // TODO: Login logic

  const token: string = signJwt({
    id: 1,
    time: new Date().getTime(),
  });

  res.json({
    message: "Login success",
    token: token,
  });
};

export const register = (req: Request, res: Response) => {
  const { email, password, password_confirmation, full_name } = req.body;

  if (!email || !password || !password_confirmation || !full_name) {
    return res.status(400).json({
      message:
        "Email, Password, Password Confirmation, and Full Name are required.",
    });
  }

  // TODO: register logic
  //
  //
  // TODO: register logic

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
