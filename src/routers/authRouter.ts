import express from "express";
import { login, logout, register } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
