import express from "express";
import { login, logout, me, register } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/me", authMiddleware, me);

export default authRouter;
