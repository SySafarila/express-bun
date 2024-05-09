import express from "express";
import {
  roleDelete,
  roleRead,
  roleStore,
  roleUpdate,
} from "../controllers/rolePermissionController";
import authMiddleware from "../middlewares/authMiddleware";
import checkPermission from "../middlewares/permissions";

const rolePermission = express.Router();

// roles
rolePermission.post(
  "/roles",
  authMiddleware,
  checkPermission("roles-create"),
  roleStore
);
rolePermission.delete(
  "/roles",
  authMiddleware,
  checkPermission("roles-delete"),
  roleDelete
);
rolePermission.patch(
  "/roles",
  authMiddleware,
  checkPermission("roles-update"),
  roleUpdate
);
rolePermission.get(
  "/roles",
  authMiddleware,
  checkPermission("roles-read"),
  roleRead
);

// permissions

export default rolePermission;
