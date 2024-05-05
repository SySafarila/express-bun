import cors from "cors";
import express from "express";
import index from "./src/controllers/indexController";
import authRouter from "./src/routers/authRouter";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", index);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.info(`App running on port: ${port}`);
});

export { app };
