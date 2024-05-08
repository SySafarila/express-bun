import express from "express";
import {
  roleDelete,
  roleRead,
  roleStore,
  roleUpdate,
} from "../controllers/rolePermissionController";
import authMiddleware from "../middlewares/authMiddleware";

const rolePermission = express.Router();

// roles
rolePermission.post("/roles", authMiddleware, roleStore);
rolePermission.delete("/roles", authMiddleware, roleDelete);
rolePermission.patch("/roles", authMiddleware, roleUpdate);
rolePermission.get("/roles", authMiddleware, roleRead);

// permissions

export default rolePermission;
