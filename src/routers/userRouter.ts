import express from "express";
import { synchRoles } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import checkPermission from "../middlewares/permissions";

const userRouter = express.Router();

userRouter.post(
  "/synch-roles",
  authMiddleware,
  checkPermission("users-update"),
  synchRoles
);

export default userRouter;
