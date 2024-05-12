import cors from "cors";
import express from "express";
import index from "./src/controllers/indexController";
import { authRouter, rolePermissionRouter } from "./src/routers/index";
import userRouter from "./src/routers/userRouter";

const app = express();
const port = Bun.env.RUNNING_PORT ?? 3000;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/", index);
app.use("/auth", authRouter);
app.use("/admin", rolePermissionRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.info(`App running on port: ${port}`);
});

export { app };
