import { Router } from "express";
import { authorization } from "../middlewares";
import user from "./user";
import department from "./department";

const routes = Router();

routes.post("/login");
routes.use("/user", authorization, user);
routes.use("/department", authorization, department);

export default routes;
