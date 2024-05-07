import express from "express";
import { roleStore } from "../controllers/rolePermissionController";
import authMiddleware from "../middlewares/authMiddleware";

const rolePermission = express.Router();

// roles
rolePermission.post("/roles", authMiddleware, roleStore);

// permissions

export default rolePermission;
