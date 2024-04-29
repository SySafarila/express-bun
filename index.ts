import express from "express";
import index from "./src/controllers/indexController";
import { login, logout, register } from "./src/controllers/authController";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", index);
app.post("/auth/register", register);
app.post("/auth/login", login);
app.post("/auth/logout", logout);

app.listen(port, () => {
  console.info(`App running on port: ${port}`);
});
